angular.module('mop_home')
    .controller('homeController', ['$scope','$http','config','toastr', function ($scope, $http, config, toastr) {

        var vm = this;

        vm.getAllCategories = function () {

            $http.get(config.apiUrl + '/questionnaire').then(function successCallback(response) {
                console.log(response);

                if(response.status === 200){
                    vm.questionnaires = response.data
                }else{
                    toastr.error('Something went wrong', 'Error');
                }

            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.getAllCategories();




}]);
