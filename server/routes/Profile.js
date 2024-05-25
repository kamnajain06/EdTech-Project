const express = require("express")
const router = express.Router()

const { auth, isInstructor } = require("../middleware/auth")

const {
    deleteAccount,
    updateProfile,
    updateDisplayPicture,
    getUserDetails
} = require("../controllers/Profile")

router.delete("/deleteProfile", auth, deleteAccount)
router.get("/getUserDetails", auth, getUserDetails)
router.put("/updateProfile", auth, updateProfile)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router;