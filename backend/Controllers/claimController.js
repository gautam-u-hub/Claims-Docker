const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const crypto = require("crypto");
const Policy = require("../models/policyModel.js");
const User = require("../models/userModel.js");
const Claim = require("../models/claimModel.js");

exports.createClaim = catchAsyncErrors(async (req, res, next) => {
    const { claimDate, claimAmount, description } = req.body;
    const policyId = req.params.id;
    const userId = req.user._id;

    if (!policyId || !userId || !claimDate || !claimAmount || !description) {
        return next(new ErrorHandler('Please provide all required fields', 400));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    let foundPolicy = user.policies.find(policy => policy._id.toString() === policyId.toString());
    let policyFromDB = await Policy.findById(policyId);

    if (!foundPolicy) {
        return next(new ErrorHandler('Policy not found', 404));
    }

    if (claimAmount < 0) {
        return next(new ErrorHandler("Claim can't be created because claimAmount cannot be negative", 400));
    }

    const currentDate = new Date();
    const lastPremiumDate = new Date(foundPolicy.lastPremiumPayment);

    const nextExpectedPaymentDate = new Date(lastPremiumDate);
    switch (policyFromDB.paymentFrequency) {
        case "Monthly":
            nextExpectedPaymentDate.setMonth(nextExpectedPaymentDate.getMonth() + 1);
            break;
        case "Quarterly":
            nextExpectedPaymentDate.setMonth(nextExpectedPaymentDate.getMonth() + 3);
            break;
        case "Yearly":
            nextExpectedPaymentDate.setFullYear(nextExpectedPaymentDate.getFullYear() + 1);
            break;
        default:
            return next(new ErrorHandler("Invalid payment frequency", 400));
    }

    if (nextExpectedPaymentDate < currentDate) {
        return next(new ErrorHandler("Premium is overdue. Cannot apply for the claim ", 400));
    }

    if (foundPolicy.leftAmount < claimAmount) {
        return next(new ErrorHandler("Claim can't be created because the claim amount is higher than the sum assured left", 400));
    }

    const claim = await Claim.create({
        userId,
        policyId,
        claimantName: req.user.name,
        claimDate,
        claimAmount,
        description,
    });

    res.status(200).json({
        success: true,
        claim
    });
});


exports.getLoggedInUserClaims = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const claims = await Claim.find({userId:userId});

    res.status(200).json({
        success: true,
        claims
    });
});

exports.getUserClaim = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const claims = await Claim.find({ userId: userId });

    res.status(200).json({
        success: true,
        claims
    });
});

exports.getUserClaimById = catchAsyncErrors( async (req,res,next)=> {
    const claimId = req.params.id;
    const claim = await Claim.findById(claimId);

    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    res.status(200).json({
        success: true,
        claim
    });


})


exports.getAllClaims = catchAsyncErrors(async (req, res, next) => {
    const claims = await Claim.find({});
    res.status(200).json({
        success: true,
        claims
    });
});
exports.getClaimById = catchAsyncErrors(async (req, res, next) => {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    const policyId = claim.policyId;

    if (!policyId) {
        return next(new ErrorHandler('Policy ID not found in the claim', 400));
    }

    const user = await User.findById(claim.userId);

    let userPolicy;
    for (let i = 0; i < user.policies.length; i++) {
        if (user.policies[i]._id.toString() == policyId.toString()) {
            console.log(user.policies[i]);
            userPolicy = user.policies[i];
            break;
        }
    }

    if (!userPolicy) {
        return next(new ErrorHandler('Policy not found for this user', 404));
    }

    const policy = await Policy.findById(policyId);

    const lastPaymentDate = userPolicy.lastPremiumPayment;

    res.status(200).json({
        success: true,
        claim,
        lastPaymentDate,
        paymentFrequency: policy.paymentFrequency
    });
});

exports.updateClaimById = catchAsyncErrors(async (req, res, next) => {
    const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true 
    });

    if (claim.status === "Approved"||claim.status==="Reimbursed") {
        return next(new ErrorHandler("Claim cannot be updated as it has already been approved",400))
    }

    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    res.status(200).json({
        success: true,
        claim
    });
});

exports.deleteClaimById = catchAsyncErrors(async (req, res, next) => {
    const claim = await Claim.findByIdAndDelete(req.params.id);

    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Claim deleted successfully'
    });
});

exports.updateClaimStatusById = catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;

   
    const claim = await Claim.findByIdAndUpdate(req.params.id, { status }, {
        new: true, 
        runValidators: true 
    });
    if (status === "Approved") {
        const user = await User.findById(claim.userId);
        const policyId = claim.policyId;
        const policyIndex = user.policies.findIndex(policy => policy._id.toString() === policyId.toString());

        user.policies[policyIndex].leftAmount -=  claim.claimAmount;
        const userr = await User.findByIdAndUpdate(claim.userId, user, {
            new: true,
            runValidators: true
        });
    }


    if (!claim) {
        return next(new ErrorHandler('Claim not found', 404));
    }

    res.status(200).json({
        success: true,
        claim
    });
});










