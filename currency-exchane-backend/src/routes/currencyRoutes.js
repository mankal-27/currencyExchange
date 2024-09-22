const express = require("express");
const router = express.Router();
const { getAvailableCurrencies, getExchangeRate } = require("../controllers/currencyController");
const cache = require("../middleware/cache");

router.get("/currencies", getAvailableCurrencies);
router.get("/exchange-rate", cache, getExchangeRate);

module.exports = router;
