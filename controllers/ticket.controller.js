/** load model */
const seatModel = require(`../models/index`).seat
const userModel = require(`../models/index`).user
const eventModel = require(`../models/index`).event
const ticketModel = require(`../models/index`).ticket
const diskonModel = require(`../models/index`).diskon

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op


/** =========================================================
 *  CREATE NEW TICKET
 *  ========================================================= */
exports.addTicket = async (request, response) => {

    /** prepare date for bookedDate */
    const today = new Date()

    const bookedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`

    /** prepare data from request */
    const { eventID, userID, seats } = request.body

    try {

        /** check seats */
        if (!seats || seats.length === 0) {
            return response.status(400).json({
                success: false,
                message: `Please choose at least one seat`
            })
        }

        /** find event */
        const event = await eventModel.findOne({
            where: {
                eventID: eventID
            }
        })

        /** check event */
        if (!event) {
            return response.status(404).json({
                success: false,
                message: `Event with ID ${eventID} not found`
            })
        }

        /** find diskon */
        const diskon = await diskonModel.findOne({
            where: {
                eventID: eventID
            }
        })

        /** calculate price */
        let price = event.price
        let diskonID = null

        if (diskon) {
            price = event.price - diskon.nominal
            diskonID = diskon.diskonID
        }

        /** create seat records */
        const seatIDs = await Promise.all(
            seats.map(async seat => {

                const { rowNum, seatNum } = seat

                const createdSeat = await seatModel.create({
                    eventID,
                    rowNum,
                    seatNum,
                    status: 'true'
                })

                return createdSeat.seatID
            })
        )

        /** create ticket records */
        const tickets = await ticketModel.bulkCreate(
            seatIDs.map(seatID => ({
                eventID,
                userID,
                seatID,
                price,
                diskonID,
                bookedDate
            }))
        )

        /** Calculate total payment */
const totalPayment = price * tickets.length

return response.status(201).json({
    success: true,
    data: tickets,
    totalPayment: totalPayment,
    message: "Ticket has been successfully added"
})
    } catch (error) {

        console.log(error)

        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}


/** =========================================================
 *  GET ALL TICKET
 *  ========================================================= */
exports.getAllTicket = async (request, response) => {

    try {

        /** prepare filter */
        let where = {}

        /**
         * If the logged in user has role "user",
         * only show their own tickets.
         *
         * If the role is "admin",
         * show all tickets.
         */
        if (request.user.role == "user") {
            where.userID = request.user.userID
        }

        /** find tickets */
        let tickets = await ticketModel.findAll({
            where: where,

            include: [
                {
                    model: eventModel,
                    attributes: [
                        'eventName',
                        'eventDate',
                        'venue',
                        'price'
                    ]
                },
                {
                    model: userModel,
                    attributes: [
                        'firstName',
                        'lastName',
                        'email'
                    ]
                },
                {
                    model: seatModel,
                    attributes: [
                        'rowNum',
                        'seatNum'
                    ]
                }
            ]
        })

        /** response */
        return response.json({
            success: true,
            data: tickets,
            message: `Tickets have been loaded`
        })

    } catch (error) {

        console.log(error)

        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}


/** =========================================================
 *  GET TICKET BY USER ID
 *  ========================================================= */
exports.ticketByUser = async (request, response) => {

    /** get userID from URL */
    const userID = request.params.userID

    try {

        /** find tickets based on userID */
        const tickets = await ticketModel.findAll({
            where: {
                userID: userID
            },

            include: [
                {
                    model: eventModel,
                    attributes: [
                        'eventName',
                        'eventDate',
                        'venue',
                        'price'
                    ]
                },
                {
                    model: userModel,
                    attributes: [
                        'firstName',
                        'lastName',
                        'email'
                    ]
                },
                {
                    model: seatModel,
                    attributes: [
                        'rowNum',
                        'seatNum'
                    ]
                }
            ]
        })

        /** response */
        return response.json({
            success: true,
            data: tickets,
            message: `All tickets from user ${userID} have been loaded`
        })

    } catch (error) {

        console.log(error)

        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}


/** =========================================================
 *  GET TICKET BY ID
 *  ========================================================= */
exports.ticketByID = async (request, response) => {

    /** get ticketID from URL */
    const ticketID = request.params.id

    try {

        /** find ticket */
        const tickets = await ticketModel.findAll({
            where: {
                ticketID: {
                    [Op.substring]: ticketID
                }
            },

            include: [
                {
                    model: eventModel,
                    attributes: [
                        'eventName',
                        'eventDate',
                        'venue',
                        'price'
                    ]
                },
                {
                    model: userModel,
                    attributes: [
                        'firstName',
                        'lastName',
                        'email'
                    ]
                },
                {
                    model: seatModel,
                    attributes: [
                        'rowNum',
                        'seatNum'
                    ]
                }
            ]
        })

        /** response */
        return response.json({
            success: true,
            data: tickets,
            message: `Ticket has been loaded`
        })

    } catch (error) {

        console.log(error)

        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

/** =========================================================
 *  DELETE TICKET
 *  ========================================================= */
exports.deleteTicket = async (request, response) => {

    /** get ticketID from URL */
    const ticketID = request.params.id

    try {

        /** find ticket */
        const ticket = await ticketModel.findOne({
            where: {
                ticketID: ticketID
            }
        })

        /** check ticket */
        if (!ticket) {
            return response.status(404).json({
                success: false,
                message: `Ticket with ID ${ticketID} not found`
            })
        }

        /** get seatID before deleting ticket */
        const seatID = ticket.seatID

        /** delete ticket */
        await ticketModel.destroy({
            where: {
                ticketID: ticketID
            }
        })

        /** delete seat */
        if (seatID) {
            await seatModel.destroy({
                where: {
                    seatID: seatID
                }
            })
        }

        /** response */
        return response.json({
            success: true,
            message: `Ticket with ID ${ticketID} has been deleted`
        })

    } catch (error) {

        console.log(error)

        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}


/** =========================================================
 *  UPDATE TICKET
 *  ========================================================= */
exports.updateTicket = async (request, response) => {

    /** get ticketID from URL */
    const ticketID = request.params.id

    try {

        /** find ticket */
        const ticket = await ticketModel.findOne({
            where: {
                ticketID: ticketID
            }
        })

        /** check ticket */
        if (!ticket) {
            return response.status(404).json({
                success: false,
                message: `Ticket with ID ${ticketID} not found`
            })
        }

        /** find event */
        const event = await eventModel.findOne({
            where: {
                eventID: ticket.eventID
            }
        })

        /** check event */
        if (!event) {
            return response.status(404).json({
                success: false,
                message: `Event with ID ${ticket.eventID} not found`
            })
        }

        /** find diskon */
        const diskon = await diskonModel.findOne({
            where: {
                eventID: ticket.eventID
            }
        })

        /** calculate price */
        let price = event.price
        let diskonID = null

        if (diskon) {
            price = event.price - diskon.nominal
            diskonID = diskon.diskonID
        }

        /** update ticket */
        await ticketModel.update(
            {
                price: price,
                diskonID: diskonID
            },
            {
                where: {
                    ticketID: ticketID
                }
            }
        ) 

        /** get updated ticket */
        const updatedTicket = await ticketModel.findOne({
            where: {
                ticketID: ticketID
            }
        })

        /** response */
        return response.json({
            success: true,
            data: updatedTicket,
            message: `Ticket with ID ${ticketID} has been updated`
        })

    } catch (error) {

        console.log(error)

        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}