const ratingController = require('../controllers/ratingController');
const router = require('express').Router();
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

router.post("/", verifyTokenAndAuthorization, ratingController.addRating);

router.get("/", verifyTokenAndAuthorization, ratingController.checkUserRating);

module.exports = router;