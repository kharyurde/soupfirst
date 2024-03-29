const categoryController = require('../controllers/categoryController');
const router = require('express').Router();

router.post("/", categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

router.get("/random", categoryController.getRandomCategories);

module.exports = router;