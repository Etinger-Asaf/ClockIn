import { Response, Request } from "express";
export const clockIn = (req: Request, res: Response) => {
  try {
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

export const clockOut = (req: Request, res: Response) => {
  try {
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
