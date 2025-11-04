const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectToDB = require("./connect");

const { checkForAuthentication, setUserInLocals } = require("./middlewares/auth");

const Event = require('./models/Event');
const Resource = require('./models/Resource');

const userRouter = require("./router/user");
const eventRouter = require("./router/event");
const resourceRouter = require("./router/resource");
const lostFoundRouter = require("./router/lostFound");

const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT;

// ================== Express Setup ==================

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(cookieParser());

app.use(checkForAuthentication);
app.use(setUserInLocals);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================== Routes ==================

app.get("/", (req, res) => {
  res.render("index", { user: req.user }, (err, html) => {
    if (err) {
      console.error("❌ Render error:", err);
      return res.status(500).send("Error rendering page");
    }
    res.send(html);
  });
});

// Connect to MongoDB
connectToDB(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));


app.use("/user", userRouter);
app.use("/admin", eventRouter);
app.use("/resource", resourceRouter);
app.use("/lostFound", lostFoundRouter);

//Render pages
app.get("/index", (req, res) => { res.render("index"); });
app.get("/login", (req, res) => { res.render("login"); });
app.get("/register", (req, res) => { res.render("register"); });
app.get("/forgetPassword", (req, res) => { res.render("forgetPassword"); });
app.get("/verifyOtp", (req, res) => { res.render("verifyOtp"); });
app.get("/resetPassword", (req, res) => { res.render("resetPassword"); });
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch events" });
  }
});
app.get("/events", (req, res) => {
  // Only pass user info for admin button
  res.render("events", { user: res.locals.user });
});


app.get("/resources", (req, res) => {
  res.render("resources", { user: res.locals.user });
});
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: 'Cannot fetch resources' });
  }
});

app.get("/lostFound", (req, res) => { res.render("lostFound"); });



// Run every night at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const result = await Event.deleteMany({ date: { $lt: now } });
    console.log(`🧹 Deleted ${result.deletedCount} expired events.`);
  } catch (err) {
    console.error("Error cleaning up expired events:", err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});