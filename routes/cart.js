const express = require("express");
const router = express.Router();

const Cart = require("../schemas/cart.js");
const Goods = require("../schemas/goods.js");

// localhost:3000/api/carts GET Method로 호출할 때
// 장바구니 상품 전체 조회
router.get("/carts", async(req,res) => {
  const carts = await Cart.find({});
  // [{goodsId, quantity}]

  const goodsIds = carts.map((cart) => {
    return cart.goodsId;
  })
  const goods = await Goods.find({goodsId: goodsIds})
  // Goods에 해당하는 모든 정보를 가지고 올건데,
  // 만약 goodsIds 변수 안에 존재하는 값일 때에만 조회해라.

  const results = carts.map((cart) => {
    return {
      "quantity": cart.quantity,
      "goods": goods.find((item) => item.goodsId === cart.goodsId)
    }
  })
  
  res.json({
    "carts": results
  })
});

module.exports = router;