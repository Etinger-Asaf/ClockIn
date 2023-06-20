type dateType = {
  curYear: number;
  curMonth: number;
  curDay: number;
  namedDay: string;
  namedMonth: string;
  timeMilisecond: number;
};

const date = new Date();
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
export function dates(): dateType {
  const curYear = date.getFullYear();
  const curMonth = date.getMonth();
  const curDay = date.getDate();
  const day = date.getDay();
  const namedDay = dayNames[day];
  const namedMonth = monthNames[curMonth];
  const timeMilisecond = date.getTime();
  return { curYear, curMonth, curDay, namedDay, timeMilisecond, namedMonth };
}
