"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseError_1 = __importDefault(require("../baseError"));
require("dotenv/config");
const calculateSalaryAndTime = (duration) => {
    if (duration <= 0)
        throw new baseError_1.default(404, "Duration was smaller or equals to zero", true);
    const totalTime = Math.floor(duration / 60000);
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    const hourPay = +process.env.HOURPAY;
    const payPerMinute = hourPay / 60;
    const minutesSalary = minutes * payPerMinute;
    const salary = Math.floor(hours * hourPay + minutesSalary);
    return { salary, hours, minutes };
};
exports.default = calculateSalaryAndTime;
