type dateType = {
  curYear: number;
  curMonth: number;
  curDay: number;
  namedDay: string;
  timeMilisecond: number;
};

const date = new Date();
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function dates(): dateType {
  const curYear = date.getFullYear();
  const curMonth = date.getMonth();
  const curDay = date.getDate();
  const day = date.getDay();
  const namedDay = dayNames[day];
  const timeMilisecond = date.getTime();
  return { curYear, curMonth, curDay, namedDay, timeMilisecond };
}
