import mongoose, { Schema, Document } from "mongoose";

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

// I need to sppecify YearType as an extended of mongoose Document becouse when creating a new year I want to make shure
// the year I am getting is in the right format and to preform a .save() I have to make sure it is a mongoose Document type
export interface YearType extends Document {
  year: number;
  months: MonthType[];
}

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  end: Number,
  duration: Number,
});

const monthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  days: [daySchema],
});

const yearSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  months: [monthSchema],
});

export const Year = mongoose.model("Year", yearSchema);
export const Month = mongoose.model("Month", monthSchema);
export const Day = mongoose.model("Day", daySchema);
