require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  skip: (req) => {
    // Skip rate limiting for GET requests
    return req.method === 'GET';
  }
});
app.use(limiter);

// const allowedOrigins = ["http://localhost:3000","https://my-wedding-indol.vercel.app", "https://azaria-ketsi.vercel.app"];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   allowedHeaders: [
//     "Origin",
//     "X-Requested-With",
//     "Content-Type",
//     "Accept",
//     "Authorization",
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// };
// app.options("*", cors(corsOptions));
// app.use(cors(corsOptions));

const corsOptions = {
  origin: true,
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "token",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  // console.log('id:', req.headers['x-device-id'], req.ip)
  res.send("Welcome to `My Wedding Meadia Hub Website` Backend!");
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use("/api/v1", require("./routes"));

module.exports = app;