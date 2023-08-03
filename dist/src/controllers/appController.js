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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthSalary = exports.clockOut = exports.clockIn = void 0;
const appModel_1 = require("./../models/appModel");
const dates_1 = require("../helpers/dates");
const baseError_1 = __importDefault(require("../baseError"));
const salary_1 = __importDefault(require(".././helpers/salary"));
const monthSum_1 = __importDefault(require("../helpers/monthSum"));
const clockIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { curYear, curMonth, curDay, namedDay, timeMilisecond, namedMonth } = (0, dates_1.dates)();
        console.log(curYear, curMonth, curDay, namedDay, timeMilisecond, namedMonth, "this is it");
        //Checking if current year exists
        let yearCollection = yield appModel_1.Year.findOne({ year: curYear });
        // Creating a day
        const newDay = new appModel_1.Day({ day: namedDay, number: curDay, start: timeMilisecond });
        if (!yearCollection) {
            //Creating a year
            const newYear = new appModel_1.Year({ year: curYear });
            //Creating a month
            const newMonth = new appModel_1.Month({ name: namedMonth, month: curMonth });
            newMonth.days.push(newDay);
            newYear.months.push(newMonth);
            yield newYear.save();
        }
        else {
            // If yearCollection exists, we search for the month
            let foundMonth = yearCollection.months.find((obj) => obj.month === curMonth);
            // month is not exists, we create a new month
            if (!foundMonth) {
                foundMonth = yearCollection.months.create({ name: namedMonth, month: curMonth });
                yearCollection.months.push(foundMonth);
                // Not sure it need to be here, when a month is missing it means we have change a month
                (0, monthSum_1.default)(curMonth, curYear);
            }
            // month exists, we checking this if current day is already exists
            if (foundMonth) {
                for (let day in foundMonth.days) {
                    if (foundMonth.days[day].number === curDay) {
                        throw new Error("This shift has already started");
                    }
                }
            }
            foundMonth.days.push(newDay);
            yield yearCollection.save();
        }
        res.status(200).json({
            status: "success",
            body: {
                message: "You were clocked in",
            },
        });
    }
    catch (e) {
        // need to check the current status code and how to create the right error
        res.status(404).json({
            status: "Failed",
            body: {
                message: e.message,
            },
        });
    }
});
exports.clockIn = clockIn;
const clockOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { curYear, curMonth, curDay, timeMilisecond } = (0, dates_1.dates)();
        // I want to find the current day, to update end and caculate duration
        const yearCollection = yield appModel_1.Year.findOne({ year: curYear });
        const months = yearCollection === null || yearCollection === void 0 ? void 0 : yearCollection.months.filter((obj) => obj.month === curMonth);
        let day = months === null || months === void 0 ? void 0 : months[0].days.find((day) => day.number === curDay);
        if (day && day.start && !day.end) {
            day.end = timeMilisecond;
            day.duration = day.end - day.start;
        }
        else {
            throw new baseError_1.default(404, `This shift has already ended`, true);
        }
        yield (yearCollection === null || yearCollection === void 0 ? void 0 : yearCollection.save());
        res.status(200).json({
            status: "success",
            body: {
                message: "You were clocked out",
            },
        });
    }
    catch (e) {
        res.status(404).json({
            status: "Failed",
            body: {
                message: e.message,
            },
        });
    }
});
exports.clockOut = clockOut;
const monthSalary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let { curYear, curMonth } = (0, dates_1.dates)();
        const durationSum = yield appModel_1.Year.aggregate([
            { $match: { year: { $eq: curYear } } },
            { $unwind: "$months" },
            { $match: { "months.month": curMonth } },
            { $unwind: "$months.days" },
            {
                $group: {
                    _id: null,
                    totalDuration: { $sum: "$months.days.duration" },
                },
            },
        ]);
        const totalDuration = durationSum === null || durationSum === void 0 ? void 0 : durationSum[0].totalDuration;
        const year = yield appModel_1.Year.findOne({ year: curYear });
        const month = year === null || year === void 0 ? void 0 : year.months.filter((obj) => obj.month === curMonth);
        const days = (_a = month === null || month === void 0 ? void 0 : month[0]) === null || _a === void 0 ? void 0 : _a.days.length;
        // if (!totalDuration || !days) throw new BaseError(500, `Days or Duration were missing`, false);
        if (!totalDuration || !days)
            throw new Error(`Days or Duration were missing`);
        const { salary, hours, minutes, transport, socialSecurity, pension, irs, health, neto } = (0, salary_1.default)(totalDuration, days);
        res.status(200).json({
            status: "success",
            body: {
                message: "This is the monthly salary for now",
                salary,
                hours,
                minutes,
                transport,
                socialSecurity,
                pension,
                irs,
                health,
                neto,
            },
        });
    }
    catch (e) {
        res.status(404).json({
            status: "Failed",
            body: {
                message: e.message,
            },
        });
    }
});
exports.monthSalary = monthSalary;
