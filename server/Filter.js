"use strict"
const responses = require("../models/responses")

module.exports = {
    bodyIdRequired: _bodyIdRequired,
    bodyIdDisallowed: _bodyIdDisallowed,
    putIdsIdentical: _putIdsIdentical
}

function _bodyIdDisallowed(req, res, next) {
    if (!req.model._id) {
        next()
    } else {
        console.warn("The id can't be in the post payload.")
        res.status(400).send(new responses.ErrorResponse("The id can't be in the post payload."))
    }
}

function _bodyIdRequired(req, res, next) {
    if (!req.model._id) {
        console.warn("The id must be included in the payload.")
        res.status(400).send(new responses.ErrorResponse("The id must be included in the payload."))
    } else {
        next()
    }
}

function _putIdsIdentical(req, res, next) {
    if (req.model._id == req.params.id) {
        next()
    } else {
        console.warn("The id in the payload must match the URL id.")
        res.status(400).send(new responses.ErrorResponse("The id in the payload must match the URL id."))
    }
}
