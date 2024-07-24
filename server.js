import express from "express"
import endpoints from "express-list-endpoints"
import mongoose from "mongoose"
import { authorRoute } from "./services/authors/authors.js"
import { blogRoute } from "./services/blogs/blogs.js"
import {
  badRequestHandler,
  genericErrorHandler,
  notfoundHandler,
  unauthorizedHandler,
} from "./errorHandlers.js"
import { loginRoute } from "./services/login/index.js"
import passport from "passport"
import googleStrategy from "./lib/oauth/googleOauth.js"

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

passport.use("google", googleStrategy)

app.use("/authors", authorRoute)
app.use("/blogs", blogRoute)
app.use("/login", loginRoute)

app.use(badRequestHandler)
app.use(unauthorizedHandler)
app.use(notfoundHandler)
app.use(genericErrorHandler)

const initServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.table(endpoints(app))
    })
  } catch (error) {
    console.log("Connection failed: ", error)
  }
}

initServer()