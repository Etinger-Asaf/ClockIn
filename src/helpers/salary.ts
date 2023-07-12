import BaseError from "../baseError";
import "dotenv/config";

type monthlyData = {
  salary: number;
  hours: number;
  minutes: number;
};

type monthData = {
  salary: number;
  pension: number;
  irs: number;
  transport: number;
  socialSecurity: number;
  health: number;
  hours: number;
  minutes: number;
  neto: number;
};

const calculateSalaryAndTime = (duration: number, days: number): monthData => {
  if (duration <= 0) throw new BaseError(404, "Duration was smaller or equals to zero", true);

  const totalMin = Math.floor(duration / 60000); // Give my my working time in minutes.
  console.log(totalMin, "total");
  const minutes = totalMin % 60;
  console.log(minutes, "minutes");
  const hours = Math.floor(totalMin / 60);
  const hourPay = +process.env.HOURPAY!; // Hour rate.
  let salary = hours * hourPay + (hourPay / 100) * minutes; // Calculate salary payment.
  console.log(salary, "salary");
  const transport = days * 11; // Calculate transport payment.
  salary += transport;
  const pension = Math.floor(salary * 0.06);
  const health = Math.floor(salary * 0.031);
  const socialSecurity = Math.floor(salary * 0.004);
  const plusPoints = 235 * 2.25;
  const clacIrs = (salary: number): number => {
    let irs = 0;
    if (salary < 6790) return irs;
    if (salary > 6790) irs = salary - salary * 0.9;
    if (salary > 6790 && salary < 9740) irs = salary - salary * 0.86;
    if (salary > 9740 && salary < 15620) irs = salary - salary * 0.8;
    return Math.floor(irs);
  };

  const irs = clacIrs(salary);
  let neto: number = 0;
  if (irs === 0) {
    neto = salary - health - pension - socialSecurity;
  } else {
    neto = salary - health - pension - socialSecurity - (irs - plusPoints);
  }

  return {
    irs,
    minutes,
    hours,
    pension,
    socialSecurity,
    health,
    salary,
    transport,
    neto,
  };
};

export default calculateSalaryAndTime;
