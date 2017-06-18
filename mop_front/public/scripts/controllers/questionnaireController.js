angular.module('mop_questionnaire')
    .controller('questionnaireController', ['$scope', '$http', 'config', function ($scope,$http, config) {

        var vm = this;

        //getting the id from path
        var regex = /[^\/]+$/;
        var url = window.location.href;
        var category = url.match(regex );

        vm.getSingleQuestionnaire = function () {

            $http.get(config.apiUrl + '/questionnaire/' + category).then(function successCallback(response) {
                if(response.status === 200){
                    vm.questions = response.data;

                }else{

                }

            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.getSingleQuestionnaire();


        vm.answerModel = {};
        vm.showError = false;


        vm.saveAnswers = function (questions) {

            vm.answerModel = [];
            vm.answerModel.questions = [];
            vm.answerModel.answers = [];
            vm.answerModel.name = vm.questions.name;
            vm.answerModel.lastname = vm.questions.lastname;
            vm.answerModel.email = vm.questions.email;
            vm.answerModel.answers = vm.questions.answers;


            for(var key in vm.questions){
              //  console.log(vm.questions[key]);
                if(vm.questions[key].question_id) {
                    vm.answerModel.questions.push({
                        question_id: vm.questions[key].question_id,

                    });
                }
            }

            // console.log(vm.answerModel);

            for(var x in vm.answerModel.answers){
                console.log(vm.answerModel.answers[x]);
            }

            if(vm.answerModel.name === undefined || vm.answerModel.name.length === 0){
                vm.showError = true;
                return;
            }

            if(vm.answerModel.lastname === undefined || vm.answerModel.lastname.length === 0){
                vm.showError = true;
                return;
            }

            if(vm.answerModel.email === undefined || vm.answerModel.email.length === 0){
                vm.showError = true;
                return;
            }

            $http.post(config.apiUrl + '/answers/create', vm.answerModel).then(function successCallback(response) {
                console.log(response)
            }, function errorCallback(err) {
                console.log(err)
            });


        };

    }]);

