import { Response, Request } from "express";
import { Year, Month, Day, DayType, MonthType, YearType } from "./../models/appModel";
import { dates } from "../helpers/dates";
import BaseError from "../baseError";
import calculateSalaryAndTime from ".././helpers/salary";
import createMonthSumFile from "../helpers/monthSum";
export const clockIn = async (req: Request, res: Response) => {
  try {
    const { curYear, curMonth, curDay, namedDay, timeMilisecond, namedMonth } = dates();
    console.log(curYear, curMonth, curDay, namedDay, timeMilisecond, namedMonth, "this is it");
    //Checking if current year exists
    let yearCollection = await Year.findOne({ year: curYear });
    // Creating a day
    const newDay: DayType = new Day({ day: namedDay, number: curDay, start: timeMilisecond });
    if (!yearCollection) {
      //Creating a year
      const newYear: YearType = new Year({ year: curYear });
      //Creating a month
      const newMonth: MonthType = new Month({ name: namedMonth, month: curMonth });

      newMonth.days.push(newDay);
      newYear.months.push(newMonth);

      await newYear.save();
    } else {
      // If yearCollection exists, we search for the month
      let foundMonth = yearCollection.months.find((obj) => obj.month === curMonth);

      // month is not exists, we create a new month
      if (!foundMonth) {
        foundMonth = yearCollection.months.create({ name: namedMonth, month: curMonth });
        yearCollection.months.push(foundMonth);

        // Not sure it need to be here, when a month is missing it means we have change a month
        createMonthSumFile(curMonth, curYear);
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

      await yearCollection.save();
    }

    res.status(200).json({
      status: "success",
      body: {
        message: "You were clocked in",
      },
    });
  } catch (e) {
    res.status(404).json({
      status: "Failed",
      body: {
        message: "Something went wrong",
      },
    });
  }
};

export const clockOut = async (req: Request, res: Response) => {
  try {
    const { curYear, curMonth, curDay, timeMilisecond } = dates();

    // I want to find the current day, to update end and caculate duration
    const yearCollection = await Year.findOne({ year: curYear });
    const months = yearCollection?.months.filter((obj) => obj.month === curMonth);
    let day = months?.[0].days.find((day) => day.number === curDay);

    if (day && day.start && !day.end) {
      day.end = timeMilisecond;
      day.duration = day.end - day.start;
    } else {
      throw new BaseError(404, `This shift has already ended`, true);
    }
    await yearCollection?.save();

    res.status(200).json({
      status: "success",
      body: {
        message: "You were clocked out",
      },
    });
  } catch (e) {
    res.status(404).json({
      status: "Failed",
      body: {
        message: "Something went wrong",
      },
    });
  }
};

export const monthSalary = async (req: Request, res: Response) => {
  try {
    let { curYear, curMonth } = dates();
    const durationSum = await Year.aggregate([
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

    const totalDuration: number = durationSum?.[0].totalDuration;

    const year = await Year.findOne({ year: curYear });

    const month = year?.months.filter((obj) => obj.month === curMonth);
    const days = month?.[0]?.days.length;

    // if (!totalDuration || !days) throw new BaseError(500, `Days or Duration were missing`, false);
    if (!totalDuration || !days) throw new Error(`Days or Duration were missing`);

    const { salary, hours, minutes, transport, socialSecurity, pension, irs, health, neto } =
      calculateSalaryAndTime(totalDuration, days);

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
  } catch {
    res.status(404).json({
      status: "Failed",
      body: {
        message: "Something went wrong",
      },
    });
  }
};
