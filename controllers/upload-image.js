/** load library 'multer' and 'path' */
const multer = require("multer")
const path = require("path")

/** storage configuration */
const storage = multer.diskStorage({
    /** define storage folder */
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../image"))
    },

    /** define filename for upload file */
    filename: (req, file, cb) => {
        cb(null, `cover-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {
        const acceptedType = [
            "image/jpg",
            "image/jpeg",
            "image/png"
        ]

        if (!acceptedType.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type (${file.mimetype})`))
        }

        cb(null, true)
    },

    limits: {
        fileSize: 1024 * 1024 // 1 MB
    }
})

module.exports = upload