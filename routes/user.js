const userController = require('../controllers/userController');
const router = require('express').Router();
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

router.get("/", verifyTokenAndAuthorization, userController.getUser);
router.delete("/", verifyTokenAndAuthorization, userController.deleteUser);
router.get("/verify/:otp", verifyTokenAndAuthorization, userController.verifyAccount);
router.get("/verify_phone/:phone", verifyTokenAndAuthorization, userController.verifyPhone);

module.exports = router;
