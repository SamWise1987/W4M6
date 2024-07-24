import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"
const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,

    },
    birthday: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { collection: "author" }
)
authorSchema.pre("save", async function () {
  const newUserData = this

  if (newUserData.isModified("password")) {
    const plainPW = newUserData.password

    const hash = await bcrypt.hash(plainPW, 11)
    newUserData.password = hash
  }
})

authorSchema.methods.toJSON = function () {
  const currentUserDocument = this
  const currentUser = currentUserDocument.toObject()
  delete currentUser.password
  delete currentUser.createdAt
  delete currentUser.updatedAt
  delete currentUser.__v
  return currentUser
}

authorSchema.static("checkCredentials", async function (email, plainPW) {
  const user = await this.findOne({ email })

  if (user) {
    const passwordMatch = await bcrypt.compare(plainPW, user.password)

    if (passwordMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
})

export default model("Author", authorSchema)
