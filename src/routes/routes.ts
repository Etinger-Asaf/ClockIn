import express from "express";

import { clockIn, clockOut, monthSalary } from "../controllers/appController";

const router = express.Router();

router.route("/clockIn").get(clockIn);
router.route("/clockOut").get(clockOut);
router.route("/monthSalary").get(monthSalary);
//===================================
// APIs I want to implament
// Getting this month salary sum.
// Getting this month working time, in hours and minutes.
//===================================

export default router;
