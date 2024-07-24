import { Router } from "express"
import { JWTAuthMiddleware } from "../../lib/auth/Oauth.js"
import Author from "../authors/model.js"
import passport from "passport"
import { createAccessToken } from "../../lib/JWT.js"
import createError from "http-errors"

const authRouter = Router()

authRouter.get(
    "/googleLogin",
    passport.authenticate("google", { scope: ["profile", "email"] })
)

authRouter.get(
    "/callback",
    passport.authenticate("google", { session: false }),
    (req, res, next) => {
      try {
        const redirectUrl = process.env.REDIRECT_URL || "http://localhost:3000"
        res.redirect(`${redirectUrl}?accessToken=${req.user.accessToken}`)
      } catch (error) {
        next(error)
      }
    }
)

authRouter.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Author.checkCredentials(email, password)

    if (user) {
      const payload = { _id: user._id, role: user.role }
      const accessToken = await createAccessToken(payload)
      res.send({ accessToken })
    } else {
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

authRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await Author.findById(req.user._id)
    res.send(user)
  } catch (error) {
    next(error)
  }
})

export default authRouter