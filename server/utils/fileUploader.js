const cloudinary = require("cloudinary").v2;

let data = {};

exports.uploadFileToCloudinary = async (file,folder) => {
    const options = {folder};
    options.resource_type = "auto";
    // if(quality){
        //     options.quality = quality;
        // };
        // if(height){
            //     options.height = height;
            // }
            return await cloudinary.uploader.upload(file.tempFilePath, options).then(result => {
                data = result;
            })
            .catch(err => {console.log("error : ", err)});
        }
        
