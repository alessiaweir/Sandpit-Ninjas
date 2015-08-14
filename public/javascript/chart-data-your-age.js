app.directive('chartDataYourAge',
   function () {
       return {
           restrict: 'E',
           scope: {
            ngModel: '=',
            user: "="
          },
          templateUrl: 'templates/your-age-chart.html',
          require: 'ngModel',
           link: function (scope, element, attrs) {
               
                var chart = false;
                scope.title = ""
                scope.long_title = ""
                scope.total_percentage = ""
               
                var initChart = function(dataPro) {
                  if (chart) chart.destroy();
                  var config = scope.config || {};
                  chart = AmCharts.makeChart("crime_sheep_data_your_age_chart",{
                      "panEventsEnabled": "false",
                      "type"    : "pie",
                      "titleField"  : "category",
                      "valueField"  : "column-1",
                      "innerRadius" : "60%",
                      "colors" : ["#00838F", "#FF9800", "#CDDC39","#9C27B0","#FFC107","#00BCD4","#E91E63","#8BC34A","#7B1FA2","#EF6C00"],
                      "dataProvider"  : dataPro,
                      "pulledField": "is-your-group"
                  });           
                };

             scope.$watch(function () {
                return scope.ngModel
             }, function(newValue) {

                if (newValue != undefined){
                  scope.title = newValue.your_age_crime.offence
                  scope.long_title = newValue.your_age_crime.offence_long_name

                  total_crimes = 0
                  item_total = 0

                  for (index = 0; index < newValue.crimes.length; ++index) {
                    total_crimes = total_crimes + parseInt(newValue.crimes[index].total)
                    if (newValue.crimes[index].offence == newValue.your_age_crime.offence){
                      item_total = newValue.crimes[index].total;
                    }
                  }

                  scope.total_percentage = (item_total/total_crimes * 100).toFixed(2) + "%"
                  scope.rate_of_crime = newValue.your_age_crime.your_age.level
                  scope.gender = newValue.your_age_crime.your_age.gender
                  rate = newValue.your_age_crime.your_age.level.toString()
                  if ((rate.indexOf('mo') == 0) || (rate.indexOf('se') == 0) || (rate.indexOf('th') == 0) || (rate.indexOf('lo') == 0)){
                    scope.rate_pre = "is the"
                  } else if (rate.indexOf('a') == 0){
                    scope.rate_pre = "has an"
                  } else {
                    scope.rate_pre = "has an"
                  }

                  dataPro = [];

                  for (index = 0; index < newValue.your_age_crime.data.length; ++index) {
                    dataPro.push({"category": newValue.your_age_crime.data[index].age, "column-1": parseInt(newValue.your_gen_crime.data[index].total), "is-your-group": newValue.your_gen_crime.data[index].your_group})
                  }

                  console.log(dataPro)

                  initChart(dataPro);
                }
             });
   
         }//end watch           
       }
   }) ;