const Rating = require("../models/Rating");
const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");

module.exports = {
    addRating: async (req, res) => {
        const newRating = ({
            userId: req.body.id,
            ratingType: req.body.ratingType,
            product: req.body.product,
            rating: req.body.rating
        });

        try {
            await newRating.save();

            if (req.body.ratingType === "Restaurant") {
                const restaurants = await Restaurant.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    { $group: { _id: '$product' }, averageRating: { $avg: "$rating" } }
                ]);

                if (restaurants.length > 0) {
                    const averageRating = restaurants[0].averageRating;
                    await Restaurant.findByIdAndUpdate(req.body.product, { rating: averageRating }, { new: true });
                }
            } else if (req.body.ratingType === "Food") {
                const foods = await Rating.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    { $group: { _id: '$product' }, averageRating: { $avg: "$rating" } }

                ]);

                if (foods.length > 0) {
                    const averageRating = foods[0].averageRating;
                    await Food.findByIdAndUpdate(req.body.product, { rating: averageRating }, { new: true });

                }
            }
            res.status(200).json({ status: false, message: "Rating updated successfully" });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
    checkUserRating: async (req, res) => {

        const ratingType = req.query.ratingType;
        const product = req.query.product;

        try {
            const existingRating = await Rating.findOne({
                userId: req.body.id,
                ratingType: ratingType,
                product: product
            });

            if (existingRating) {
                res.status(200).json({ status: true, message: "You have already rated this restaurant" });

            } else {
                res.status(200).json({ status: false, message: "User has not rated this restaurant" });
            }

        } catch (error) {

            res.status(500).json({ status: false, message: error.message });

        }

    },
    
}
