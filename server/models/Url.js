import mongoose from "mongoose";
import { hexToBase62 } from "../utils/shortUrl.js";
const Schema = mongoose.Schema;

const urlSchema = new Schema(
  {
    longUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      unique: true,
    },
    shortString: {
      type: String,
      unique: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      default: null,
      index: true,
    },
    noOfClicks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

urlSchema.index({ owner: 1, longUrl: 1 }, { unique: true, sparse: true });
urlSchema.index({ sessionId: 1, longUrl: 1 }, { unique: true, sparse: true });

urlSchema.pre("save", function (next) {
  let shortId = this._id.toString().slice(12, this._id.length);
  this.shortString = hexToBase62(shortId);
  this.shortUrl =
    "https://url-shortener-8wql.onrender.com/" + hexToBase62(shortId);
  next();
});

const Url = mongoose.model("Url", urlSchema);
export default Url;
