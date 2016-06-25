/* global angular, $ */
'use strict';

(function() {
  //Main module - nightlife-tracker
  var app = angular.module('nightlife-tracker', ['ngCookies']);
  
  //User Controller - returns current user, logs user out
  app.controller('UserController', ['$http', '$cookieStore', 'userLocations', 'userService', function($http, $cookieStore, userLocations, userService) {
    
    var user = this;
    user.current = null;
    user.location = [];
    $cookieStore.remove('currentUser');
    
    activate();
    
    function activate() {
      return getCurrentUser().then(function(data) {
        console.log("Current user is: " + data);
      });
    }
    
    function getCurrentUser() {
      return userService.getCurrentUser().then(function(result) {
        user.current = result;
        return user.current;
      });
    }
    user.deleteCookie = function() {
      $cookieStore.remove('currentUser');
    };
    
    user.logout = function() {
      $cookieStore.remove('currentUser');
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
      activateRsvps();
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
    
    function activateRsvps() {
      return getActiveRsvps().then(function(result) {
        console.log('Active RSVPs available');
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
    
    bars.add = function(bar) {
      if (bars.currentUser) {
        return userLocations.addLocation(bar).then(function(result) {
          bar.count++;
          bars.activeRsvps.push(result);
        });
      } else {
        $window.alert('Please log in below before RSVPing');
      }
    };
  }]);
  
  // rsvpHistoryController takes care of RSVP related tasks
  app.controller('rsvpHistoryController', ['userLocations', '$scope', '$cookieStore', '$window', function(userLocations, $scope, $cookieStore, $window) {
    
    var rsvp = this;
    
    rsvp.barHistory = null;
    rsvp.currentUser = null;

    activate();
    
    function activate() {
      return getUserHistory().then(function() {
        console.log('Activated locations view');
      });  
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
    
    $scope.remove = function(item) {
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
  
  userLocations.$inject = ['$http'];

  function userLocations($http) {
    return {
      getUserHistory: getUserHistory,
      getUserActivity: getUserActivity,
      addLocation: addLocation,
      removeLocation: removeLocation
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
        return response.data;
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


