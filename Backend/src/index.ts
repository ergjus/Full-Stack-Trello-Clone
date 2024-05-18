import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import boardRoute from "./routes/BoardRoute";
import listRoute from "./routes/ListRoute";
import cardRoute from "./routes/CardRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"));

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/my/user", myUserRoute);
app.use("/api/my/board", boardRoute);
app.use("/api/my/list", listRoute);
app.use("/api/my/card", cardRoute);

app.listen(3000, () => {
  console.log("server started on localhost: 3000");
});
