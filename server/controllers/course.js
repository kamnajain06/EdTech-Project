const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadFileToCloudinary} = require("../utils/fileUploader")
require("dotenv").config();

//createCourse
exports.createCourse = async (req,res)=> {
    try{
        //fetch data
        const {title, description, language, tags, learnings, price, category} = req.body;
        const thumbnail = req.files.thumbnailImage;
        console.log(thumbnail);
        //validate 
        if(!title || !description || !language || !learnings || !category || !thumbnail ||!tags ||!price){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        //instructor validation
        const instructorId = await req.user.id;
        const instructorDetails = await User.findById(instructorId);
        console.log("Instructor Details : ",instructorDetails);

        if(!instructorDetails){
            return res.status(403).json({
                success:false,
                message:"Instructor Details not found",
            })
        }
        
        //validity of Category

        const CategoryDetails = await Category.findById(category);
        console.log("Category Details : ", CategoryDetails);

        if(!CategoryDetails){
            return res.status(403).json({
                success:false,
                message:"Category Details not found",
            })
        }

        //supported type
        const supportedType = ["jpg", "png", "jpeg"];
        const fileType = thumbnail.name.split(".")[1].toLowerCase();

        if(!supportedType.includes(fileType)){
            //upload image to cloudinary and save the secure_url
            return res.json({
                success:false,
                message:"File type not supported"
            })
        }
        const cloudinaryResponse = await uploadFileToCloudinary(thumbnail,process.env.FOLDER_NAME);
        // console.log("cloudinary response: ",cloudinaryResponse );
        console.log("Data", data);

        if(!cloudinaryResponse){
            return res.json({
                success:false,
                message:"Cloudinary Upload failed"
            })
        }
        // const thumbnailUrl = cloudinaryResponse.secure_url;
        // console.log("thumbnail Url : ", thumbnailUrl)
        
        const course = {
            title: title, 
            description: description, 
            language: language, 
            learnings: learnings,
            thumbnail: thumbnailUrl,
            price: price,
            tags: tags,
            instructor:instructorId,
            Category: category,
        }

        //add course to db
        await Course.create(course);

        //add the course to the Instructor schema
        await User.findByIdAndUpdate(instructorId, {
            $push : {courses : course._id}
        }, 
        {new: true});

        //add course entry in Category schema
        await Category.findByIdAndUpdate(category,{
            $push : {
                courses: course._id,
            }
        }, {new:true});

        //return res
        return res.status(200).json({
            success:true,
            message: "Course created successfully",
            data: course,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Error while creating the course"
        })
    }
}
//getAllCourses
exports.getAllCourses = async (req,res )=> {
    try{
        const allCourses = await Course.find({}, {
            title : true, 
            description: true, 
            language: true, 
            learnings: true, 
            price: true, 
            Category: true,
            thumbnail:true,
            instructor: true,
            ratingAndReview: true,
            studentsEnrolled: true,
        }).populate("instructor,Category").exec();
        if(!allCourses){
            return res.status(403).json({
                success:false,
                message:"No courses yet"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Courses found successfully",
            data: allCourses,
        })
    }catch(err){
        return res.status(500).json({

        })
    }
}
//getCourseDetails
exports.getCourseDetails = async (req,res) => {
    try{
        //fetch courseId
        const {courseId} = req.body;
        const courseDetails = await Course.find({_id:courseId})
                                    .populate(
                                        {
                                            path:"instructor",
                                            populate:"additionalDetails",
                                        }
                                    )
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path:"courseContent",
                                        populate:"subSection"
                                    })
                                    .exec();
        if(!courseDetails){
            return res.status(403).json({
                success:false,
                message:`Couldn't find the course details for the ${courseId}`,
            })
        }                                    
        //return response
        return res.status(200).json({
            success:true,
            courseDetails,
        })
    }catch(err){
        return res.status(403).json({
            success:false,
            message:err,
        })
    }
}