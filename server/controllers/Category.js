const Category = require("../models/Category");

exports.createCategory = async (req,res)=> {
    try{
        //fetch data
        const {name , desc} = req.body;
        //validation
        if(!name){
            return res.json({
                success:false,
                message:"Please fill the required field",
            })
        }
        //entry in db
        const CategoryCreated = await Category.create({
            name:name,
            description:desc,
        })
        console.log("Category Created: ", CategoryCreated);
        return res.status(200).json({
            success:true,
            message:"Category Created Successfully",
        })
    }catch(err){
        console.log("Error : ");
        return res.json({
            success:false,
            message:"Unable to create Category"
        })
    }
}

exports.getAllCategory = async (req,res ) => {
    try{
        const allCategory = await Category.find({}, {name:true});
        if(allCategory.length === 0){
            return res.json({
                success:false,
                message:"No Category found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Category found",
            allCategory,
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to fetch all the Category"
        })
    }
}

//get Category Page Details
exports.categoryPageDetails = async (req,res) => {
    try{
        //get category id
        const {categoryId} = req.body;

        const selectedCategory = await Category.findById(categoryId)
                                    .populate("courses")
                                    .exec();
        //get all the courses for that category
        if(!selectedCategory){
            return res.json({
                success:false,
                message:`No courses found for category : ${selectedCategory}`
            })
        }

        const diffCategories = await Category.find(
            {_id: {$ne: categoryId}}
        )
        .populate("courses")
        .exec();

        //get courses for different categories

        //get top-10 selling courses

        //return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                diffCategories,
            }
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}