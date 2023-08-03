"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const XLSX = __importStar(require("xlsx"));
const appModel_1 = require("../models/appModel");
const fs = __importStar(require("fs"));
XLSX.set_fs(fs);
const stream_1 = require("stream");
XLSX.stream.set_readable(stream_1.Readable);
const ExcelJS = __importStar(require("exceljs"));
const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
function createMonthSumFile(curMonth, curYear) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Geeting the new current month and subtract 1 for calculating the previous month
            if (curMonth === 1) {
                curMonth = 12;
                --curYear;
            }
            else
                curMonth -= 2;
            const year = yield appModel_1.Year.findOne({ year: curYear });
            const month = year === null || year === void 0 ? void 0 : year.months.filter((obj) => obj.month === curMonth);
            const hourpay = +process.env.HOURPAY;
            // rearranging the data for XLSX
            const daysData = month === null || month === void 0 ? void 0 : month[0].days.map((day) => {
                let duration;
                let daySalary;
                if (day.duration) {
                    const tempDuration = (day === null || day === void 0 ? void 0 : day.duration) / 60000 / 60;
                    const tempDaySalary = tempDuration * hourpay;
                    duration = Number(tempDuration).toFixed(1);
                    daySalary = Number(tempDaySalary).toFixed(1);
                }
                const returnObj = { day: day.day, number: day.number, duration, daySalary };
                return returnObj;
            });
            // // Creating the excel file.
            // if (daysData) {
            //   const worksheet = XLSX.utils.json_to_sheet(daysData);
            //   const workbook = XLSX.utils.book_new();
            //   XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
            //   const tempFile = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
            //   // Setting NodeMail and sending the email
            //   const transporter = nodemailer.createTransport({
            //     host: "smtp-relay.brevo.com",
            //     port: 587,
            //     secure: false,
            //     auth: {
            //       user: process.env.LOGIN,
            //       pass: process.env.SMTPPASSWORD,
            //     },
            //   });
            //   async function sendEmail() {
            //     const info = await transporter.sendMail({
            //       from: `${process.env.LOGIN}`,
            //       to: `${process.env.LOGIN}`,
            //       subject: `${monthNames[curMonth]} - ${curYear}`,
            //       attachments: [
            //         { filename: `${monthNames[curMonth]} - ${curYear}.xlsx`, content: tempFile },
            //       ],
            //     });
            //   }
            //   sendEmail();
            // Creating the excel file.
            //====================================================
            //xlsx above
            //====================================================
            if (daysData) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("Dates");
                worksheet.columns = [
                    { header: "Day", key: "day" },
                    { header: "Number", key: "number" },
                    { header: "Duration", key: "duration" },
                    { header: "Day Salary", key: "daySalary" },
                ];
                worksheet.addRows(daysData);
                // Convert the workbook to a buffer
                workbook.xlsx.writeBuffer().then((tempFile) => {
                    // Send the email with the Excel file as an attachment
                    const transporter = nodemailer_1.default.createTransport({
                        host: "smtp-relay.brevo.com",
                        port: 587,
                        secure: false,
                        auth: {
                            user: process.env.LOGIN,
                            pass: process.env.SMTPPASSWORD,
                        },
                    });
                    function sendEmail() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const info = yield transporter.sendMail({
                                from: `${process.env.LOGIN}`,
                                to: `${process.env.LOGIN}`,
                                subject: `${monthNames[curMonth]} - ${curYear}`,
                                attachments: [
                                    {
                                        filename: `${monthNames[curMonth]} - ${curYear}.xlsx`,
                                        content: tempFile,
                                    },
                                ],
                            });
                        });
                    }
                    sendEmail();
                });
            }
        }
        catch (e) {
            console.log(e.message, "This error is from the monthSum file");
            throw new Error("Something went wrong with the mailer or excelJS");
        }
    });
}
exports.default = createMonthSumFile;
