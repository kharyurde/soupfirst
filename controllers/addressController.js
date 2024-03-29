const Address = require("../models/Address");
const User = require("../models/User");


module.exports = {
    addAddress: async (req, res) => {

        const newAddresses = new Address({
            userId: req.user.id,
            addressLine1: req.body.addressLine1,
            postalCode: req.body.postalCode,
            default: req.body.default,
            deliveryInstructions: req.body.deliveryInstructions,
            latitude: req.body.latitude,
            longitude: req.body.longitude,

        });
        try {
            if (req.body.default === true) {
                await Address.updateMany({ userId: req.user.id }, { default: false })
            }
            await newAddresses.save();
            res.status(201).json({ status: true, message: "Address successfully added" });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }

    },

    getAddreses: async (req, res) => {
        try {
            const addresses = await Address.find({ userId: req.user.id }).maxTime(15000); // Adjust the timeout as needed


            res.status(200).json(addresses);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    deleteAddress: async (req, res) => {
        try {
            const addresses = await Address.findByIdAndDelete({ userId: req.user.id });

            res.status(200).json({ status: false, message: "Address deleted successfully" });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    setDefaultAddress: async (req, res) => {
        const addressId = req.params.id;
        const userId = req.user.id;
        try {
            await Address.updateMany({ userId: userId }, { default: false });

            const updatedAddress = await Address.findByIdAndUpdate(addressId, { default: true });

            if (updatedAddress) {
                await User.findByIdAndUpdate(userId, { defaultAddress: addressId });

                res.status(200).json({ status: true, message: "Address set as default successfully" });

            }
        } catch (error) {

            res.status(500).json({ status: false, message: error.message });

        }
    },

    getDefaultAddress: async (req, res) => {
        const userId = req.user.id;

        try {
            const address = await Address.findOne({ userId: userId, default: true });

            res.status(200).json(address);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
} 
