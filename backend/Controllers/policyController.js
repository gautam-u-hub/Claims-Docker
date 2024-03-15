const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const crypto = require("crypto");
const Policy = require("../models/policyModel.js");
const User = require("../models/userModel.js");
const Claim = require("../models/claimModel.js");



exports.createPolicy = catchAsyncErrors(async (req, res, next) => {
    const policy = await Policy.create(req.body);

    if (req.body.policyTerm > 100) {
        return next(new ErrorHandler("Policy Term cannot be greater than 100 years", 401));
    }

    if (req.body.sumAssured > 100000000000) {
        return next(new ErrorHandler("Policy SumAssured cannot be greater than 100000000000 rupees", 401));

    }

    if (req.body.premiumAmount > 100000000000) {
        return next(new ErrorHandler("Policy Premium amount cannot be greater than 100000000000 rupees", 401));

    }
    const premiumAmount = parseInt(req.body.premiumAmount);
    const sumAssured = parseInt(req.body.sumAssured);

    if (premiumAmount > sumAssured) {
        return next(new ErrorHandler("Policy Premium amount cannot be greater than sumAssured", 401));
    }

    res.status(200).json({
        success: true,
        policy
    });
});


exports.getAllUserPolicies = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const policyIds = user.policies.map(policyObj => policyObj._id);
    const policies = await Policy.find({ _id: { $in: policyIds } });


    res.status(200).json({
        success: true,
        policies
    });
});

exports.getAllPolicies = catchAsyncErrors(async (req, res, next) => {

    const policies = await Policy.find({});


    res.status(200).json({
        success: true,
        policies
    });
});


exports.getPolicyById = catchAsyncErrors(async (req, res, next) => {
    const policy = await Policy.findById(req.params.id);

    if (!policy) {
        return next(new ErrorHandler('Policy not found', 404));
    }

    res.status(200).json({
        success: true,
        policy
    });
});


exports.updatePolicyById = catchAsyncErrors(async (req, res, next) => {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!policy) {
        return next(new ErrorHandler('Policy not found', 404));
    }
    const premiumAmount = req.body.premiumAmount;
    if (isNaN(premiumAmount) || premiumAmount <= 0) {
        return next(new ErrorHandler("Premium amount must be a positive number.", 404))
    }
    const sumAssured = req.body.sumAssured;
    if (isNaN(sumAssured) || sumAssured < 0) {
        return next(new ErrorHandler("Sum Assured must be a positive number.", 404))

    }

    res.status(200).json({
        success: true,
        policy
    });
});




exports.buyPolicy = catchAsyncErrors(async (req, res, next) => {
    const policyId = req.params.id;
    const userId = req.user._id;

    let user = await User.findById(userId);

    const policy = await Policy.findById(policyId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    if (!policy) {
        return next(new ErrorHandler('Policy not found', 404));
    }

    if (user.policies.some(policy => policy._id.toString() === policyId)) {
        return next(new ErrorHandler('User already has this policy', 400));
    }

    const { sumAssured } = policy;
    const startDate = Date.now();
    const endDate = startDate + policy.policyTerm * (365 * 24 * 60 * 60 * 1000);
    const lastPremiumPayment = Date.now();

    if (!user.policies) {
        user.policies = [];
    }

    user.policies.push({ _id: policy._id, leftAmount: sumAssured, startDate, endDate, lastPremiumPayment });

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: 'Policy assigned to user successfully',
        user
    });

});


exports.deletePolicyById = catchAsyncErrors(async (req, res, next) => {
    const policyId = req.params.id;
    const deletedPolicy = await Policy.findByIdAndDelete(policyId);

    if (!deletedPolicy) {
        throw new Error('Policy not found');
    }

    await Claim.deleteMany({ policyId: policyId });

    const users = await User.find({ 'policies.policy': policyId });

    for (let i = 0; i < users.length; i++) {
        const currentUser = users[i];
        const updatedPolicies = [];

        for (let j = 0; j < currentUser.policies.length; j++) {
            const policy = currentUser.policies[j];
            if (policy.policy.toString() !== policyId.toString()) {
                updatedPolicies.push(policy);
            }
        }

        currentUser.policies = updatedPolicies;
        await currentUser.save();
    }

    res.status(200).json({
        success: true,
        message: "Deleted the policy"
    });


});


exports.updateLastPremiumPaymentDate = catchAsyncErrors(async (req, res, next) => {

    const userId = req.user.id;
    const policyId = req.params.id;
    const lastPremiumPayment = req.body.lastPremiumPayment;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const policyIndex = user.policies.findIndex(policy => policy._id.toString() === policyId.toString());

    if (policyIndex === -1) {
        return next(new ErrorHandler('Policy not found for this user', 404));
    }
    user.policies[policyIndex].lastPremiumPayment = lastPremiumPayment;
    if (new Date(lastPremiumPayment) > Date.now()) {
        return next(new ErrorHandler('last premium payment date is greater than the current date', 404));

    }
    const userr = await User.findByIdAndUpdate(userId, user, {
        new: true,
        runValidators: true
    });


    res.status(200).json({ success: true, message: 'Last premium payment updated successfully' });


})