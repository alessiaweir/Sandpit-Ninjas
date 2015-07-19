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

    console.log(user)

    $http.post('post_user_info', user).
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

  dataFactory.getData().then(function(data) {
    
    $scope.locs = data.locations
    $scope.age = data.age.sort()
  }, function(reason) {
    console.log('Failed: ' + reason);
  });

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

app.directive('chartDataTopSix',
   function () {
       return {
           restrict: 'E',
           scope: {
            ngModel: '='
          },
           // replace:true,
           templateUrl: 'templates/top-six-chart.html',
           require: 'ngModel',
           link: function (scope, element, attrs) {
               
                var chart = false;
                scope.most_likely = ""
               
                var initChart = function(dataPro) {
                  if (chart) chart.destroy();
                  var config = scope.config || {};
                   chart = AmCharts.makeChart("crime_sheep_data_top_six",{
                      "type"    : "pie",
                      "titleField"  : "category",
                      "valueField"  : "column-1",
                      "colors" : ["#00BCD4", "#FF9800", "#CDDC39","#9C27B0","#FFC107","#00838F","#EF6C00","#8BC34A","#7B1FA2","#E91E63"],
                      "dataProvider"  : dataPro
                    });           
                  };

             scope.$watch(function () {
                return scope.ngModel
             }, function(newValue) {

                if (newValue != undefined){
                  dataPro = [];

                  scope.most_likely = newValue.crimes[0].offence

                  for (index = 0; index < newValue.crimes.length; ++index) {
                    dataPro.push({"category": newValue.crimes[index].offence, "column-1": parseInt(newValue.crimes[index].total)})
                  }

                  console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;

app.directive('chartDataGender',
   function () {
       return {
           restrict: 'E',
           scope: {
            ngModel: '=',
            user: "="
          },
           // replace:true,
          templateUrl: 'templates/gender-chart.html',
           // template: '<div id="crime_sheep_data_gender" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
           require: 'ngModel',
           link: function (scope, element, attrs) {
               
                var chart = false;
                scope.title = ""
                scope.long_title = ""
                scope.percentage = ""
                scope.total_percentage = ""
               
                var initChart = function(dataPro) {
                  if (chart) chart.destroy();
                  var config = scope.config || {};
                   chart = AmCharts.makeChart("crime_sheep_data_gender",{
                      "type"    : "pie",
                      "titleField"  : "category",
                      "valueField"  : "column-1",
                      "innerRadius" : "60%",
                      "colors" : ["#00BCD4", "#FF9800", "#CDDC39","#9C27B0","#FFC107","#00838F","#EF6C00","#8BC34A","#7B1FA2","#E91E63"],
                      "dataProvider"  : dataPro
                    });           
                  };

             scope.$watch(function () {
                return scope.ngModel
             }, function(newValue) {

                if (newValue != undefined){
                  scope.title = newValue.gender.offence
                  scope.long_title = newValue.gender.offence_long_name

                  total_crimes = 0
                  item_total = 0

                  for (index = 0; index < newValue.crimes.length; ++index) {
                    total_crimes = total_crimes + parseInt(newValue.crimes[index].total)
                    if (newValue.crimes[index].offence == newValue.gender.offence){
                      item_total = newValue.crimes[index].total;
                    }
                  }

                  scope.total_percentage = (item_total/total_crimes * 100).toFixed(2) + "%"

                  total_crimes_gender = parseInt(newValue.gender.male) + parseInt(newValue.gender.female);
                  if (scope.user.gen == "Male"){
                    perc = (parseInt(newValue.gender.male)/total_crimes_gender) * 100;
                  } else{
                    perc = (parseInt(newValue.gender.female)/total_crimes_gender) * 100;
                  }
                  scope.percentage = perc.toFixed(2) + "%"

                  dataPro = [];

                  dataPro.push({"category": "Male", "column-1": parseInt(newValue.gender.male)})
                  dataPro.push({"category": "Female", "column-1": parseInt(newValue.gender.female)})

                  console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;

app.directive('chartDataTime',
   function () {
       return {
           restrict: 'E',
           scope: {
            ngModel: '='
          },
           // replace:true,
          templateUrl: 'templates/time-chart.html',
           // template: '<div id="crime_sheep_data_gender" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
           require: 'ngModel',
           link: function (scope, element, attrs) {
               
                var chart = false;
                scope.title = "";
                scope.long_title = ""
                scope.total_percentage = ""
               
                var initChart = function(dataPro) {
                  if (chart) chart.destroy();
                  var config = scope.config || {};
                   chart = AmCharts.makeChart("crime_sheep_data_time",{
                      "type": "serial",
                      "colors" : ["#00BCD4", "#FF9800", "#CDDC39","#9C27B0","#FFC107","#00838F","#EF6C00","#8BC34A","#7B1FA2","#E91E63"],
                      "dataProvider"  : dataPro,
                      "valueAxes": [{
                          "axisAlpha": 0,
                          "position": "left"
                      }],
                      "graphs": [{
                          "id":"g1",
                          "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                          "bullet": "round",
                          "bulletSize": 8,         
                          "lineColor": "#EF6C00",
                          "lineThickness": 2,
                          "negativeLineColor": "#8BC34A",
                          "type": "smoothedLine",
                          "valueField": "value"
                      }],
                      "categoryField": "year",
                      "dataDateFormat": "YYYY"
                    });           
                  };

             scope.$watch(function () {
                return scope.ngModel
             }, function(newValue) {

                if (newValue != undefined){
                  scope.title = newValue.time_crime.offence
                  scope.long_title = newValue.time_crime.offence_long_name
                  scope.subline = ''

                  total_crimes = 0
                  item_total = 0

                  for (index = 0; index < newValue.crimes.length; ++index) {
                    total_crimes = total_crimes + parseInt(newValue.crimes[index].total)
                    if (newValue.crimes[index].offence == newValue.time_crime.offence){
                      item_total = newValue.crimes[index].total;
                    }
                  }

                  scope.total_percentage = (item_total/total_crimes * 100).toFixed(2) + "%"


                  low_year = {year: 6000000, total: 0}
                  high_year = {year: 0, total: 0}

                  dataPro = [];

                  for (index = 0; index < newValue.time_crime.data.length; ++index) {
                    dataPro.push({"year": parseInt(newValue.time_crime.data[index].year), "value": parseInt(newValue.time_crime.data[index].total)})
                    if (low_year.year > parseInt(newValue.time_crime.data[index].year)){
                      low_year.year = parseInt(newValue.time_crime.data[index].year);
                      low_year.total = parseInt(newValue.time_crime.data[index].total)
                    }
                    if (high_year.year < parseInt(newValue.time_crime.data[index].year)){
                      high_year.year = parseInt(newValue.time_crime.data[index].year);
                      high_year.total = parseInt(newValue.time_crime.data[index].total)
                    }
                  }

                  console.log(high_year)

                  neg = (parseInt(high_year.total) - parseInt(low_year.total) )
                  console.log(neg)
                  pos = (parseInt(high_year.total) + parseInt(low_year.total))
                  console.log(pos)
                  yearpec = (( (neg) / ((pos)/2) ) * 100).toFixed(2) + "%"
                  console.log(yearpec)

                  if (high_year.total > low_year.total){
                    //more likey
                    // total = high_year.total + low_year.total
                    // yearpec = (( | high_year.total - low_year.total | / ((high_year.total + low_year.total)/2) ) * 100).toFixed(2) + "%"
                    // yearpec = (low_year.total/total * 100).toFixed(2) + "%"
                    scope.subline = 'you are ' + yearpec + " more likey to commit this crime now than in " + low_year.year
                  } else {
                    scope.subline = 'you are ' + yearpec + " less likey to commit this crime now than in " + low_year.year
                  }

                  console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;

app.directive('chartAgeData',
   function () {
       return {
           restrict: 'E',
           scope: {
            ngModel: '='
          },
           // replace:true,
           templateUrl: 'templates/chart-age-data.html',
           require: 'ngModel',
           link: function (scope, element, attrs) {
               
                var chart = false;
                scope.most_likely = ""
               
                var initChart = function(dataPro) {
                  if (chart) chart.destroy();
                  var config = scope.config || {};
                   chart = AmCharts.makeChart("crime_sheep_data_age_chart",{
                    "type": "serial",
                    "theme": "light",
                    "colors" : ["#00838F","#EF6C00"],
                    "categoryField": "year",
                    "rotate": true,
                    "startDuration": 1,
                    "categoryAxis": {
                      "gridPosition": "start",
                      "position": "left"
                    },
                    "trendLines": [],
                    "graphs": [
                      {
                        "balloonText": "Male:[[value]]",
                        "fillAlphas": 0.8,
                        "id": "AmGraph-1",
                        "lineAlpha": 0.2,
                        "title": "Male",
                        "type": "column",
                        "valueField": "male"
                      },
                      {
                        "balloonText": "Female:[[value]]",
                        "fillAlphas": 0.8,
                        "id": "AmGraph-2",
                        "lineAlpha": 0.2,
                        "title": "Female",
                        "type": "column",
                        "valueField": "female"
                      }
                    ],
                    "guides": [],
                    "valueAxes": [
                      {
                        "id": "ValueAxis-1",
                        "position": "top",
                        "axisAlpha": 0
                      }
                    ],
                    "allLabels": [],
                    "balloon": {},
                    "titles": [],
                    "dataProvider": dataPro           
                  });
                };

             scope.$watch(function () {
                return scope.ngModel
             }, function(newValue) {

                if (newValue != undefined){
                  dataPro = [];
                  scope.title = newValue.age_crime.offence
                  scope.long_title = newValue.age_crime.offence_long_name

                  total_crimes = 0
                  item_total = 0

                  for (index = 0; index < newValue.crimes.length; ++index) {
                    total_crimes = total_crimes + parseInt(newValue.crimes[index].total)
                    if (newValue.crimes[index].offence == newValue.age_crime.offence){
                      item_total = newValue.crimes[index].total;
                    }
                  }

                  scope.total_percentage = (item_total/total_crimes * 100).toFixed(2) + "%"


                  for (index = 0; index < newValue.age_crime.data.length; ++index) {
                    dataPro.push({ "year": newValue.age_crime.data[index].age, "male": newValue.age_crime.data[index].male, "female": newValue.age_crime.data[index].female })
                    // dataPro.push({"category": newValue.crimes[index].offence, "column-1": parseInt(newValue.crimes[index].total)})
                  }

                  console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;


