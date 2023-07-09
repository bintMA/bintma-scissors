const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const {
  urlRedirection,
  generateQrCode,
  shortenUrl,
  customizedUrl,
} = require("../controller/urlController");
dotenv.config();
const router = express.Router();
// short url generator

router.post("/short", shortenUrl);
router.post("/costumeUrl", customizedUrl);
router.get("/:urlId", urlRedirection);
router.post("/qrCode", generateQrCode);

module.exports = router;
