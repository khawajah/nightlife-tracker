'use strict';
/* global $ */

(function() {
  
  $.get('/api/cities/top', function(result) {
    var array = [];
    for (var key in result) {
      if (result.hasOwnProperty(key)) {
        var tally = result[key];
        var pair = [key, tally];
      }
      array.push(pair);
    };
    var topCities = array.sort(function(a, b) {
      return b[1] - a[1];
    });
    if (topCities.length < 10) {
      var j = topCities.length;
    } else {
      var  j = 10;
    }
    for (var i = 0; i < j; i++) {
      $('ol#topSearches').append('<li>' + topCities[i][0] + ' - ' + topCities[i][1] + ' hits</li>');
    };
  });
    
  $.get('/api/cities/recent', function(result) {
    result.forEach(function(city) {
      $('ol#recentSearches').append('<li>' + city.city + '</li>')    
    });
  });
  
  $.get('/api/cities/count/total', function(result) {
    $('#allTimeSearches').append(result.count);
  })
  
  $.get('/api/cities/count/week', function(result) {
    $('#weeklySearches').append(result.count);
  })
  
})();