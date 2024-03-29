const orderController = require('../controllers/orderController');
const router = require('express').Router();
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

router.post("/", verifyTokenAndAuthorization, orderController.placeOrder);

router.get("/", verifyTokenAndAuthorization, orderController.getUserOrders);

module.exports = router;