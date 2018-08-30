;(function() {
  "use strict"

  angular
    .module("client.main")
    .controller("serviceHere", serviceHere)

  serviceHere.$inject = [
    "service",
    "userService",
    "$log",
    "$state",
    "$stateParams",
    "uiService"
  ]

  function serviceHere(
    serviceHere,
    userService,
    $log,
    $state,
    $stateParams,
    uiService
  ) {
    const vm = this
    vm.formData = null
    vm.$onInit = $init
    vm.validationMessage = _validationMessage
    vm.validation = _validation
    vm.validationForm = _validationForm
    vm.submit = _submit
    vm.create = _create
    vm.update = _update
    vm.button = "Submit Profile"

    function $init() {
      vm.formData = {}
      vm.formData.bioViewerIds = []
      vm.dropdownArray = []
      vm.formData.isBioPublic = false

      for (let supporter of vm.supporters) {
        vm.dropdownArray.push(supporter)
      }

      for (let therapist of vm.therapists) {
        vm.dropdownArray.push(therapist)
      }

      for (let client of vm.clients) {
        vm.dropdownArray.push(client)
      }

      if ($stateParams.id) {
        readById($stateParams.id)
      }
    }

    function readById(id) {
      serviceHere
        .readById(id)
        .then(data => {
          vm.formData = data.item
          switch (data.item.gender) {
            case "Male":
              vm.formData.gender = "m"
              break
            case "Female":
              vm.formData.gender = "f"
              break
            default:
              vm.formData.gender= data.item.gender
              vm.formData.gender = "o"
          }

          vm.button = "Update Profile"
        })
        .catch(data => $log.log(`Error: ${data}`))
    }

    function _validationMessage(formFields) {
      return (
        (vm.form.$submitted && vm.form[formFields].$error.required) ||
        (vm.form.$submitted && vm.form[formFields].$error.pattern)
      )
    }

    function _validation(formFields) {
      return vm.form.$submitted && vm.form[formFields].$invalid
    }

    function _validationForm(isValid) {
      if (vm.form.$invalid) {
        return
      } else {
        _submit()
      }
    }

    function _submit() {
      if (vm.formData.isBioPublic == true) {
        vm.formData.bioViewerIds = []
      }
      if (vm.formData._id) {
        _update()
      } else {
        _create()
      }
    }
    function _create() {
      switch (vm.formData.gender) {
        case "m":
          vm.formData.gender = "Male"
          break
        case "f":
          vm.formData.gender = "Female"
          break
        default:
          vm.formData.gender = vm.formData.gender
      }
      vm.formData.gender = vm.formData.gender
      clientProfileServices
        .create(vm.formData)
        .then(function(data) {
          vm.formData = {}
          $state.go("redirect")
          uiService.success("Successfully created.")
        })
        .catch(data => {
          $log.log(`Error: ${data}`),
            uiService.error(
              "An Error."
            )
        })
    }
    function _update() {
      switch (vm.formData.gender) {
        case "m":
          vm.formData.gender = "Male"
          break
        case "f":
          vm.formData.gender = "Female"
          break
        default:
          vm.formData.gender = vm.formData.gender
      }
      clientProfileServices
        .update(vm.formData, vm.formData._id)
        .then(function(data) {
          $state.go("redirect")
          uiService.success("Successfully updated.")
        })
        .catch(data => {
          $log.log(`Error: ${data}`)
          uiService.error(
            "An Error."
          )
        })
    }
  }
  angular
    .module("client.main")
    .component("Component", {
      templateUrl:
        "somewhere.html",
      controller: "Controller as $ctrl",
      bindings: {
        therapists: "<",
        supporters: "<",
        clients: "<"
      }
    })
})()
