const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();

exports.createSubSection = async(req,res) => {
    try{
        //fetch data
        const {title, timeDuration, description, sectionId} = req.body;

        //extract video
        const videoFile = req.files.videoFile;

        //validation
        if(!title || !timeDuration || !description || !videoFile){
            return res.status(403).json({
                success:false,
                message:"Fill teh required fields"
            })
        }
        //upload video to cloudinary and get a secure_url
        const supportedType = ["mov","mp4"];
        const fileType = videoFile.name.split(".")[1].toLowerCase();
        if(!supportedType.includes(fileType)){
            return res.status(500).json({
                success:false,
                message:"Video File can't be uploaded"
            })
        }
        const fileUpload = await uploadFileToCloudinary(videoFile,process.env.VIDEO_FOLDER);
        //create subsection
        const newSubSection = {
            title: title,
            description: description,
            timeDuration: timeDuration,
            videoUrl : fileUpload.secure_url
        }
        await SubSection.create(newSubSection)

        //add subsection id to Section Schema
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{$push : {
            subSection: newSubSection._id,
        }}, {new:true}).populate("subSection").exec();
        console.log("Updated SubSecton: ", updatedSection);

        //return user
        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
            data: updatedSection,
        })

    }catch(err){
        console.log("Error : ", err);
        return res.status(500).json({
            success:false,
            message:"SubSection can't be created",
        })
    }
}
exports.updateSubSection = async(req,res) => {
    try{
        //fetch data
        const {title, timeDuration, description, subSectionId} = req.body;

        // Validate SubSection Id
        // const validateId = await SubSection.findById(subSectionId);
        if(!title || !timeDuration || !description || !subSectionId){
            return res.status(403).json({
                success:false,
                message:"Please fill the required details"
            })
        };
        const updateSubSection = await SubSection.findByIdAndUpdate(subSectionId, {$set : {
            title:title,
            timeDuration:timeDuration,
            description:description,
        }}, {new:true});

        console.log("Updated Subsection : ", updateSubSection);
        return res.status(200).json({
            success:true,
            message:"SubSection updated Successfully"
        })
    }catch(err){
        console.log("Error : ", err);
        return res.status(500).json({
            success:false,
            message:"SubSection can't be updated"
        }) 
    }
}
exports.deleteSubSection = async(req,res) => {
    try{
        const {sectionId,subSectionId} = req.body;
        const deleteSubSection = await SubSection.findByIdAndDelete(subSectionId);
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{$pull : {
            subSection:deleteSubSection._id,
        }}, {new:true}).populate("subSection").exec();

        console.log("Updated Section: ", updatedSection);

        return res.status(200).json({
            success:true,
            message:"SubSection deleted Successfully"
        })
    }catch(err){
        console.log("Error : ", err);
        return res.status(500).json({
            success:false,
            message:"SubSection can't be deleted"
        }) 
    }
}