"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appController_1 = require("../controllers/appController");
const router = express_1.default.Router();
router.route("/clockIn").get(appController_1.clockIn);
router.route("/clockOut").get(appController_1.clockOut);
router.route("/monthSalary").get(appController_1.monthSalary);
exports.default = router;
