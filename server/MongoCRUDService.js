"use strict"

const mongodb = require("../mongodb")
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId

module.exports = {
  login: _login,
  read: _read,
  create: _create,
  update: _update,
  deactivate: _deactivate,
  readById: _readById
}

function _login(name, password) {
  return conn
    .db()
    .collection("collection")
    .findOne({ name: name, password: password, dateDeactivated: null })
    .then(login => {
      login._id = login._id.toString()
      return login
    })
    .catch(err => {
      console.warn(err)
      return Promise.reject(err)
    })
}

function _read() {
  return conn
    .db()
    .collection("collection")
    .find({ dateDeactivated: null })
    .toArray()
    .then(clients => {
      for (let j = 0; j < clients.length; j++) {
        const client = clients[j]
        client._id = client._id.toString()
        for (let i = 0; i < client.supporterIds.length; i++) {
          const supporters = client.supporterIds
          supporters[i] = supporters[i].toString()
        }
      }
      return clients
    })
    .catch(err => {
      console.warn(err)
      return Promise.reject(err)
    })
}

function _readById(id) {
  return conn
    .db()
    .collection("collection")
    .findOne({ _id: new ObjectId(id), dateDeactivated: null })
    .then(client => {
      client._id = client._id.toString()
      for (let i = 0; i < client.supporterIds.length; i++) {
        const support = client.supporterIds
        support[i] = support[i].toString()
      }
      return client
    })
    .catch(err => {
      console.warn(err)
      return Promise.reject(err)
    })
}

function _create(data) {
  const doc = {
    name: data.name,
    email: data.email,
    password: data.password,
    dateCreated: new Date(),
    dateModified: new Date(),
    dateDeactivated: null
  }

  // If the type is either Strong or Fast and there is information in the input field, add the new information
  if ((data.type == "Strong" || data.type == "Fast") && data.information) {
    for (let i = 0; i < data.information.length; i++) {
      doc.$set.information.push(new ObjectId(data.information[i]))
    }
  } else {
    data.information = []
  }

  // Checking to see if email has been confirmed
  if (typeof data.confirmedEmail === "boolean") {
    doc.$set.confirmedEmail = data.confirmedEmail
  }

  return conn
    .db()
    .collection("collection")
    .insertOne(doc)
    .then(response => response.insertedId.toString())
    .catch(err => {
      if (err.code == 11000) {
        err.unique = false
      }
      console.warn(err)
      return Promise.reject(err)
    })
}

function _update(id, data) {
  const doc = {
    $set: {
      name: data.name,
      email: data.email,
      information: [],
      password: data.password,
      dateModified: new Date(),
      _id: new ObjectId(data._id)
    }
  }

  // If the type is either Strong or Fast and there is information in the input field, add the new information
  if ((data.type == "Strong" || data.type == "Fast") && data.information) {
    for (let i = 0; i < data.information.length; i++) {
      doc.$set.information.push(new ObjectId(data.information[i]))
    }
  } else {
    data.information = []
  }

  // Checking to see if email has been confirmed
  if (typeof data.confirmedEmail === "boolean") {
    doc.$set.confirmedEmail = data.confirmedEmail
  }

  return conn
    .db()
    .collection("collection")
    .updateOne({ _id: new ObjectId(id) }, doc)
    .then(response => {
      return response.matchedCount
    })
    .catch(err => {
      console.warn(err)
      return Promise.reject(err)
    })
}

// Adds date deactivated property to database document
function _deactivate(id) {
  const doc = {
    $set: {
      dateModified: new Date(),
      dateDeactivated: new Date()
    }
  }
  return conn
    .db()
    .collection("collection")
    .updateOne({ _id: new ObjectId(id) }, doc)
    .then(response => {
      return response.matchedCount
    })
    .catch(err => {
      console.warn(err)
      return Promise.reject(err)
    })
}
