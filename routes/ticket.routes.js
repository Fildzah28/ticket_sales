/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load ticket's controller */
const ticketController = require(`../controllers/ticket.controller`)

/** load authentication */
const { authorize } = require(`../controllers/auth.controller`)

/** create route to add new ticket using method "POST" */
app.post("/", ticketController.addTicket)

/** create route to get data with method "GET" */ 
app.get("/", authorize, ticketController.getAllTicket)

app.get("/user/:userID", ticketController.ticketByUser)

/** create route to get data by id with method "GET" */
app.get("/:id", ticketController.ticketByID)

/** create route to update ticket using method PUT */
app.put("/:id", ticketController.updateTicket)

/** create route to delete ticket using method DELETE */
app.delete("/:id", ticketController.deleteTicket)

/** export app in order to load in another file */
module.exports = app