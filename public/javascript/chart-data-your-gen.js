app.directive('chartDataYourGen',
   function () {
       return {
           restrict: 'E',
           scope: {
            ngModel: '=',
            user: "="
          },
          templateUrl: 'templates/your-gen-chart.html',
          require: 'ngModel',
           link: function (scope, element, attrs) {
               
                var chart = false;
                scope.title = ""
                scope.long_title = ""
                scope.total_percentage = ""
               
                var initChart = function(dataPro) {
                  if (chart) chart.destroy();
                  var config = scope.config || {};
                   chart = AmCharts.makeChart("crime_sheep_data_your_gen_chart",{
                      "type": "serial",
                      "theme": "light",
                      "dataProvider": dataPro,
                      "valueAxes": [ {
                        "title": "Number of Crimes",
                        "position": "left",
                        "axisAlpha": 0
                      } ],
                      "startDuration": 1,
                      "graphs": [ {
                        "balloonText": "[[category]]: <b>[[value]]</b>",
                        "fillColorsField": "color",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "total"
                      } ],
                      "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                      },
                      "categoryField": "age",
                      "categoryAxis": {
                        "gridPosition": "start",
                        "labelRotation": 50
                      },
                      "export": {
                        "enabled": true
                      }

                    });           
                  };

             scope.$watch(function () {
                return scope.ngModel
             }, function(newValue) {

                colors = ["#00BCD4", "#FF9800", "#CDDC39","#9C27B0","#FFC107","#00838F","#EF6C00","#8BC34A","#7B1FA2","#E91E63","#FFC107","#CDDC39"]

                if (newValue != undefined){
                  scope.title = newValue.your_gen_crime.offence
                  scope.long_title = newValue.your_gen_crime.offence_long_name

                  total_crimes = 0
                  item_total = 0

                  for (index = 0; index < newValue.crimes.length; ++index) {
                    total_crimes = total_crimes + parseInt(newValue.crimes[index].total)
                    if (newValue.crimes[index].offence == newValue.your_gen_crime.offence){
                      item_total = newValue.crimes[index].total;
                    }
                  }

                  scope.total_percentage = (item_total/total_crimes * 100).toFixed(2) + "%"
                  scope.rate_of_crime = newValue.your_gen_crime.your_age.level
                  scope.gender = newValue.your_gen_crime.your_age.gender
                  rate = newValue.your_gen_crime.your_age.level.toString()
                  if ((rate.indexOf('mo') == 0) || (rate.indexOf('se') == 0) || (rate.indexOf('th') == 0) || (rate.indexOf('lo') == 0)){
                    scope.rate_pre = "is the"
                  } else if (rate.indexOf('a') == 0){
                    scope.rate_pre = "has an"
                  } else {
                    scope.rate_pre = "has an"
                  }

                  dataPro = [];

                  for (index = 0; index < newValue.your_gen_crime.data.length; ++index) {
                    group_color = "#FFC107"
                    if (newValue.your_gen_crime.data[index].your_group) {
                      group_color = "#9C27B0"
                    }
                    dataPro.push({"age": newValue.your_gen_crime.data[index].age, "total": parseInt(newValue.your_gen_crime.data[index].total), "color": group_color})
                  }

                  console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;