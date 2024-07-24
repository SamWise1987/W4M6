import { Schema, model } from "mongoose"

const commentsSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
    }
  },
  { collection: "comments" }
)

export default model("Comments", commentsSchema)
