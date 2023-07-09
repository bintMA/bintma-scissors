const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const urlSchema = new mongoose.Schema({
  url_Id: { type: String },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String },
  costumUrl: { type: String },
  user_id: {
    type: ObjectId,
    // required: [true, "Please provide the blog author's Id."],
    ref: "auth",
  },
  clicks: { type: Number, required: true, default: 0 },
  date: { type: String, default: Date.now() },
});

const url = mongoose.model("urlCollection", urlSchema);

module.exports = url;
