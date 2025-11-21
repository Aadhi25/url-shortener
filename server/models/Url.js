const mongoose = require("mongoose");
const util = require("../utils/shortUrl");
const Schema = mongoose.Schema;

const urlSchema = new Schema(
  {
    longUrl: {
      type: String,
      required: true,
      unique: true,
    },
    shortUrl: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

urlSchema.pre("save", function (next) {
  let shortId = this._id.toString().slice(12, this._id.length);
  this.shortUrl = "http://localhost:3000/trialurl/" + util.hexToBase62(shortId);
  next();
});

module.exports = mongoose.model("Url", urlSchema);
