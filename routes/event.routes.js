/** load library express */
const express = require("express")

/** initiate object that instance of express */
const app = express()

/** allow to read request with json type */
app.use(express.json())

/** load event's controller */
const eventController = require("../controllers/event.controller")

/** create route to get data with method GET */
app.get("/", eventController.getAllEvent)

/** create route to get most popular event */
app.get("/popular", eventController.getPopularEvent)

/** create route to find event */
app.get("/find/:key", eventController.findEvent)

/** create route to add new event using method POST */
app.post("/", eventController.addEvent)

/** create route to update event using method PUT */
app.put("/:id", eventController.updateEvent)

/** create route to delete event using method DELETE */
app.delete("/:id", eventController.deleteEvent)

/** export app in order to load in another file */
module.exports = app