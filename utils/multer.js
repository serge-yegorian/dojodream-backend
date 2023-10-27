import multer from "multer";
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext!== ".png" && ext!== ".gif") {
            cb(new Error("Make sure your image is JPG/PNG!"), false);
            return
        }
        cb(null, true)
    }
})

export default upload;