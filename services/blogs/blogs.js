import { Router } from "express"
import Blog from "./model.js"
import Comment from "../comments/model.js"
import q2m from "query-to-mongo"
import cloudinaryUploader from "../../multerConfig/multer.js"
import { JWTAuthMiddleware } from "../../lib/auth/Oauth.js"

const blogRoute = Router()

blogRoute.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const { criteria } = q2m(req.query)
    console.log(criteria)
    const blogs = await Blog.find(criteria).populate({
      path: "comments",
      populate: {
        path: "author",
        model: "Author",
        select: ["name", "lastName", "avatar"],
      },
    })
    res.send(blogs)
  } catch (error) {
    next(error)
  }
})

blogRoute.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    res.send(blog)
  } catch (error) {
    next(error)
  }
})

blogRoute.get("/:id/comments", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const comments = await Comment.find({ blog: req.params.id }).populate({
      path: "author",
      model: "Author",
      select: ["name", "lastName", "avatar"],
    })
    res.send(comments)
  } catch (error) {
    next(error)
  }
})

blogRoute.get("/:id/comments/:commentId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const comments = await Comment.find({
      blog: req.params.id,
      _id: req.params.commentId,
    }).populate({
      path: "author",
      model: "Author",
      select: ["name", "lastName", "avatar"],
    })
    res.send(comments)
  } catch (error) {
    next(error)
  }
})

blogRoute.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.send(blog)
  } catch (error) {
    next(error)
  }
})

blogRoute.put("/:id/comments/:commentId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndUpdate(
        { blog: req.params.id, _id: req.params.commentId },
        req.body,
        { new: true }
    ).populate({
      path: "author",
      model: "Author",
      select: ["name", "lastName", "avatar"],
    })
    res.send(comment)
  } catch (error) {
    next(error)
  }
})

blogRoute.patch("/:id/cover", JWTAuthMiddleware, cloudinaryUploader, async (req, res, next) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, { cover: req.file.path }, { new: true })
    res.send(updated)
  } catch (error) {
    next(error)
  }
})

blogRoute.delete("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

blogRoute.delete("/:id/comments/:commentId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await Comment.findOneAndDelete({ blog: req.params.id, _id: req.params.commentId })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

blogRoute.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const blog = new Blog(req.body)
    const savedBlog = await blog.save()
    res.send(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogRoute.post("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newComment = new Comment({ ...req.body, blog: req.params.id })
    const savedComment = await newComment.save()
    const post = await Blog.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: savedComment } },
        { new: true }
    ).populate({
      path: "comments",
      populate: {
        path: "author",
        model: "Author",
        select: ["name", "lastName", "avatar"],
      },
    })
    res.send(post)
  } catch (error) {
    next(error)
  }
})

export default blogRoute