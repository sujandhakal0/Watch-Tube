import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// common middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";

//routes
app.use("/api/v1/healthcheck", healthCheckRouter)



export { app };
