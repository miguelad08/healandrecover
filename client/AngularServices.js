;
(function() {
    "use strict"

    angular.module("client.services").factory("usersService", UsersService)

    UsersService.$inject = ["$http", "$q", "$state"]

    function UsersService($http, $q, $state) {
        return {
            read: _read,
            create: _create,
            update: _update,
            delete: _delete,
            readById: _readById,
            login: _login
        }

        function _login(thisData) {
            return $http.post('/api/entity/logUser', thisData)
        }

        function _read() {
            return $http
                .get("/api/entity")
                .then(itsSuccessfull)
                .catch(onError)
        }

        function _create(thisData) {
            return $http
                .post("/api/entity", thisData)
                .then(itsSuccessfull)
                .catch(onError)
        }

        function _update(id, thisData) {
            return $http
                .put(`/api/entity/${id}`, thisData)
                .then(itsSuccessfull)
                .catch(onError)
        }

        function _delete(id) {
            return $http
                .delete(`/api/entity/${id}`)
                .then(itsSuccessfull)
                .catch(onError)
        }
        function _readById(id) {
            return $http.get(`/api/entity/${id}`)
                .then(itsSuccessfull)
                .catch(onError)
        }

        function itsSuccessfull(response) {
            return $q.resolve(response.thisData)
        }

        function onError(xhr) {
            return $q.reject(xhr.thisData)
        }
    }
})();