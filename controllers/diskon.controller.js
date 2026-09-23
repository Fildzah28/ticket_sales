/** load model for `diskon` table */
const diskonModel = require(`../models/index`).diskon
const eventModel = require(`../models/index`).event

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op


/** create function for read all data */
exports.getAllDiskon = async (request, response) => {
    try {
        /** call findAll() to get all data */
        let diskon = await diskonModel.findAll({
            include: [
                {
                    model: eventModel,
                    as: "diskonEvent",
                    attributes: ["eventID", "eventName", "price"]
                }
            ]
        })

        return response.json({
            success: true,
            data: diskon,
            message: `All diskon have been loaded`
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}


/** create function for filter */
exports.findDiskon = async (request, response) => {
    try {
        /** define keyword to find data */
        let keyword = request.params.key

        /** call findAll() to find data based on keyword */
        let diskon = await diskonModel.findAll({
            where: {
                nama_diskon: {
                    [Op.substring]: keyword
                }
            },
            include: [
                {
                    model: eventModel,
                    as: "diskonEvent",
                    attributes: ["eventID", "eventName", "price"]
                }
            ]
        })

        return response.json({
            success: true,
            data: diskon,
            message: `All Diskon have been loaded`
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}


/** create function for add new diskon */
exports.addDiskon = (request, response) => {

    /** prepare data from request */
    let newdiskon = {
        eventID: request.body.eventID,
        nama_diskon: request.body.nama_diskon,
        nominal: request.body.nominal
    }

    /** execute inserting data to diskon table */
    diskonModel.create(newdiskon)
        .then(result => {

            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `New diskon has been inserted`
            })
        })
        .catch(error => {

            /** if insert's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}


/** create function for update diskon */
exports.updateDiskon = (request, response) => {

    /** prepare data that has been changed */
    let dataDiskon = {
        eventID: request.body.eventID,
        nama_diskon: request.body.nama_diskon,
        nominal: request.body.nominal
    }

    /** define id diskon that will be updated */
    let id = request.params.id

    /** execute update data based on defined id */
    diskonModel.update(dataDiskon, {
        where: {
            id: id
        }
    })
        .then(result => {

            /** if update's process success */
            return response.json({
                success: true,
                message: `Data diskon has been updated`
            })
        })
        .catch(error => {

            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}


/** create function for delete data */
exports.deleteDiskon = (request, response) => {

    /** define id diskon that will be deleted */
    let id = request.params.id

    /** execute delete data based on defined id */
    diskonModel.destroy({
        where: {
            id: id
        }
    })
        .then(result => {

            /** if delete's process success */
            return response.json({
                success: true,
                message: `Data diskon has been deleted`
            })
        })
        .catch(error => {

            /** if delete's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}