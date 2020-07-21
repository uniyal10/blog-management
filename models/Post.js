const postsCollection = require("../db").db().collection("posts")
const ObjectID = require("mongodb").ObjectID
const { post } = require("../router")

let Post = function (data, userid, requestedPostId) {
  this.data = data
  this.errors = []
  this.userid = userid
  this.requestedPostId = requestedPostId
}



  // get rid of any bogus properties
  this.data = {
    title: sanitizeHTML(this.data.title.trim(), { allowedTags: [], allowedAttributes: {} }),
    body: sanitizeHTML(this.data.body.trim(), { allowedTags: [], allowedAttributes: {} }),
    createdDate: new Date(),
    author: ObjectID(this.userid)
  }
}



Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      // save post into database
      postsCollection
        .insertOne(this.data)
        .then(info => {
          resolve(info.ops[0]._id)
        })
        .catch(e => {
          this.errors.push("Please try again later.")
          reject(this.errors)
        })
    } else {
      reject(this.errors)
    }
  })
}

Post.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Post.findSingleById(this.requestedPostId, this.userid)
      if (post.isVisitorOwner) {
        // actually update the db
        let status = await this.actuallyUpdate()
        resolve(status)
      } else {
        reject()
      }
    } catch (e) {
      reject()
    }
  })
}

Post.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      await postsCollection.findOneAndUpdate({ _id: new ObjectID(this.requestedPostId) }, { $set: { title: this.data.title, body: this.data.body } })
      resolve("success")
    } else {
      resolve("failure")
    }
  })
}

Post.reusablePostQuery = function (uniqueOperations, visitorId) {
  return new Promise(async function (resolve, reject) {
    let aggOperations = uniqueOperations.concat([
      { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "authorDocument" } },
      {
        $project: {
          title: 1,
          body: 1,
          createdDate: 1,
          authorId: "$author",
          author: { $arrayElemAt: ["$authorDocument", 0] }
        }
      }
    ])

    let posts = await postsCollection.aggregate(aggOperations).toArray()

    // clean up author property in each post object
    posts = posts.map(function (post) {
      post.isVisitorOwner = post.authorId.equals(visitorId)
      post.authorId = undefined

      post.author = {
        username: post.author.username,
        avatar: new User(post.author, true).avatar
      }

      return post
    })

    resolve(posts)
  })
}

Post.getAllPosts = function () {
  return new Promise(async function (resolve, reject) {
    let posts = await postsCollection.find().toArray(function (err, result) {
      if (err) throw err
      resolve(result)
    })
  })
}


Post.delete = function (postIdToDelete) {
  postsCollection.deleteOne({ _id: new ObjectID(postIdToDelete) })
}

Post.search = function (searchTerm) {
  return new Promise(async (resolve, reject) => {
    if (typeof searchTerm == "string") {
      let posts = await Post.reusablePostQuery([{ $match: { $text: { $search: searchTerm } } }, { $sort: { score: { $meta: "textScore" } } }])
      resolve(posts)
    } else {
      reject()
    }
  })
}





module.exports = Post
