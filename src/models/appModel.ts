import mongoose, { Schema } from "mongoose";

export type DayType = {
  day: string;
  number: number;
  start: number;
  end?: number;
  duration?: number;
};

export type MonthType = {
  name: string;
  month: number;
  days: DayType[];
};

export type YearType = {
  year: number;
  months: MonthType[];
};

const daySchema = new mongoose.Schema({
  day: String,
  number: Number,
  start: Number,
  end: Number,
  duration: Number,
});

const monthSchema = new mongoose.Schema({
  name: String,
  month: Number,
  days: [daySchema],
});

const yearSchema = new mongoose.Schema({
  year: Number,
  months: [monthSchema],
});

export const Year = mongoose.model("Year", yearSchema);
export const Month = mongoose.model("Month", monthSchema);
// export const Day = mongoose.model("Day", daySchema);
