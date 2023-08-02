"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Day = exports.Month = exports.Year = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const daySchema = new mongoose_1.default.Schema({
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
const monthSchema = new mongoose_1.default.Schema({
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
const yearSchema = new mongoose_1.default.Schema({
    year: {
        type: Number,
        required: true,
    },
    months: [monthSchema],
});
exports.Year = mongoose_1.default.model("Year", yearSchema);
exports.Month = mongoose_1.default.model("Month", monthSchema);
exports.Day = mongoose_1.default.model("Day", daySchema);
