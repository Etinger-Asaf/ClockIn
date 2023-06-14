import express from "express";

import { clockIn, clockOut } from "../controllers/appController";

const router = express.Router();

router.route("/clockIn").get(clockIn);
router.route("/clockOut").post(clockOut);

export default router;
