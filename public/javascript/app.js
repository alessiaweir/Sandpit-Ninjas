var app = angular.module('ngApp', ['ui.bootstrap']);

app.factory('dataFactory', ['$http', '$q', function($http, $q) {
  var dataFactory = {};

  dataFactory.getData = function() {

    var deferred = $q.defer();

    $http({ method: 'GET', url: 'get_locs'}).
    success(function(data, status, headers, config) {
      deferred.resolve(data)
    }).
    error(function(data, status, headers, config) {
      deferred.reject("FAIL")
    });

    return deferred.promise;
  }

  dataFactory.postData = function(user) {

    var deferred = $q.defer();

    // user.loc.replace(/\s+/g, '-').toLowerCase() + "_" + user.age.replace(/\s+/g, '-').toLowerCase() + "_" + user.gen + ".json";

    console.log(user)

    $http.get(user.loc.replace(/\s+/g, '-').toLowerCase() + "_" + user.age.replace(/\s+/g, '-').toLowerCase() + "_" + user.gen + ".json").
    success(function(data, status, headers, config) {
      deferred.resolve(data)
    }).
    error(function(data, status, headers, config) {
      deferred.reject("FAIL")
    });

    return deferred.promise;
  }

  return dataFactory;

 }]);

app.controller('myCtrl', ['$scope', 'dataFactory', function($scope, dataFactory) {

  $scope.user = {}
  $scope.user.age
  $scope.user.loc 
  $scope.user.gen = "Male"
  $scope.cool = 0
  $scope.showg = false
  $scope.loader = false
  $scope.gender = ["Male", "Female"]
  $scope.locs = ["Auckland District", "Wellington District", "Canterbury District", "Tasman District", "Northland District", "Waikato District", "Eastern District", "Bay Of Plenty District", "Counties/Manukau District", "Central District", "Waitemata District", "Southern District"]
  $scope.age = ["0 to 9", "10 to 13", "14 to 16", "17 to 20", "21 to 30", "31 to 50", "51 or Older"]

  // dataFactory.getData().then(function(data) {
    


  $scope.Submit = function(){
      $scope.showg = false
      $scope.loader = true


    dataFactory.postData($scope.user).then(function(data) {
      $scope.showg = true
      $scope.loader = false
      $scope.crime = data;
      // $scope.crime = {"crimes":[{"id":2,"offence":"Intention to Injur","long_name":"Acts intended to cause injury","total":146},{"id":1,"offence":"Abduction and Harassment","long_name":"Abduction, harassment and other related offences against a person","total":53},{"id":6,"offence":"Illicit Drugs","long_name":"Illicit drug offences","total":39},{"id":4,"offence":"Fraud","long_name":"Fraud, deception and related offences","total":17},{"id":3,"offence":"Dangerous Acts","long_name":"Dangerous or negligent acts endangering persons","total":3},{"id":5,"offence":"Homicide","long_name":"Homicide and related offences","total":0}],"gender":{"offence":"Homicide","offence_long_name":"Homicide and related offences","male":290,"female":49},"time_crime":{"offence":"Dangerous Acts","data":[{"year":"2012","total":779},{"year":"2014","total":547},{"year":"2013","total":589}]}}
      console.log(data)
    }, function(reason) {
      console.log('Failed: ' + reason);
      // $scope.crime ={"crimes":[{"id":2,"offence":"Intention to Injur","long_name":"Acts intended to cause injury","total":146},{"id":1,"offence":"Abduction and Harassment","long_name":"Abduction, harassment and other related offences against a person","total":53},{"id":6,"offence":"Illicit Drugs","long_name":"Illicit drug offences","total":39},{"id":4,"offence":"Fraud","long_name":"Fraud, deception and related offences","total":17},{"id":3,"offence":"Dangerous Acts","long_name":"Dangerous or negligent acts endangering persons","total":3},{"id":5,"offence":"Homicide","long_name":"Homicide and related offences","total":0}],"gender":{"offence":"Homicide","offence_long_name":"Homicide and related offences","male":290,"female":49},"time_crime":{"offence":"Dangerous Acts","data":[{"year":"2012","total":779},{"year":"2014","total":547},{"year":"2013","total":589}]}}
    });
  }

}]);

