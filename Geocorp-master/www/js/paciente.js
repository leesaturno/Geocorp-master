$(window).resize(function() {
  $("#mapa").css("width", $( window ).width()).css("height", $( window ).height()-$("nav").height());
});
$("#mapa").css("width", $( window ).width()).css("height", $( window ).height()-$("nav").height());

var Geocorp = angular.module("Geocorp", []);
var actual = {};

Geocorp.controller('listado', function($scope, $http) {
  if (typeof(localStorage["paciente"]) != "undefined") {
    $scope.paciente = JSON.parse(localStorage["paciente"]);
  }else {
    window.location.replace("/");
  }
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  var divMapa = document.getElementById('mapa');
  var gLatLon;
  var intlatitude;
  var intlongitude;
  var gMapa;
  var directionsDisplay = new google.maps.DirectionsRenderer();
  $scope.lista = [];

  function fn_mal () {
    console.log('fail')
  }

  function fn_ok ( rta ){
    intlatitude = rta.coords.latitude;
    intlongitude = rta.coords.longitude;
    gLatLon = new google.maps.LatLng( intlatitude, intlongitude);
  }
  navigator.geolocation.getCurrentPosition( fn_ok, fn_mal, options);
  $scope.llamar = function (x) {
    directionsDisplay.setDirections(x.response);
  }
  $scope.emergencia = function () {    
   $.ajax({
     url: 'http://geocorp-api-leopoldodibiro525723.codeanyapp.com:8000/emergencia/',
     type: 'GET',
     
     crossDomain: true,
      xhrFields: {
          withCredentials: true
      },
     data: {
      es_emergencia:true,
      id:$scope.paciente.id,
      latitud:intlatitude,
      longitud:intlongitude
      },
   })
   .done(function(data) {
    console.log(data)
   })
   .fail(function() {
     console.log("error");
   })
   .always(function() {
     console.log("complete");
   });
   
  }
  $scope.lout = function () {
    localStorage.removeItem("paciente");
    window.location.replace("/");
  }
});