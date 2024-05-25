const Profile = require("../models/Profile");
const User = require("../models/User");
const { findByIdAndDelete } = require("../models/User");
const {uploadFileToCloudinary}= require("../utils/fileUploader");
const mongoose = require("mongoose");

exports.updateProfile = async (req,res) => {
    try{
        //fetch data and userID
        const {dateOfBirth, about, gender, phoneNumber } = req.body;
        console.log(1);
        const userId = req.user.id;
        console.log(2);
        //validate data
        if(!userId){
            return res.status(403).json({
                success:false,
                message:"User Id not found"
            })
        }
        console.log(3);
        if(!dateOfBirth && !about && !gender && !phoneNumber){
            return res.status(403).json({
                success:false,
                message:"Fill the required fields"
            })
        }
        //findByIdAndUpdate
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;

        //update profile 
        //1

        const updateProfileDetails = await Profile.findByIdAndUpdate(profileId, {$set : {
            dateOfBirth : dateOfBirth , 
            about : about, 
            gender : gender ,
            phoneNumber : phoneNumber,
        }}, {new: true});

        //2

        // const profileDetails = await Profile.findById(profileId);
        // profileDetails.dateOfBirth = dateOfBirth, 
        // profileDetails.about = about, 
        // profileDetails.gender = gender, 
        // profileDetails.phoneNumber = phoneNumber,
        // await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:"Profile Details updated successfully",
        })


    }catch(err){
        console.log("Error : ", err);
        return res.status(500).json({
            success:false,
            message:"Profile Details can't be updated",
        })
    }   
}

exports.deleteAccount = async(req, res) => {
    try{
        //fetch id
        const userId = eq.user.id;
        //validate id
        const userDetails = await User.findById(userId);

        const enrolledCourses = userDetails.courses;

        if(!userDetails){
            return res.status(500).json({
                success:false,
                message:"USer not found",
            })
        }
        //delete profile of that user
        const profileId = userDetails.additionalDetails;
        await Profile.findByIdAndDelete(profileId);
        //delete user
        const deleteUser = await User.findByIdAndDelete(userId);

        //update studentEnrolled in course
        enrolledCourses.forEach(course => {
            course.studentsEnrolled.forEach(student => {
                if(student === userId){
                    splice(indexOf(student));
                }
            })
        });
        //return res
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully",
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Account cannot be deleted",
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture;
      console.log(displayPicture);
      const userId = req.user.id
      const image = await uploadFileToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      return res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
        console.log("error: ", error)
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}

exports.getUserDetails = async (req,res) => {
    try{
        const userId = req.user.id;
        console.log(userId);
        if(!userId){
            return res.status(400).json({
                success:true,
                message:"User Id not found"
            })
        }
        const userDetails = await User.findById(userId)
                            .populate("additionalDetails")
                            .exec();
        console.log("User Details: ", userDetails);
        return res.json({
            success:true,
            message:"User Details Found",
            userDetails,
        })
    }catch(err){
        console.log(err);
        return res.status(404).json({
            success:false,
            message:err.message,
        })
    }   
}
