import express from "express";
const router = express.Router();

import { redirectUrl } from "../controllers/urlController.js";

router.get("/:shorturl", redirectUrl);

export default router;
