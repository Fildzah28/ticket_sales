/** load library express */
const express = require(`express`)

/** create object that instances of express */
const app = express()

/** define port of server */
const PORT = 8000

/** load library cors */
const cors = require(`cors`)

/** open CORS policy */
app.use(cors())

/** allow server to read JSON request body */
app.use(express.json())

/** define all routes */
const userRoute = require(`./routes/user.routes`)
const diskonRoute = require(`./routes/diskon.routes`)
const eventRoute = require(`./routes/event.routes`)
const seatRoute = require(`./routes/seat.routes`)
const ticketRoute = require(`./routes/ticket.routes`)
const auth = require(`./routes/auth.route`)

/** define prefix for each route */
app.use(`/user`, userRoute)
app.use(`/diskon`, diskonRoute)
app.use(`/event`, eventRoute)
app.use(`/seat`, seatRoute)
app.use(`/ticket`, ticketRoute)
app.use(`/auth`, auth)

/** route to access uploaded file */
app.use(express.static(__dirname))

/** run server based on defined port */
app.listen(PORT, () => {
    console.log(`Server of Ticket Sales runs on port ${PORT}`)
})