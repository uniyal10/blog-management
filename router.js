const apiRouter = require("express").Router()
const postController = require("./controllers/postController")
const cors = require("cors")

apiRouter.use(cors())

apiRouter.get("/", (req, res) => res.json("Hello, if you see this message that means your backend is up and running successfully. Congrats! Now let's continue learning React!"))


apiRouter.get("/post/:id", postController.reactApiViewSingle)
apiRouter.post("/post/:id/edit", userController.apiMustBeLoggedIn, postController.apiUpdate)
apiRouter.delete("/post/:id", userController.apiMustBeLoggedIn, postController.apiDelete)
apiRouter.post("/create-post", userController.apiMustBeLoggedIn, postController.apiCreate)
apiRouter.post("/search", postController.search)


module.exports = apiRouter
