import createHttpError from "http-errors"
import atob from "atob"
import UsersModel from "../../authors/model.js"

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "Admin") {
    next()
  } else {
    next(createHttpError(403, "Admins only endpoint!"))
  }
}

export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(401, "Please provide credentials in Authorization header")
    )
  } else {
    const encodedCredentials = req.headers.authorization.replace("Basic ", "") 
    const credentials = atob(encodedCredentials) 
    const [email, password] = credentials.split(":")
    const user = await UsersModel.checkCredentials(email, password)

    if (user) {
      req.user = user
      next()
    } else {
      next(createHttpError(401, "Credentials are not ok!"))
    }
  }
}
