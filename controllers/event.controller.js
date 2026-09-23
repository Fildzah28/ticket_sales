/** load model for `events` table */
const eventModel = require("../models/index").event

/** load model for `ticket` table */
const ticketModel = require("../models/index").ticket

/** load Operation from Sequelize */
const Op = require("sequelize").Op

/** load library */
const path = require("path")
const fs = require("fs")

/** load upload middleware */
const upload = require("./upload-image").single("image")

/** get all event */
exports.getAllEvent = async (request, response) => {
    let events = await eventModel.findAll()

    return response.json({
        success: true,
        data: events,
        message: "All Events have been loaded"
    })
}

/** find event */
exports.findEvent = async (request, response) => {
    let keyword = request.params.key

    let events = await eventModel.findAll({
        where: {
            [Op.or]: [
                { eventName: { [Op.substring]: keyword } },
                { eventDate: { [Op.substring]: keyword } },
                { venue: { [Op.substring]: keyword } },
                { price: { [Op.substring]: keyword } }
            ]
        }
    })

    return response.json({
        success: true,
        data: events,
        message: "All Events have been loaded"
    })
}

/** add event */
exports.addEvent = (request, response) => {
    upload(request, response, async error => {

        if (error) {
            return response.json({
                success: false,
                message: error.message
            })
        }

        if (!request.file) {
            return response.json({
                success: false,
                message: "Nothing to Upload"
            })
        }

        let newEvent = {
            eventName: request.body.eventName,
            eventDate: request.body.eventDate,
            venue: request.body.venue,
            price: request.body.price,
            image: request.file.filename
        }

        eventModel.create(newEvent)
            .then(result => {
                return response.json({
                    success: true,
                    data: result,
                    message: "New event has been inserted"
                })
            })
            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })
}

/** update event */
exports.updateEvent = (request, response) => {
    upload(request, response, async error => {

        if (error) {
            return response.json({
                success: false,
                message: error.message
            })
        }

        let eventID = request.params.id

        let dataEvent = {
            eventName: request.body.eventName,
            eventDate: request.body.eventDate,
            venue: request.body.venue,
            price: request.body.price
        }

        if (request.file) {
            const selectedEvent = await eventModel.findOne({
                where: { eventID: eventID }
            })

            if (selectedEvent) {
                const oldImage = selectedEvent.image
                const pathImage = path.join(__dirname, "../image", oldImage)

                if (fs.existsSync(pathImage)) {
                    fs.unlinkSync(pathImage)
                }

                dataEvent.image = request.file.filename
            }
        }

        eventModel.update(dataEvent, {
            where: { eventID: eventID }
        })
        .then(result => {
            return response.json({
                success: true,
                message: "Data event has been updated"
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    })
}

/** delete event */
exports.deleteEvent = async (request, response) => {
    let eventID = request.params.id

    const selectedEvent = await eventModel.findOne({
        where: { eventID: eventID }
    })

    if (!selectedEvent) {
        return response.json({
            success: false,
            message: "Event not found"
        })
    }

    const pathImage = path.join(__dirname, "../image", selectedEvent.image)

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }

    eventModel.destroy({
        where: { eventID: eventID }
    })
    .then(result => {
        return response.json({
            success: true,
            message: "Data event has been deleted"
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

/** create function to get most popular event */
exports.getPopularEvent = async (request, response) => {
    try {
        let events = await ticketModel.findAll({
            attributes: [
                'eventID',
                [
                    ticketModel.sequelize.fn(
                        'COUNT',
                        ticketModel.sequelize.col('ticketID')
                    ),
                    'totalTicket'
                ]
            ],
            group: ['eventID'],
            order: [
                [
                    ticketModel.sequelize.fn(
                        'COUNT',
                        ticketModel.sequelize.col('ticketID')
                    ),
                    'DESC'
                ]
            ]
        })

        return response.json({
            success: true,
            data: events,
            message: "Most popular events have been loaded"
        })

    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}