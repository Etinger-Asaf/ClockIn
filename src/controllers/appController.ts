import { Response, Request } from "express";
import { Year, Month, Day, DayType, MonthType, YearType } from "./../models/appModel";
import { dates } from "../helpers/dates";

export const clockIn = async (req: Request, res: Response) => {
  try {
    const { curYear, curMonth, curDay, namedDay, timeMilisecond, namedMonth } = dates();
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
      // If yearCollectino exists, we search for the month
      let foundMonth = yearCollection.months.find((obj) => obj.month === curMonth);

      // month is not exists, we create a new month
      if (!foundMonth) {
        foundMonth = yearCollection.months.create({ month: curMonth });
        yearCollection.months.push(foundMonth);
      }

      // month exists, we checking this if current day is already exists
      if (foundMonth) {
        for (let day in foundMonth.days) {
          if (foundMonth.days[day].number === curDay) {
            console.log("This day has already started");
            throw new Error("This day is already exists");
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
    console.log(e, "this is the error");
    // need to check the current status code and how to create the right error
    res.status(200).json({
      status: "failed",
      body: {
        message: "This day already exists",
      },
    });
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
