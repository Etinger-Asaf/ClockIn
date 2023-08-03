"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dates = void 0;
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
function dates() {
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const curDay = date.getDate();
    const day = date.getDay();
    const namedDay = dayNames[day];
    const namedMonth = monthNames[curMonth - 1];
    const timeMilisecond = date.getTime();
    return { curYear, curMonth, curDay, namedDay, timeMilisecond, namedMonth };
}
exports.dates = dates;
