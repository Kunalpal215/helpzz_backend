const buyModel = require("../models/buyModel");
const sellModel = require("../models/sellModel");
const fs = require("fs");
const path = require("path");
const deepai = require("deepai");
const uuid = require("uuid");
const sharp = require("sharp");
const { validateHeaderName } = require("http");
const API_URL = "https://whispering-journey-08979.herokuapp.com/";
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  secure: true
});
console.log(cloudinary.config());
deepai.setApiKey(process.env.NSFW_API_KEY);

exports.getImage = async (req, res) => {
  console.log("Get image par");
  const imagePath = path.resolve(
    __dirname +
    "/../" +
    "images_folder" +
    "/" +
    req.query.photo_id +
    "-compressed.jpg"
  );
  console.log(imagePath);
  res.sendFile(imagePath);
};

exports.getCompressedImage = async (req, res) => {
  console.log("Get image par");
  const imagePath = path.resolve(
    __dirname +
    "/../" +
    "images_folder" +
    "/" +
    req.query.photo_id +
    "-ultracompressed.jpg"
  );
  console.log(imagePath);
  res.sendFile(imagePath);
};

exports.getSellDetails = async (req, res) => {
  try {
    console.log(req);
    const details = await sellModel.find();
    details.sort(compare);
    return res.json({
      details: details
    });
  } catch (error) {
    console.log(error.message);
  }
};


exports.deleteSellAll = async (req,res) => {
  await sellModel.deleteMany({});
  res.json({success : true});
}

exports.postSellDetails = async (req, res) => {
  try {
    var {
      title,
      price,
      phonenumber,
      description,
      imageString,
      email,
      username,
    } = req.body;
    console.log(title);
    console.log(price);
    console.log(phonenumber);
    console.log(description);
    console.log(imageString);

    const imageName = uuid.v4();
    const imagePath = path.resolve(
      __dirname + "/../" + "public" + "/" + "images_folder" + "/" + imageName + ".jpg"
    );
    console.log("image path is: " + imagePath);
    console.log(Buffer.from(imageString, "base64").toString("ascii"));
    fs.writeFileSync(imagePath, Buffer.from(imageString, "base64"), (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully\n");
      }
    });
    const metadata = await sharp(imagePath).metadata();
      console.log(metadata);
      const photo_id = imageName;
      var imageURL =
        "https://whispering-journey-08979.herokuapp.com/images_folder/" + imageName +"-compressed.jpg";
      var compressedImageURL =
      "https://whispering-journey-08979.herokuapp.com/images_folder/" + imageName +"-ultracompressed.jpg";
      const newImagePath = path.resolve(
        __dirname +
        "/../" +  "public" + "/" + 
        "images_folder" +
        "/" +
        imageName +
        "-compressed.jpg"
      );
      const compressedImagePath = path.resolve(
        __dirname +
        "/../" +  "public" + "/" + 
        "images_folder" +
        "/" +
        imageName +
        "-ultracompressed.jpg"
      );
      console.log(newImagePath);
      //const imageURL = "https://femefun.com/contents/videos_screenshots/50000/50719/preview.mp4.jpg";
      await sharp(imagePath)
          .resize({
            width: Math.floor(metadata.width / 2),
            height: Math.floor(metadata.height / 2),
          })
          .withMetadata()
          .toFormat("jpg", {
            mozjpeg: true
          })
          .toFile(newImagePath);
        await sharp(imagePath)
          .resize({
            width: Math.floor(
              metadata.width > 5 ? metadata.width / 5 : metadata.width
            ),
            height: Math.floor(
              metadata.height > 5 ? metadata.height / 5 : metadata.height
            ),
          })
          .withMetadata()
          .toFormat("jpg", {
            mozjpeg: true
          })
          .toFile(compressedImagePath);
        var safeToUseResp = await deepai.callStandardApi("nsfw-detector", {
          image: fs.createReadStream(imagePath),
        });
        fs.unlinkSync(imagePath);
        let response = await cloudinary.uploader.upload(imageURL);
        imageURL=response["url"]
        response = await cloudinary.uploader.upload(compressedImageURL);
        compressedImageURL=response["url"]
        console.log(imageURL,compressedImageURL);
        //fs.unlinkSync(imagePath);
        if (safeToUseResp.output.nsfw_score > 0.1) {
          res.json({
            saved_successfully: false,
            image_safe: false
          });
          return;
        }
        const newSellDetail = await new sellModel({
            title,
            price,
            phonenumber,
            description,
            imageURL,
            compressedImageURL,
            email,
            username,
          })
          .save()
          .then((result) => {
            console.log(result);
            res.json({
              saved_successfully: true,
              image_safe: true
            });
          });
  } catch (error) {
    console.log(error);
    console.log("Error Occured");
    return res.json({
      saved_successfully: false,
      image_safe: true
    });
  }
};

// buy details

exports.getBuyDetails = async (req, res) => {
  try {
    const details = await buyModel.find();
    details.sort(compare);
    return res.json({
      details: details
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteBuyAll = async (req,res) => {
  await buyModel.deleteMany({});
  res.json({success : true});
}

exports.postBuyDetails = async (req, res) => {
  try {
    var {
      title,
      price,
      phonenumber,
      description,
      imageString,
      email,
      username,
    } = req.body;
    console.log(title);
    console.log(price);
    console.log(phonenumber);
    console.log(description);
    console.log(imageString);

    const imageName = uuid.v4();
    const imagePath = path.resolve(
      __dirname + "/../" + "public" + "/" + "images_folder" + "/" + imageName + ".jpg"
    );
    console.log("image path is: " + imagePath);
    console.log(Buffer.from(imageString, "base64").toString("ascii"));
    fs.writeFileSync(imagePath, Buffer.from(imageString, "base64"), (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully\n");
      }
    });
    const metadata = await sharp(imagePath).metadata();
      console.log(metadata);
      const photo_id = imageName;
      var imageURL =
        "https://whispering-journey-08979.herokuapp.com/images_folder/" + imageName +"-compressed.jpg";
      var compressedImageURL =
      "https://whispering-journey-08979.herokuapp.com/images_folder/" + imageName +"-ultracompressed.jpg";
      const newImagePath = path.resolve(
        __dirname +
        "/../" +  "public" + "/" + 
        "images_folder" +
        "/" +
        imageName +
        "-compressed.jpg"
      );
      const compressedImagePath = path.resolve(
        __dirname +
        "/../" +  "public" + "/" + 
        "images_folder" +
        "/" +
        imageName +
        "-ultracompressed.jpg"
      );
      console.log(newImagePath);
      //const imageURL = "https://femefun.com/contents/videos_screenshots/50000/50719/preview.mp4.jpg";
      await sharp(imagePath)
          .resize({
            width: Math.floor(metadata.width / 2),
            height: Math.floor(metadata.height / 2),
          })
          .withMetadata()
          .toFormat("jpg", {
            mozjpeg: true
          })
          .toFile(newImagePath);
        await sharp(imagePath)
          .resize({
            width: Math.floor(
              metadata.width > 5 ? metadata.width / 5 : metadata.width
            ),
            height: Math.floor(
              metadata.height > 5 ? metadata.height / 5 : metadata.height
            ),
          })
          .withMetadata()
          .toFormat("jpg", {
            mozjpeg: true
          })
          .toFile(compressedImagePath);
        var safeToUseResp = await deepai.callStandardApi("nsfw-detector", {
          image: fs.createReadStream(imagePath),
        });
        fs.unlinkSync(imagePath);
        let response = await cloudinary.uploader.upload(imageURL);
        imageURL=response["url"]
        response = await cloudinary.uploader.upload(compressedImageURL);
        compressedImageURL=response["url"]
        console.log(imageURL,compressedImageURL);
        //fs.unlinkSync(imagePath);
        if (safeToUseResp.output.nsfw_score > 0.1) {
          res.json({
            saved_successfully: false,
            image_safe: false
          });
          return;
        }
        const newBuyDetail = await new buyModel({
            title,
            price,
            phonenumber,
            description,
            imageURL,
            compressedImageURL,
            email,
            username,
          })
          .save()
          .then((result) => {
            console.log(result);
            res.json({
              saved_successfully: true,
              image_safe: true
            });
          });
  } catch (error) {
    console.log(error);
    console.log("Error Occured");
    return res.json({
      saved_successfully: false,
      image_safe: true
    });
  }
};

const compare = (a, b) => {
  return b.date - a.date;
};