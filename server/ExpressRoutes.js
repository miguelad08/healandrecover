"use strict"
const router = require("express").Router()
const anonControllerFactory = require("../controllers/anon.controller")

// Middleware validation
const validateBody = require("../filters/validate.body")
const validateId = require("../filters/id.filter")
const joiValidation = require("../models/joiValidation")
const joiLogin = require("../models/joiLogin/login")
const email = require("../models/email.confirm")

module.exports = function(apiPrefix) {
  const anonControllerFactory = anonControllerFactory(apiPrefix)

  router.get("/", anonControllerFactory.read)
  router.get("/:id([0-9a-zA-Z]{24})", anonControllerFactory.readById)
  router.post(
    "/",
    validateBody(user),
    validateId.bodyIdDisallowed,
    anonControllerFactory.create
  )
  router.post(
    "/loginTheUser",
    validateBody(joiLogin),
    validateId.bodyIdDisallowed,
    anonControllerFactory.login
  )
  router.post(
    "/:id([0-9a-fA-F]{24})/emailConfirmedByUser",
    validateBody(email),
    anonControllerFactory.confirmTheEmail
  )
  router.put(
    "/:id([0-9a-zA-Z]{24})",
    validateBody(joiValidation),
    validateId.bodyIdRequired,
    validateId.putIdsIdentical,
    anonControllerFactory.update
  )
  router.delete("/:id([0-9a-zA-Z]{24})", anonControllerFactory.deactivate)

  return router
}
