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
                      "panelsSettings":{
                        "panEventsEnabled": "false"
                      },
                      "type"    : "pie",
                      "titleField"  : "category",
                      "valueField"  : "column-1",
                      "innerRadius" : "60%",
                      "labelRadius": 15,
                      "colors" : ["#00BCD4", "#FF9800"],
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

                  // console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;
