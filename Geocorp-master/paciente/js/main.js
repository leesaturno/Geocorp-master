var Geocorp = angular.module("Geocorp", []);
var actual = {};

Geocorp.controller('listado', function($scope, $http) {
  if (typeof(localStorage["paciente"]) != "undefined") {
    window.location.replace("paciente.html");
  }else {
    $http({
        method: 'GET',
        url: 'http://geocorp-jm.codeanyapp.com/patients/index.json'
    }).then(function successCallback(response) {
      $scope.patients = response.data.patients;

    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  $scope.login = function() {
    $.ajax({
      url: 'http://geocorp-jm.codeanyapp.com/users/view/'+$scope.password+'.json',
      type: 'GET',
      dataType: 'json',
      data: {
      },
    })
    .done(function(data) {
      console.log(data);
      if (data.user.email==$scope.email) {
        localStorage["user"] = JSON.stringify(data.user);
        setTimeout(function(argument) {
          window.location.replace("user.html");
        }, 500)
      }else {
        $scope.mensaje_error_user = "Usuario O Contraseña Invalido"
      }
    })
    .fail(function() {

    })
    .always(function() {

    });
  }
  $scope.buscar_paciente = function() {
    var result = $.grep($scope.patients, function(e){ return e.cedula == $scope.cedula; });
    if (result.length == 0) {
      $scope.mensaje_error_paciente = "El Paciente No Esta Reguistrado"
    } else if (result.length == 1) {
      localStorage["paciente"] = JSON.stringify(result[0]);
      setTimeout(function(argument) {
        window.location.replace("paciente.html");
      }, 500)
    }
  }
  
});