const express = require("express");
const app = express();
const buyAndSellRouter=require("./routers/buySellRouter");
const authRouter=require("./routers/authRouter");
const mongoose = require("mongoose");
require("dotenv").config();
// enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });
//for serving static files
app.use(express.static("public"));
//for json request
app.use(express.json({
    limit: "50mb",
    extended:true
}));

// Authorized access
app.use((req,res,next) => {
  console.log(req);
    console.log(req.headers);
    if(req.originalMethod!=="GET" && req.headers["security-key"]!==process.env.SECURITY_KEY){
      res.json({"message":"You are not authorized"});
      return;
    }
    next();
  });

app.use("/", buyAndSellRouter.buyAndSellRouter);
app.use("/", authRouter.authRouter);
app.get("/",(req,res) => {
    res.send("App is working.");
});
app.listen(process.env.PORT || 3000,() => {
    console.log("Server Started");
    mongoose.connect(process.env.DATABASE_URI, (err, res) => {
        //console.log(err, res);
        console.log("connected to mongodb");
    });
})