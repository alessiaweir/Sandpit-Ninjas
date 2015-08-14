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
                      "panelsSettings":{
                        "panEventsEnabled": "false"
                      },
                      "type"    : "pie",
                      "titleField"  : "category",
                      "valueField"  : "column-1",
                      "innerRadius" : "60%",
                      "labelRadius": 15,
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

                  // console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;