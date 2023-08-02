"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dates_1 = require("./dates");
const res = (0, dates_1.dates)();
test("properties on returned object from dates function", () => {
    expect(res).toHaveProperty("curYear");
    expect(res).toHaveProperty("curMonth");
    expect(res).toHaveProperty("curDay");
    expect(res).toHaveProperty("namedDay");
    expect(res).toHaveProperty("timeMilisecond");
    expect(res).toHaveProperty("namedMonth");
});
