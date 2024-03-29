const foodController = require('../controllers/foodController');
const router = require('express').Router();
const { verifyVendor } = require('../middlewares/verifyToken')

router.post("/", foodController.addFood);

router.get("/recommendation/:code", foodController.getRandomFood);

router.get("/byCode/:code", foodController.getAllFoodsByCode);

router.get("/:id", foodController.getFoodById);

router.get("/restaurant-foods/:id", foodController.getFoodsByRestaurants);

router.get("/search/:search", foodController.searchFoods);

router.get("/:category/:code", foodController.getFoodsByCategoriesAndCode);


module.exports = router;