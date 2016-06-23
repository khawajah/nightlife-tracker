/* global angular, $ */
'use strict';

(function() {
  var app = angular.module('nightlife-tracker', []);
  
  app.controller('BarListController', ['$http', function($http) {

    var bars = this;
    
    bars.results = [];
    
    bars.search = function(searchLocation) {
      var url = '/yelp?q=' + encodeURIComponent(searchLocation);
      $http.get(url).success(function(data) {
        console.log(data);
        bars.results = data;
      });
    };
    
  }]);

})();

$(document).ready(function() {
  $("#search1go").click(function() {
    $('html, body').animate({
        scrollTop: $("#searchresults").offset().top
    }, 1000);
  });
  
  $("#search1").keypress(function (e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        console.log(e);
        $('#search1go').click();
        return false;
    } else {
        return true;
    }
  });
});


