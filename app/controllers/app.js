/* global angular, $ */
'use strict';

(function() {
  
  //Main module - nightlife-tracker
  var app = angular.module('nightlife-tracker', ['ngCookies']);
  
  
  //User Controller - returns current user, logs user out
  app.controller('UserController', ['$http', 'userLocations', 'userService', function($http, userLocations, userService) {
    
    var user = this;
    user.current = null;
    user.location = [];

    activate();
    
    function activate() {
      return getCurrentUser()
    }
    
    function getCurrentUser() {
      return userService.getCurrentUser().then(function(result) {
        user.current = result;
        return user.current;
      });
    }
    
    user.logout = function() {
      $http.get('/logout');
    };

  }]);
  
  
  // Bars List (search results) controller
  app.controller('BarListController', ['$http', '$scope', '$window', 'userLocations', 'userService', function($http, $scope, $window, userLocations, userService) {

    var bars = this;
    bars.currentUser = null;
    bars.results = [];
    bars.activeRsvps = [];
    bars.searchLocation = null;

    activate();

    function activate() {
      getLastSearch();
      getActiveRsvps();
    }
    
     $scope.$on('USER: login', function(msg, user) {
      $scope.user = user;
      bars.currentUser = user;
    })
    
    function getLastSearch() {
      return  $http.get("/api/getLastSearch").then(function(result){
        bars.searchLocation = result.data; 
        bars.search(bars.searchLocation);
      });
    }
    
   function getActiveRsvps() {
    return userLocations.getUserActivity()
      .then(function(data) {
        bars.activeRsvps = data;
        return bars.activeRsvps;
      });
    }
    
    bars.counts = function(list) {
      list.forEach(function(bar) {
        $http.get('/api/rsvp/' + bar.id + '/count').then(function(result) {
          bar.count = result.data;
        });
      });
    };
    
    bars.search = function(searchLocation) {
      var url = '/yelp?q=' + encodeURIComponent(searchLocation);
      $http.get(url).success(function(data) {
        bars.results = data;
        bars.counts(bars.results);
      });
    };

    bars.toggleRsvp = function(bar) {
      if (bars.activeRsvps.indexOf(bar.name) === -1) {
        bars.add(bar);
      } else {
        bars.remove(bar);
      }
    }
    
    bars.add = function(bar) {
      if (bars.currentUser) {
        return userLocations.addLocation(bar).then(function(result) {
          bar.count++;
          bars.activeRsvps.push(result.business);
        });
      } else {
        $window.alert('Please log in below before RSVPing');
      } 
    };
    
    bars.remove = function(item) {
      return userLocations.removeCurrentRsvp(item)
        .then(function(data) {
          var index = bars.activeRsvps.indexOf(item);
          bars.activeRsvps.splice(index, 1); 
        });
    };
    
  }]);
  
  
  // rsvpHistoryController takes care of RSVP related tasks
  app.controller('rsvpHistoryController', ['userLocations', '$scope', function(userLocations, $scope) {
    
    var rsvp = this;
    
    rsvp.barHistory = null;
    rsvp.currentUser = null;

    activate();
    
    function activate() {
      return getUserHistory()  
    }
    
    $scope.$on('USER: login', function(msg, user) {
      $scope.user = user;
      rsvp.currentUser = user;
    })
    
    function getUserHistory() {
      return userLocations.getUserHistory()
        .then(function(data) {
          rsvp.barHistory = data;
          return rsvp.barHistory;
        });
    }
    
    rsvp.remove = function(item) {
      return userLocations.removeLocation(item)
        .then(function(data) {
          var index = rsvp.barHistory.indexOf(item);
          rsvp.barHistory.splice(index, 1); 
        });
    };
    
  }]);
  
  
  // User Factory
  app.factory('userService', userService);
  
  userService.$inject = ['$http', '$rootScope'];
  
  function userService($http, $rootScope) {
    return {
      getCurrentUser: getCurrentUser
    };
    
    function getCurrentUser() {
      return $http.get('/api/getCurrentUser').then(returnResults);
      
      function returnResults(response) {
        $rootScope.$broadcast('USER: login', response.data);
        return response.data;
      }
    }
  }
   
   
  //User Location Factory
  app.factory('userLocations', userLocations);
  
  userLocations.$inject = ['$http', '$rootScope'];

  function userLocations($http, $rootScope) {
    return {
      getUserHistory: getUserHistory,
      getUserActivity: getUserActivity,
      addLocation: addLocation,
      removeLocation: removeLocation,
      removeCurrentRsvp: removeCurrentRsvp
    };
    
    function getUserHistory() {
      return  $http.get('/api/userrsvphistory').then(returnResult);
  
      function returnResult(response) {
        return response.data;
      }
    }
    
    function getUserActivity() {
      return  $http.get('/api/userrsvpactivity').then(returnResult);
  
      function returnResult(response) {
        var raw = response.data;
        var clean = raw.map(function (item, index) {
          return item. business;
        });
        return clean;
      }
    }
    
    function addLocation(bar) {
      var data = {    
        business: bar.name,
        businessId: bar.id,
        businessUrl: bar.url
      };
      
      return $http.post('/api/rsvp/', data).then(returnResult);
      
      function returnResult(response) {
        return response.data;
      }
    }
    
    function removeLocation(bar) {
      return $http.get('/api/rsvp/delete?id=' + bar.businessId + '&date=' + bar.createdAt).then(returnResult);
      
      function returnResult(response) {
        return response.data;
      }
    }
    
    function removeCurrentRsvp(bar) {
      if (bar.business) {
        return $http.get('/api/currentrsvp/delete?b=' + bar.business).then(returnResult);
      } else {
        return $http.get('/api/currentrsvp/delete?b=' + bar).then(returnResult);
      }  
      function returnResult(response) {
        return response.data;
      }
    }
  }

  
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


