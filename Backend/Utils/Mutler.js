const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.fieldname === "profile_image"){
            cb(null, "../Backend/Uploads/profile_images")

        }
        else if(file.fieldname === "resume"){
          cb(null,"../Backend/Uploads/resumes")
        }
    },
    filename:(req,file,cb)=>{
        cb(null,`${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`)
    }

})

const fileFilter = (req, file, cb) => {
  const fileTypes = /\.(pdf|doc|docx|jpeg|jpg|png)$/i;
  const mimeTypes = /^(application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|image\/jpeg|image\/jpg|image\/png)$/i;

    
    const extname = fileTypes.test(path.extname(file.originalname));
    const mimetype = mimeTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb('Error: Images Only');
    }
  };

const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
     limits : {fieldSize:1000000}
})

module.exports ={upload}