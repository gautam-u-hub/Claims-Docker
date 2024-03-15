const ErrorHandler = require("../utils/errorHandler.js");
const User = require("../models/userModel.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Claim = require("../models/claimModel.js");


// Register a User

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password,phoneNumber } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is a sample id",
            url: "profilepicurl"
        },
        phoneNumber
    });


    sendToken(user, 201, res);
});


// Login user

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
 
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }


    sendToken(user, 200, res);

})





exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
})


exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("Incorrect email address. No user is registered with the provided email.", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${"localhost:3000"}/password/reset/${resetToken}`;

    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If not requested then ignore`;

    try {

        await sendEmail({
            email: user.email,
            subject: `User's Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})


exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    await user.save();

    sendToken(user, 200, res);
})



exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});


exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect"), 400);
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
})



exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber:req.body.phoneNumber
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    res.status(200).json({
        success: true,
        user
    })
});


exports.getAllPolicyHolders = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ role: "policyHolder" });
    res.status(200).json({
        success: true,
        users
    });
})

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`Policy Holder does not exist with Id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    });
});


exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        phoneNumber: req.body.phoneNumber

    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });


    res.status(200).json({
        success: true,
        user
    });
});

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({});
    res.send({
        success: true,
        users
    })
});


exports.deleteUserById = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Claim.deleteMany({ userId: userId });

        res.status(200).json({
            message: 'User deleted successfully',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
})



