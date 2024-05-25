const mongoose = require("mongoose");

const course = mongoose.Schema({
    language : {
        type: String,
        required: true,
    },
    thumbnail : {
        type: String,
        required: true,
    },
    title : {
        type: String,
        required: true,
    },
    instructor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    tags: {
        type:[String],
        required:true,
    },
    learnings: {
        type:String,
    },
    courseContent : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],
    ratingAndReviews : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],
    price : {
        type: String,
        required: true
    },
    studentEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    instructions:{
        type:[String],
    },
    status:{
        type:"String",
        enum:["Draft","Published"],
    }
})

module.exports= mongoose.model ("Course", course);