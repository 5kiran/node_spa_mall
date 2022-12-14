const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema({
  goodsId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  thumbnailUrl: {
    type: String,
  },
  catergory: {
    type: String,
  },
  price: {
    type: Number,
  }
});

module.exports = mongoose.model("Goods", goodsSchema);