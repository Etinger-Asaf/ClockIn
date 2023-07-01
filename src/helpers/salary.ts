import BaseError from "../baseError";
import "dotenv/config";

type monthlyData = {
  salary: number;
  hours: number;
  minutes: number;
};

const calculateSalaryAndTime = (duration: number): monthlyData => {
  if (duration <= 0) throw new BaseError(404, "Duration was smaller or equals to zero", true);

  const totalTime = Math.floor(duration / 60000);
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  const hourPay = +process.env.HOURPAY!;
  const payPerMinute = hourPay / 60;
  const minutesSalary = minutes * payPerMinute;
  const salary = Math.floor(hours * hourPay + minutesSalary);
  return { salary, hours, minutes };
};

export default calculateSalaryAndTime;
