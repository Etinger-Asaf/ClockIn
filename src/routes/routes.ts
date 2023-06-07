import express from "express";

import { clockIn, clockOut } from "../controllers/appController";

const router = express.Router();

router.route("/clickIn").post(clockIn);
router.route("/clockOut").post(clockOut);

module.exports = router;
