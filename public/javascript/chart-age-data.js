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
                  scope.age = newValue.age_crime.most_likey.age
                  scope.gender = newValue.age_crime.most_likey.gender

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

                  // console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;
