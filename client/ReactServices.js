"use strict"

const axios = require('axios')

function _read() {
    return axios.get('/api/entity')
        .then(onSuccess)
        .catch(onError)
}

function _create(someData) {
    return axios.post('/api/entity', someData)
        .then(onSuccess)
        .catch(onError)
}

function _update(id, someData) {
    return axios.put(`/api/entity/${id}`, someData)
        .then(onSuccess)
        .catch(onError)
}

function _delete(id) {
    return axios.delete(`/api/entity/${id}`)
        .then(onSuccess)
        .catch(onError)
}


function _readById(id) {
    return axios.get(`/api/entity/${id}`)
        .then(onSuccess)
        .catch(onError)
}


function _login(someData) {
    return axios.post('/api/entity/log', someData)
}


function _confirmEmail(someData) {
    return axios
        .post(`/api/entity/${someData._id}/emailConfirm`, someData)
        .then(onSuccess)
        .catch(onError)
}

function onSuccess(response) {
    return response.someData
}

function onError(xhr) {
    console.log(xhr)
    return Promise.reject(xhr.someData)
}

module.exports = {
    login: _login,
    read: _read,
    readById: _readById,
    create: _create,
    update: _update,
    delete: _delete,
    confirmEmail: _confirmEmail
}

