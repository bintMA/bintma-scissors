// import validateUrl from "./utils/utils.js";
const Url = require("../models/urlModel");
const qr = require("qrcode");
const dotenv = require("dotenv");
const shortId = require("shortid");
const user = require("../models/userModel");
dotenv.config();

exports.urlRedirection = async function (req, res) {
  try {
    let url = await Url.findOne({ urlId: req.params.urlId });
    console.log(url);
    if (url) {
      await Url.updateOne({ urlId: req.params.urlId }, { $inc: { clicks: 1 } });

      return res.status(302).redirect(url.origUrl);
    } else {
      res.status(404).send("Url not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("input a valid url");
  }
};

let history = [];

exports.shortenUrl = async function (req, res) {
  const originalUrl = req.body;
  const baseUrl = process.env.BASE_URL;
  const url_Id = shortId.generate();
  const user_id = await req.cookies;
  // console.log(user_id);

  const loggedInUser = user.findById(user_id);
  // console.log(loggedInUser);

  if (!loggedInUser) {
    // User is not logged in
    return res.send("Please log in to shorten the URL");
  }
  if (originalUrl) {
    try {
      let url = Url.findOne({ originalUrl });
      if (url) {
        return res.send("url already exist");
      } else {
        const shortUrl = `${baseUrl}url_idlId}`;
        let url = Url.create({
          url_Id,
          originalUrl,
          shortUrl,
        });

        //    const urlData = Object.entries(urls)[1];

        (await url).save();
        // res.redirect("/short");
        // return res.render("url", { urls, history });
        //    return res.render("url", { urlData, history });
        return res.status(201).send(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("server error");
    }
  } else {
    res.status(400).json("invalid url");
  }
};
exports.customizedUrl = async function (req, res) {
  const baseUrl = process.env.BASE_URL;
  const { url_id, originalUrl } = req.body;

  const token = req.cookies.token;
  // Verify token
  const user_data = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user_id = user_data.user._id; // decode user jwt save as cookies
  const loggedInUser = await auth.findById(user_id);

  if (!loggedInUser) {
    // User is not logged in
    return res.send("Please log in to shorten the URL");
  }
  if (originalUrl) {
    try {
      url = await Url.findOne({ url_id });
      if (url) {
        return res.send("url already exist");
      } else {
        const costumUrl = `${baseUrl}/${url_id}`;
        const urls = await Url.create({
          originalUrl,
          costumUrl,
          url_id,
        });

        (await urls).save();
        return res.status(201).send(urls);
      }
    } catch (err) {
      console.log(err);
      new Error("unable to create constum url");
    }
  } else {
    res.status(400).json("invalid url");
  }
};

exports.generateQrCode = async function (req, res) {
  const shortId = req.body;
  console.log(shortId);
  const qrCodeData = await qr.toDataURL(shortId);
  const qrBufferCode = Buffer.from(qrCodeData.split(",")[1], "base64");
  fs.writeFileSync("qrcode.png", qrBufferCode);
  const url = res.render("image", { qrCode: qrCodeData });
  console.log(url);
  return res.send(qrBufferCode);
};
