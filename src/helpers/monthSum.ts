import nodemailer from "nodemailer";
import * as XLSX from "xlsx";
import BaseError from "../baseError";
import { Year } from "../models/appModel";
import * as fs from "fs";
XLSX.set_fs(fs);
import { Readable } from "stream";
XLSX.stream.set_readable(Readable);
import * as ExcelJS from "exceljs";
import { buffer } from "stream/consumers";

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
async function createMonthSumFile(curMonth: number, curYear: number): Promise<void> {
  try {
    //Geeting the new current month and subtract 1 for calculating the previous month
    if (curMonth === 1) {
      curMonth = 12;
      --curYear;
    } else curMonth -= 2;

    const year = await Year.findOne({ year: curYear });
    const month = year?.months.filter((obj) => obj.month === curMonth);
    const hourpay = +process.env.HOURPAY!;

    // rearranging the data for XLSX
    const daysData = month?.[0].days.map((day) => {
      let duration;
      let daySalary;

      if (day.duration) {
        const tempDuration = day?.duration / 60000 / 60;
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
        const transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.LOGIN,
            pass: process.env.SMTPPASSWORD,
          },
        });

        async function sendEmail() {
          const info = await transporter.sendMail({
            from: `${process.env.LOGIN}`,
            to: `${process.env.LOGIN}`,
            subject: `${monthNames[curMonth]} - ${curYear}`,
            attachments: [
              {
                filename: `${monthNames[curMonth]} - ${curYear}.xlsx`,
                content: tempFile as Buffer,
              },
            ],
          });
        }

        sendEmail();
      });
    }
  } catch (e) {
    console.log((e as Error).message, "This error is from the monthSum file");
    throw new Error("Something went wrong with the mailer or excelJS");
  }
}

export default createMonthSumFile;
