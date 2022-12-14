const express = require("express");
const router = express.Router();

// /routes/goods.js
const Goods = require("../schemas/goods.js");

//상품 추가 API
router.post("/goods/", async (req,res) => {
  const {goodsId, name, thumbnailUrl, category, price} = req.body;

  const goods = await Goods.find({goodsId});
  if (goods.length){
    return res.status(400).json({
      success:false,
      errorMessage:"이미 존재하는 GoodsId입니다."
    });
  }

  const createdGoods = await Goods.create({goodsId, name, thumbnailUrl, category, price});

  res.json({goods: createdGoods});
})

//상품 목록 조회 API
router.get('/goods',async (req,res) => {
  const goods = await Goods.find({});
  res.status(200).json({goods})
})

//상품 상세 조회 API
router.get('/goods/:goodsId',async (req,res) => {
  const {goodsId} = req.params;
  const result = await Goods.find({goodsId});
  if (result.length === 0) {
    return res.status(400).json({
      success:false,
      errorMessage: "존재하지 않는 상품 입니다."
    })
  }
  res.status(200).json({goodsData : result});
});

// 장바구니에 상품 추가
const Cart = require("../schemas/cart.js");
router.post("/goods/:goodsId/cart", async (req,res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body;

// 강의를 듣다가 이상한 점 발견!!!
// 만약 상품이 존재하지 않는데 그 상품을 장바구니에 추가하면 어떻게 되지?
// 추가해보니 그대로 장바구니에 상품이 추가 되는 이슈가 생김
// 아래와 같은 코드로 장바구니에 추가할 때 상품이 존재하는지 확인하는 코드 작성
  const goodsFind = await Goods.find({goodsId});
  if (goodsFind.length === 0){
    return res.status(400).json({
      success:false,
      errorMessage: "해당 상품이 존재하지 않습니다."
    })
  }
  const existCarts = await Cart.find({goodsId});
  if (existCarts.length){
    return res.status(400).json({
      success:false,
      errorMessage: "이미 장바구니에 해당하는 상품이 존재합니다."
    })
  }

  await Cart.create({goodsId, quantity});

  res.json({result: "success"})
})

// 장바구니 수정
router.put("/goods/:goodsId/cart", async (req,res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body;


// 장바구니에 담겨있지 않은 상품 수정에 대한 예외 처리
  const existCarts = await Cart.find({goodsId});
  if(existCarts.length === 0){
    return res.status(400).json({
      success:false,
      errorMessage: "해당 상품이 장바구니에 존재하지 않습니다."
    })
  }
  await Cart.updateOne(
    {goodsId: goodsId},
    {$set: {quantity:quantity}}
  )

  res.status(200).json({success:true});
})

// 장바구니 상품 삭제
router.delete("/goods/:goodsId/cart", async (req,res) => {
  const {goodsId} = req.params;

  const existCarts = await Cart.find({goodsId});
  if (existCarts.length === 0){
    return res.status(400).json({
     success:false,
     errorMessage: "해당 상품이 장바구니에 존재하지 않습니다"
    })
  }

  await Cart.deleteOne({goodsId});
  res.json({success:true});
})



module.exports = router;

