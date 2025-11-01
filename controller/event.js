const Event = require("../models/Event");


// Create a new event
async function handleCreateEvent(req, res) {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.redirect("/events"); // Or wherever your events page is
  } catch (err) {
    res.status(400).send("Error creating event");
  }
}

module.exports = {
  handleCreateEvent,
};
