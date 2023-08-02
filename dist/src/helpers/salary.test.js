"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const salary_1 = __importDefault(require("./salary"));
test("salary has a zreo duration", () => {
    expect(() => {
        (0, salary_1.default)(0, 0);
    }).toThrow();
});
