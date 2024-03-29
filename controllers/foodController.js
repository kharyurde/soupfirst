const Food = require("../models/Food");

module.exports = {
    addFood: async (req, res) => {
        const { title, time, foodTags, category, code,
            restaurant, description, price, additive, imageUrl } = req.body;
        if (!title || !time || !foodTags || !category || !code
            || !restaurant || !description || !additive || !price || !imageUrl) {
            return res.status(400).json({ status: false, message: "You have a missing field!" });
        }
        try {
            const newFood = new Food(req.body);
            await newFood.save();
            res.status(201).json({ status: true, message: 'Food created successfully!' });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getFoodById: async (req, res) => {
        const id = req.params.id;
        try {
            const food = await Food.findById(id);
            res.status(200).json(food);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getRandomFood: async (req, res) => {

        try {
            let randomFoodlist = [];
            if (req.params.code) {
                randomFoodlist = await Food.aggregate([
                    { $match: { code: req.params.code } },
                    { $sample: { size: 3 } },
                    { $project: { __v: 0 } }
                ]);
            }

            if (!randomFoodlist.length) {
                randomFoodlist = await Food.aggregate([

                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }
            if (randomFoodlist.length) {
                res.status(200).json(randomFoodlist);
            } else {
                res.status(404).json({ status: false, message: "No food found" });
            }

        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAllFoodsByCode: async (req, res) => {
        const code = req.params.code;

        try {
            const foods = await Food.find({ code: code });

            return res.status(200).json(foods);
        }
        catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    getFoodsByCategoriesAndCode: async (req, res) => {
        const { category, code } = req.params;
        try {

            const foods = await Food.aggregate([
                { $match: {category: category, code: code, isAvailable: true } },
                { $project: { __v: 0 } }
            ]);

            if (foods.length === 0) {
                return res.status(200).json([]);
            }
            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },

    getFoodsByRestaurants: async (req, res) => {
        const id = req.params.id;

        try {
            const foods = await Food.find({ restaurant: id });

            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    searchFoods: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await Food.aggregate([
                {
                    $search: {
                        index: "foods",
                        text: {
                            query: search,
                            path: {
                                wildcard: "*"
                            },

                        }
                    }
                }
            ])
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },

    getRandomFoodsByCategoryAndCode: async (req, res) => {
        const { category, code } = req.params;
        try {
            let foods;

            foods = await Food.aggregate([
                { $match: { category: category, code: code, isAvailable: true } },
                { $sample: { size: 10 } },
            ])

            if (!foods || foods.length === 0) {
                foods = await Food.aggregate([
                    { $match: { code: code, isAvailable: true } },
                    { $sample: { size: 10 } },
                ])

            } else if (!foods || foods.length === 0) {
                foods = await Food.aggregate([
                    { $match: { isAvailable: true } },
                    { $sample: { size: 10 } },
                ])
            }
            return res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    }
}
