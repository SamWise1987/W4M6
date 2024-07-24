import { Router } from "express"
import Author from "./model.js"
import Blog from "../blogs/model.js"
import cloudinaryUploader from "../../multerConfig/multer.js"
import { JWTAuthMiddleware } from "../../lib/auth/Oauth.js"

const authorRoute = Router()

authorRoute.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const authors = await Author.find()
    res.send(authors)
  } catch (error) {
    next(error)
  }
})

authorRoute.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id)
    res.send(author)
  } catch (error) {
    next(error)
  }
})

authorRoute.get("/:id/blogs", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const blogs = await Blog.find({ author: req.params.id }).populate("author", "name lastName avatar")
    res.send(blogs)
  } catch (error) {
    next(error)
  }
})

authorRoute.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author(req.body)
    const savedAuthor = await newAuthor.save()
    res.send(savedAuthor)
  } catch (error) {
    next(error)
  }
})

authorRoute.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

authorRoute.patch("/:id/avatar", cloudinaryUploader, async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, { avatar: req.file.path }, { new: true })
    res.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

authorRoute.delete("/:id", async (req, res, next) => {
  try {
    await Author.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

export default authorRoute