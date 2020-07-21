const apiRouter = require("express").Router()

const postController = require("./controllers/postController")

const cors = require("cors")

apiRouter.use(cors())

apiRouter.get("/", (req, res) => res.json("Hello, if you see this message that means your backend is up and running successfully. Congrats! Now let's continue learning React!"))

module.exports = apiRouter
