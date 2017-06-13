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
    var objConfig = {
        zoom: 20,
        center: gLatLon
    } 
    gMapa = new google.maps.Map( divMapa, objConfig );
    directionsDisplay.setMap(gMapa);
    $http({
      method: 'GET',
      url: 'http://geocorp:8888/api/customers', 
       dataType: 'json',
    }).then(function successCallback(response) {
      var separador = 1;
      var hospitales = response.data.hospitales;
      $.each(hospitales, function(index, val) {
        separador++
        setTimeout(
          function() {
            var request = {
              origin: {lat: parseFloat(intlatitude), lng: parseFloat(intlongitude)},
              destination: {lat: parseFloat(val.latitud), lng: parseFloat(val.longitud)},
              travelMode: google.maps.TravelMode.DRIVING
            };
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                $scope.lista.push({
                  center: val,
                  response: response,
                  mapa: directionsService,
                  distancia: response.routes[0].legs[0].distance.value,
                  distancia_text: response.routes[0].legs[0].distance.text,
                });
                if (hospitales.length==$scope.lista.length) {
                  console.log(hospitales.length, $scope.lista)
                  $scope.lista.sort(function(a, b) {
                      return parseFloat(a.distancia) - parseFloat(b.distancia);
                  });
                // Display the route on the map.
                  directionsDisplay.setDirections($scope.lista[0].response);
                }
                $scope.$apply();
              }
            });
          }, 
          1000*separador
        )
      });
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  navigator.geolocation.getCurrentPosition( fn_ok, fn_mal, options);
  $scope.llamar = function (x) {
    directionsDisplay.setDirections(x.response);
  }
  $scope.emergencia = function () {    
   $.ajax({
     url: 'http://localhost:8888/Geop/geolocations/add',
     type: 'POST',    
    
     data: {
      status:"emergencia",
      lalitud:intlatitude,
      longitud:intlongitude,
      patients:$scope.paciente.id,
      },  
       dataType: 'html',
   })
   .done(function(data) {
    console.log(data)
      $('#msg').html('<div class="alert alert-success flash-msg">Platillo agregado al pedido.</div>');
$('.flash-msg').delay(2000).fadeOut('slow');
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