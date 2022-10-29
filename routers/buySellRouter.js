const express = require("express");
const buyAndSellControllers = require("../controllers/buySellController");
const buyAndSellRouter = express.Router();
const fs = require("fs");
buyAndSellRouter.post(
  "/sell/remove",
  buyAndSellControllers.postSellRemoveDetails
);

buyAndSellRouter.get("/sell",buyAndSellControllers.getSellDetails);

buyAndSellRouter.get("/sellPage", buyAndSellControllers.getSellPageDetails);

buyAndSellRouter.post("/sell", buyAndSellControllers.postSellDetails);
buyAndSellRouter.delete("/sell", buyAndSellControllers.deleteSellAll);

buyAndSellRouter.post(
  "/buy/remove",
  buyAndSellControllers.postBuyRemoveDetails
);
buyAndSellRouter.get("/buy", buyAndSellControllers.getBuyDetails);
buyAndSellRouter.get("/buyPage", buyAndSellControllers.getBuyPageDetails);

buyAndSellRouter.post("/buy", buyAndSellControllers.postBuyDetails);
buyAndSellRouter.delete("/buy", buyAndSellControllers.deleteBuyAll);

buyAndSellRouter.post("/myads", buyAndSellControllers.getMyAds);

module.exports = {
  buyAndSellRouter: buyAndSellRouter
};