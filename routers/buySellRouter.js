const express = require("express");
const buyAndSellControllers = require("../controllers/buySellController");
const buyAndSellRouter = express.Router();
const fs = require("fs");
buyAndSellRouter.post(
  "/sell/remove",
  buyAndSellControllers.postSellRemoveDetails
);
buyAndSellRouter.get("/sell",buyAndSellControllers.getSellDetails);
buyAndSellRouter.post("/sell", buyAndSellControllers.postSellDetails);
buyAndSellRouter.delete("/sell", buyAndSellControllers.deleteSellAll);

buyAndSellRouter.get("/buy", buyAndSellControllers.getBuyDetails);
buyAndSellRouter.post("/buy", buyAndSellControllers.postBuyDetails);
buyAndSellRouter.delete("/buy", buyAndSellControllers.deleteBuyAll);

module.exports = {
  buyAndSellRouter: buyAndSellRouter
};