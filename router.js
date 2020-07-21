const apiRouter = require("express").Router()
const userController = require("./controllers/userController")
const postController = require("./controllers/postController")
const cors = require("cors")

apiRouter.use(cors())

apiRouter.get("/", (req, res) => res.json("Hello, if you see this message that means your backend is up and running successfully. Congrats! Now let's continue learning React!"))

apiRouter.get("/post", postController.getAllPosts)
apiRouter.post("/post/:id/edit", postController.apiUpdate)
apiRouter.delete("/post/:id", postController.apiDelete)
apiRouter.post("/create-post", postController.apiCreate)
apiRouter.post("/search", postController.search)

module.exports = apiRouter
