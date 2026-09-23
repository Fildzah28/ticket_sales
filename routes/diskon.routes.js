/** load library express */

const express = require("express")

/** initiate object that instance of express */

const app = express()

/** allow to read request with json type */

app.use(express.json())

/** load diskon's controller */

const diskonController = require("../controllers/diskon.controller")

/** create route to get all diskon */

app.get("/", diskonController.getAllDiskon)

/** create route to find diskon */

app.get("/find/:key", diskonController.findDiskon)

/** create route to add new diskon using method POST */

app.post("/", diskonController.addDiskon)

/** create route to update diskon using method PUT */

app.put("/:id", diskonController.updateDiskon)

/** create route to delete diskon using method DELETE */

app.delete("/:id", diskonController.deleteDiskon)

/** export app in order to load in another file */

module.exports = app