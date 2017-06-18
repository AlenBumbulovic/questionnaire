angular.module('mop_home')
    .controller('homeController', ['$scope','$http','config', function ($scope, $http, config) {

        var vm = this;

        vm.getAllCategories = function () {

            $http.get(config.apiUrl + '/questionnaire').then(function successCallback(response) {
                console.log(response.data);

                if(response.status === 200){
                    vm.questionnaires = response.data
                }

            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.getAllCategories();




}]);
