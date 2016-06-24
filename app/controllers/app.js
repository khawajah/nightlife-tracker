/* global angular, $ */
'use strict';

(function() {
  //Main module - nightlife-tracker
  var app = angular.module('nightlife-tracker', ['ngCookies']);
  
  //User Controller - returns current user, logs user out
  app.controller('UserController', ['$http', '$cookieStore', function($http, $cookieStore) {
    
    var user = this;
    
    user.current = null;
    
    $http.get('/api/getCurrentUser').then(function(result) {
      user.current = result.data;
      $cookieStore.put('currentUser', user.current);
    });
    
    user.logout = function() {
      $http.get('/logout');
    };

  }]);
  
  // Bars List (search results) controller
  app.controller('BarListController', ['$http', function($http) {

    var bars = this;
    
    bars.results = [];
    
    bars.searchLocation = null;
    
    $http.get("/api/getLastSearch").then(function(result){
       bars.searchLocation = result.data; 
       bars.search(bars.searchLocation);
    });
    
    bars.counts = function(list) {
      list.forEach(function(bar) {
        $http.get('/api/rsvp/' + bar.id + '/count').then(function(result) {
          bar.count = result.data;
          console.log("Count for " + bar.name + ": " + result.data);
        })
      })
    }
    bars.search = function(searchLocation) {
      var url = '/yelp?q=' + encodeURIComponent(searchLocation);
      $http.get(url).success(function(data) {
        bars.results = data;
        bars.counts(bars.results);
      });
    };
  
  }]);
  
  app.controller('RsvpController', ['$http', '$cookieStore', function($http, $cookieStore) {
    
    this.currentUser = $cookieStore.get('currentUser');
    
    this.add = function(bar) {
      $http.get('/api/rsvp/' + bar.id).then(function(result) {
        bar.count++;
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
        $('#search1go').click();
        return false;
    } else {
        return true;
    }
  });
  
    $("#search2").keypress(function (e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        $('#search2go').click();
        return false;
    } else {
        return true;
    }
  });
});


