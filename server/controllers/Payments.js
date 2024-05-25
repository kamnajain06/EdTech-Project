const {instance} = require("../config/razorpay");
const course = require("../models/Course");
const user = require("../models/User");
const {mailSender} = require("../utils/mailSender");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");

//capture payment 

exports.capturePayment = async (req, res) => {
    //fetch courseId and UserId
    const {course_id} = req.body;
    const userId = req.user.id;
    //validate courseId
    if(!course_id){
        return res.json({
            success:false,
            message:"Please add valid CourseId",
        })
    }
    //validate CourseDetails
    const courseDetails = await course.find({course_id});
    if(!courseDetails){
        return res.json({
            success:false,
            message:"Course Details not found",
        })
    }
    //validate userEnrolled
    const uId = await Mongoose.Types.ObjectID(userId);
    if(!courseDetails.studentEnrolled.uId){
        return res.json({
            success:false,
            message:"User not enrolled",
        })
    }
    //create a RazorPay order
    const options = {
        amount: amount*100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    }
    try{
        const paymentResponse = await instance.create(options);
        //return response
        console.log(paymentResponse);
        return res.status(200).json({
            success:true,
            courseName: courseDetails.courseName,
            courseDescription: courseDetails.courseDescription,
            thumbnail: courseDetails.thumbnail,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
            orderId : paymentResponse.orderId,
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Could not intiate order"
        })
    }
}

exports.verifySignature = async (req,res)=> {
    const webhookSecret = "123456";
    const signature = req.headers["x-razorpay-ignatue"];
    const shasum = crypto.createHMAC("sha256", webhookSecret);
    shasum.update(JSON.stringify());
    const digest = shasum.digest("hex");

    if(digest === signature){
        const {courseId,userId} = req.body.payload.payment.entity.notes;

        //find user and update course in it

        const enrolledStudent = await user.findOneAndUpdate(
            {_id : userId},
            {
                $push: {courses: courseId}
            },
            {new:true})

        if(!enrolledStudent){
            return res.json({
                success:false,
                message:"User not found",
            })
        }
        
        //find course and update user in it

        const enrolledCourse = await course.findOneAndUpdate(
            {_id: courseId},
            {$push : {studentEnrolled: userId}},
            {new: true},
        )

        if(!enrolledCourse){
            return res.json({
                success:false,
                message:"Course not found",
            })
        }

        const mailResponse = await mailSender(enrolledStudent.email, "Congratulations from Codehelp", `You have successfully enrolled in ${enrolledCourse.courseName}!`)
        console.log(mailResponse);

        return res.status(200).json({
            success:true,
            message:"Enrolled in course successfully",
        })
        
    }else{
        return res.status(500).json({
            success:false,
            message:"Could not enrolled in course"
        })
    }

}