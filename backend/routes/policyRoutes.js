const express = require("express");

const {
    createPolicy, getAllPolicies, getPolicyById, updatePolicyById, deletePolicyById
    , getAllUserPolicies,
    buyPolicy, updateLastPremiumPaymentDate } = require("../Controllers/policyController");
const { isAuthenticatedUser, authorizeRoles, checkUserPolicyOwnership, apiKeyCheck } = require("../middleware/auth");

const router = express.Router();


router.route("/policy").post(isAuthenticatedUser, authorizeRoles("admin"), createPolicy);
router.route("/policies").get(getAllPolicies);
router.route("/user/policies").get(isAuthenticatedUser, getAllUserPolicies);

router.route("/policy/:id").get(isAuthenticatedUser, getPolicyById);
router.route("/policy/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updatePolicyById);
router.route("/policy/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deletePolicyById);
router.route("/buy-policy/:id").put(isAuthenticatedUser, buyPolicy);
router.route("/policy/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deletePolicyById);
router.route("/user/policy/:id").put(isAuthenticatedUser,checkUserPolicyOwnership, updateLastPremiumPaymentDate)

module.exports = router;