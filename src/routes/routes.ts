import express from "express";

import { clockIn, clockOut, monthSalary } from "../controllers/appController";

const router = express.Router();

router.route("/clockIn").get(clockIn);
router.route("/clockOut").get(clockOut);
router.route("/monthSalary").get(monthSalary);

export default router;
