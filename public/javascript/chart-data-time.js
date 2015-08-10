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
                          "lineColor": "#CCDC39",
                          "lineThickness": 2,
                          "negativeLineColor": "#00838F",
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

                  // console.log(high_year)

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

                  // console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;

