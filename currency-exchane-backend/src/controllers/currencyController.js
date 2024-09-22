const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const getAvailableCurrencies = async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.FRANKFURTER_API}/currencies`);
        res.status(200).json(response.data);
    } catch (error) {
        next(error);
    }
}

const getExchangeRate = async (req, res, next) => {
    const { from, to, amount } = req.query;
    try {
      const response = await axios.get(`${process.env.FRANKFURTER_API}/latest`, {
        params: {
          from,
          to,
          amount,
        },
      });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
};

module.exports = {
    getAvailableCurrencies,
    getExchangeRate
}