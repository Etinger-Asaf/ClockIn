"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import createMonthSumFile from "./monthSum";
const appModel_1 = require("../models/appModel");
function createMonthSumFile(curMonth, curYear) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Geeting the new current month and subtract 1 for calculating the previous month
            if (curMonth === 1) {
                curMonth = 12;
            }
            else
                --curMonth;
            const year = yield appModel_1.Year.findOne({ year: curYear });
            const month = year === null || year === void 0 ? void 0 : year.months.filter((obj) => obj.month === curMonth);
            const hourpay = +process.env.HOURPAY;
            // rearranging the data for XLSX
            let returnObj;
            const daysData = month === null || month === void 0 ? void 0 : month[0].days.map((day) => {
                let duration;
                let daySalary;
                if (day.duration) {
                    const tempDuration = (day === null || day === void 0 ? void 0 : day.duration) / 60000 / 60;
                    const tempDaySalary = tempDuration * hourpay;
                    duration = Number(tempDuration).toFixed(1);
                    daySalary = Number(tempDaySalary).toFixed(1);
                }
                returnObj = { day: day.day, number: day.number, duration, daySalary };
            });
            return returnObj;
        }
        catch (e) {
            console.log(e);
        }
    });
}
const yearData = {
    year: 2023,
    months: [
        {
            month: 6,
            days: [
                { day: 1, number: 1, duration: 18000000 },
                { day: 2, number: 2, duration: 21000000 }, // Sample data for testing
            ],
        },
    ],
};
jest.mock("../models/appModel", () => ({
    Year: { findOne: jest.fn(() => yearData) },
}));
test("CreatingMonthSumFile", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const month = yield createMonthSumFile(7, 2023);
        expect(month).toHaveProperty("day");
        expect(month).toHaveProperty("number");
    }
    catch (e) {
        console.log(e);
    }
}));
