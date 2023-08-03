"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./src/routes/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 8000;
const mongodbString = process.env.CONNECTIONSTRING;
const password = process.env.PASSWORD;
const fullConnectionString = mongodbString.replace("<password>", password);
mongoose_1.default
    .connect(fullConnectionString)
    .then(() => {
    console.log(`DB connection seccesful!`);
})
    .catch((err) => {
    console.log(`Failed to connect to mongodb`, err);
});
app.use("/api/v1", routes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
