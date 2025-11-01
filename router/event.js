const express = require("express");
const router = express.Router();
const { handleCreateEvent, } = require("../controller/event");


// POST /events/createEvent
router.post("/createEvent", handleCreateEvent);

module.exports = router;
