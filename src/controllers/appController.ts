import { Response, Request } from "express";
import { Year, Month } from "./../models/appModel";
import { dates } from "../helpers/dates";
import { createDay } from "./../helpers/timeUnits";

export const clockIn = async (req: Request, res: Response) => {
  try {
    const { curYear, curMonth } = dates();
    //Checking if current year exists
    let yearCollection = await Year.findOne({ year: curYear });
    // This create a Year, Month and the current day
    const newDay = createDay();
    if (!yearCollection) {
      const newYear = new Year({ year: curYear });
      const newMonth = new Month({ month: curMonth });

      newMonth.days.push(newDay);
      newYear.months.push(newMonth);

      await newYear.save();
    } else {
      let foundMonth = yearCollection.months.find((obj) => obj.month === curMonth);

      if (!foundMonth) {
        foundMonth = yearCollection.months.create({ month: curMonth });
        yearCollection.months.push(foundMonth);
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
    console.log(e, "this is the error");
  }
};

export const clockOut = async (req: Request, res: Response) => {
  try {
    const { curYear, curMonth, curDay, timeMilisecond } = dates();

    // I want to fint the current day, to update end and caculate duration
    const yearCollection = await Year.findOne({ year: curYear });
    const months = yearCollection?.months.filter((obj) => obj.month === curMonth);
    let day = months?.[0].days.find((day) => day.number === curDay);

    if (day && day.start) {
      day.end = timeMilisecond;
      day.duration = day.end - day.start;
    }
    await yearCollection?.save();

    res.status(200).json({
      status: "success",
      body: {
        message: "You were clocked out",
      },
    });
  } catch (e) {
    console.log(e, "this is also an error");
  }
};
