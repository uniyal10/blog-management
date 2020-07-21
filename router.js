const apiRouter = require("express").Router()

const postController = require("./controllers/postController")

const cors = require("cors")

apiRouter.use(cors())

apiRouter.get("/", (req, res) => res.json("Hello, if you see this message that means your backend is up and running successfully. Congrats! Now let's continue learning React!"))

router.post("/add", contactController.add)
router.get("/", (req, res) => {
  userController.find().toArray((err, list) => {
    if (err) {
      console.log("something wrong")
    } else {
      res.send(list)
    }
  })
})

router.post("/edit", (req, res) => {
  userController.findOneAndUpdate({ _id: new mongodb.ObjectID(req.body.id) }, { $set: { name: req.body.name, date: req.body.date, number: req.body.number, email: req.body.email } }, (err, data) => {
    if (err) {
      console.log("something wrong")
    } else {
      console.log("update sucessfully")
      res.redirect("/")
    }
  })
})
router.post("/delete", (req, res) => {
  userController.deleteOne({ _id: new mongodb.ObjectID(req.body.id) }, (err, data) => {
    res.send("sucessfull")
  })
})
module.exports = apiRouter
