angular.module('mop_questionnaire')
    .controller('questionnaireController', ['$scope', '$http', 'config','toastr','$location','$timeout', function ($scope,$http, config, toastr, $location, $timeout) {

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
                    toastr.error('Something went wrong', 'Error');
                }

            }, function errorCallback(error) {
                console.log(error);
            });
        };

        vm.getSingleQuestionnaire();


        vm.showError = false;
        vm.answerModel = [];

        vm.saveAnswers = function (questions) {

            vm.answerModel.userAnswer = [];
            vm.answerModel.name = vm.questions.name;
            vm.answerModel.lastname = vm.questions.lastname;
            vm.answerModel.email = vm.questions.email;
            vm.answerModel.userAnswer = vm.questions.userAnswers;
            vm.answerModel.userInfo = vm.questions.userInfo;

            for(var key in vm.questions.userAnswers){
                if(vm.answerModel.userAnswer[key] instanceof Array){
                    for(var x in vm.answerModel.userAnswer[key]){
                        vm.answerModel.push({
                            answer_id : vm.answerModel.userAnswer[key][x].answer_id,
                            question_id : vm.answerModel.userAnswer[key][x].question_id,
                            answer_text : vm.answerModel.userAnswer[key][x].answer,
                            question_text : vm.answerModel.userAnswer[key][x].question_text
                        })
                    }
                }
            }

            for(var y in vm.answerModel.userInfo){
                vm.answerModel.push({
                    answer_id : vm.answerModel.userInfo[y].answer_id,
                    question_id : vm.answerModel.userInfo[y].question_id,
                    answer_text : vm.answerModel.userInfo[y].answer,
                    question_text : vm.answerModel.userInfo[y].answer_text,
                })
            }

            delete vm.answerModel.userInfo;
            delete vm.answerModel.userAnswer;

             vm.finalModel = {};
             vm.finalModel.questions = [];

            vm.finalModel.name = vm.answerModel.name;
            vm.finalModel.lastname = vm.answerModel.lastname;
            vm.finalModel.email = vm.answerModel.email;


            for(var a in vm.answerModel){
                if(vm.answerModel[a] instanceof Object){
                    vm.finalModel.questions.push({
                        question_id: vm.answerModel[a].question_id,
                        question_text: vm.answerModel[a].question_text,
                        answers: [{
                            answer_id: vm.answerModel[a].answer_id,
                            answer_text: vm.answerModel[a].answer_text
                        }]
                    })

                }
            }

            if(vm.finalModel.name === undefined || vm.finalModel.name.length === 0){
                // vm.showError = true;
                toastr.error("Please fill the form!", "Error");
                return;
            }

            if(vm.finalModel.lastname === undefined || vm.finalModel.lastname.length === 0){
                // vm.showError = true;
                toastr.error("Please fill the form!", "Error");
                return;
            }

            if(vm.finalModel.email === undefined || vm.finalModel.email.length === 0){
                // vm.showError = true;
                toastr.error("Please fill the form!", "Error");
                return;
            }

            $http({
                method: 'POST',
                url: config.apiUrl + '/answers/create',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: vm.finalModel

            }).then(function successCallback(response) {

                if(response.status === 200){
                    toastr.success("Questionnaire was saved successfully", "Success");
                    
                }else{
                    toastr.warning("Something went wrong, questionnaire was" +
                        " not saved.", "Warning");
                }

            }, function errorCallback(response) {

            });
        };
    }]);

