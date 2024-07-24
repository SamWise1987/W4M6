import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

// Configurazione
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "soluzioni",
  },
})

const upload = multer({ storage }).single("avatar")

export default upload