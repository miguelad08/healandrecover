"use strict"

const responses = require("../models/responses")
const anonService = require("../services/anon.service")
const email = require("../services/email.service")

let _apiPrefix

module.exports = apiPrefix => {
  _apiPrefix = apiPrefix
  return {
    read: _read,
    create: _create,
    update: _update,
    deactivate: _deactivate,
    readById: _readById,
    login: _login
  }
}

function _read(req, res) {
  anonService
    .read()
    .then(anon => {
      const responseModel = new responses.ItemsResponse()
      responseModel.items = anon
      res.json(responseModel)
    })
    .catch(xhr => {
      console.log(xhr)
      res.status(500).send(new responses.ErrorResponse(xhr))
    })
}

function _readById(req, res) {
  anonService
    .readById(req.params.id)
    .then(anon => {
      const responseModel = new responses.ItemResponse()
      responseModel.item = anon
      res.json(responseModel)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(new responses.ErrorResponse(err))
    })
}

function _create(req, res) {
  let id
  anonService
    .create(req.model)
    .then(data => {
      if (req.model.type === "Strong") {
        id = data
        const name = `${req.model.name}`
        email.alertEmail(name, id)
      }
      const toName = `${req.model.name}`
      return email.registrationEmail(req.model.email, id, toName)
    })
    .then(id => {
      id = id
      const responseModel = new responses.ItemResponse()
      responseModel.item = id
      return res
        .status(201)
        .location(`${_apiPrefix}/${id}`)
        .json(responseModel)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(new responses.ErrorResponse(err))
    })
}

function _update(req, res) {
  anonService
    .update(req.params.id, req.model)
    .then(response => {
      const responseModel = new responses.ItemResponse()
      res.status(200).json(responseModel)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(new responses.ErrorResponse(err))
    })
}

function _deactivate(req, res) {
  anonService
    .deactivate(req.params.id)
    .then(response => {
      const responseModel = new responses.ItemResponse()
      res.status(200).json(responseModel)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(new responses.ErrorResponse(err))
    })
}

// If document is found and email is confirmed, set anon cookie
function _login(req, res) {
  anonService
    .login(req.model.name, req.model.password)
    .then(anon => {
      // Check if a anon exists and email is confirmed(true)
      if (anon && anon.emailIsConfimred) {
        // Setting a cookie named 'authorizeHere' which expires after a year
        res.cookie(
          "authorizeHere",
          { id: anon._id, type: anon.type },
          // Set login expiration
          { maxAge: 365 * 24 * 60 * 60 * 1000 }
        )
        res.status(200).send(new responses.SuccessResponse("Login successful"))
      } else {
        // NOTE: Keeping error message broad so client won't know if anon exist in database or not
        res.status(400).send("Login attempt failed")
        return
      }
    })
    .catch(error => {
      console.warn(error)
      res.status(500).send(new responses.ErrorResponse(error))
    })
}
