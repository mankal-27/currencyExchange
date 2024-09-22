const mongoose = require("mongoose");   

const CurrencySchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    name: String,
    symbol: String,
});


module.exports = mongoose.model("Currency", CurrencySchema);