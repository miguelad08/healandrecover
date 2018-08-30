"use strict"

const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const schema = {
    _id: Joi.objectId(),
    name: Joi.string().regex(/^[a-zA-Z]{1,16}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{6,24}$/).required(),
    type: Joi.string().valid("Fast", "Strong").required(),
}

module.exports = Joi.object().keys(schema)
