/* global angular, $ */
'use strict';

(function() {
  //Main module - nightlife-tracker
  var app = angular.module('nightlife-tracker', ['ngCookies']);
  
  //User Controller - returns current user, logs user out
  app.controller('UserController', ['$http', '$cookieStore', function($http, $cookieStore) {
    
    var user = this;
    
    this.initialize = function() {
      user.current = null;
      $cookieStore.remove('currentUser');
      user.locations = [];
    }
    
    this.initialize();
    
    $http.get('/api/getCurrentUser').then(function(result) {
      if (result.data) {
        user.current = result.data;
        $cookieStore.put('currentUser', user.current);
      }
    });

    $http.get('/api/userrsvps').then(function(result) {
      user.locations = result.data;
    });
    
    user.removeRsvp = function(item) {
      $http.get('/api/rsvp/delete?id=' + item.businessId + '&date=' + item.createdAt).then(function(result) {
        var index = user.locations.indexOf(item);
        user.locations.splice(index, 1);
      })
    }
    
    user.deleteCookie = function() {
      $cookieStore.remove('currentUser');
    }
    
    user.logout = function() {
      $cookieStore.remove('currentUser');
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
        })
      })
    }
    
    bars.search = function(searchLocation) {
      var url = '/yelp?q=' + encodeURIComponent(searchLocation);
      $http.get(url).success(function(data) {
        bars.results = data;
        bars.counts(bars.results);
      });
    }
  
  }]);
  
  // RSVP Controller - allows user to RSVP if logged in
  app.controller('RsvpController', ['$http', '$cookieStore', '$window', function($http, $cookieStore, $window) {
    
    this.currentUser = $cookieStore.get('currentUser');
    
    this.add = function(bar) {
      if (this.currentUser) {
        var data = {
          business: bar.name,
          businessId: bar.id,
          businessUrl: bar.url
        };
        $http.post('/api/rsvp/', data).then(function(data, status) {
          bar.count++;
        });
      } else {
        $window.alert('Please log in below before RSVPing')
      }
    }
    
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


