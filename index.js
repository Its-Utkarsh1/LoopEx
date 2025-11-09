require('dotenv').config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectToDB = require("./connect");
const cron = require("node-cron");

const { checkForAuthentication, setUserInLocals } = require("./middlewares/auth");
const Event = require('./models/Event');
const Resource = require('./models/Resource');

const userRouter = require("./router/user");
const eventRouter = require("./router/event");
const resourceRouter = require("./router/resource");
const lostFoundRouter = require("./router/lostFound");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Express Setup =====
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(cookieParser());
app.use(checkForAuthentication);
app.use(setUserInLocals);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Routes (define but DON'T start server yet) =====
app.get("/", (req, res) => {
  res.render("index", { user: req.user }, (err, html) => {
    if (err) {
      console.error("❌ Render error:", err);
      return res.status(500).send("Error rendering page");
    }
    res.send(html);
  });
});

app.use("/user", userRouter);
app.use("/admin", eventRouter);
app.use("/resource", resourceRouter);
app.use("/lostFound", lostFoundRouter);

// Render pages
app.get("/index", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/forgetPassword", (req, res) => res.render("forgetPassword"));
app.get("/verifyOtp", (req, res) => res.render("verifyOtp"));
app.get("/resetPassword", (req, res) => res.render("resetPassword"));

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch {
    res.status(500).json({ error: "Cannot fetch events" });
  }
});

app.get("/events", (req, res) => {
  res.render("events", { user: res.locals.user });
});

app.get("/resources", (req, res) => {
  res.render("resources", { user: res.locals.user });
});

app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch {
    res.status(500).json({ error: 'Cannot fetch resources' });
  }
});

app.get("/lostFound", (req, res) => res.render("lostFound"));

// Nightly cleanup
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const result = await Event.deleteMany({ date: { $lt: now } });
    console.log(`🧹 Deleted ${result.deletedCount} expired events.`);
  } catch (err) {
    console.error("Error cleaning up expired events:", err);
  }
});

// ===== Start AFTER DB connects =====
(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Check your .env");
    }
    console.log("🔗 Connecting to:", process.env.MONGO_URI.split('@')[1] || process.env.MONGO_URI); // hides creds
    await connectToDB(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server is Running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
})();
