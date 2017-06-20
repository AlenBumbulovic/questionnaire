"use strict";


var promise = require('bluebird');
var options = {
    promiseLib: promise
};

var async = require('async');


var pgp = require('pg-promise')(options);
var config = require('../config');

var dbConnectionConfig = { host:config.db.host, user:config.db.username, password:config.db.password, database:config.db.database };
var db = pgp(dbConnectionConfig);


function getAllQuestionnaires(req, res, next) {
    db.any('SELECT * FROM public.questionnaire_type ORDER BY "questionnaire_id"')
        .then(function (data) {
            res.status(200)
                .json(data);
            console.log("BACKEND: questionnaires retrieved from database successfully!" + data);
        })
        .catch(function (err) {
            return next(console.error('BACKEND: error while questionnaires from database! ', err.message));
        });
}


function getQuestionnaireByCategory(req, res, next) {

    var questionnaireId = parseInt(req.params.category);

    db.any('SELECT * FROM public.questionnaire_type' +
        ' LEFT' +
        ' JOIN' +
        ' public.questions ON' +
        ' public.questions.questionnaire_type_id =' +
        ' public.questionnaire_type.questionnaire_id LEFT JOIN' +
        ' public.answers ON public.questions.question_id =' +
        ' public.answers.question_id' +
        ' WHERE "questionnaire_type_id" = $1' ,questionnaireId)
        .then(function (data) {

            var questionArray = [];

            function hasItem (record, questionArray) {
                for(var x = 0; x < questionArray.length; x++) {
                    if(record.question_id == questionArray[x].question_id) {
                        return 0;
                    }
                }
                return -1;
            }

            for(var y = 0; y < data.length; y++) {
                var existing = hasItem(data[y], questionArray);
                if(existing == -1) {
                    questionArray.push({
                        question_id: data[y].question_id,
                        question_type: data[y].question_type,
                        question_text: data[y].question_text,
                        is_multiple: data[y].is_multiple,
                        questionnaire_type_id: data[y].questionnaire_type_id,
                        questionnaire_title: data[y].questionnaire_title
                    })
                }
            }


            for(var z = 0; z < data.length; z++) {

                for(var k = 0; k < questionArray.length; k++) {

                    if(data[z].question_id === questionArray[k].question_id) {
                        if(!questionArray[k].answers) {
                            questionArray[k].answers = [];
                        }

                        questionArray[k].answers.push({
                            answer_id: data[z].answer_id,
                            answer: data[z].answer,
                            question_id: data[z].question_id,
                            is_correct: data[z].is_correct

                    })
                    }
                }
            }

            res.status(200)
                .json(questionArray);

        })
        .catch(function (err) {
            console.log(err);
        });
}


function createUserAnswers(req, res, next) {
    db.one("INSERT INTO public.user_info(name, lastname," +
        " email)" +
        " VALUES(${name}, ${lastname}, ${email}) RETURNING user_id", req.body)
        .then(function (data) {
            var user_id = data.user_id;

            async.each(req.body.questions, function(singleQuestion, qCallback) {
                // console.log(singleQuestion);
                async.each(singleQuestion.answers, function(singleAnswer,aCallback) {
                    // console.log(singleAnswer);
                    db.one('INSERT INTO public.user_questionnaire(user_id, question_id, answer_id)' +
                        ' VALUES ($1, $2, $3)', [user_id, singleQuestion.question_id,
                        singleAnswer.answer_id]);
                    aCallback();

                }, function(err) {
                    if( err ) {
                        qCallback(err)


                    } else {
                        qCallback();
                    }
                });

            }, function(err) {
                if( err ) {
                    res.status(400)
                        .send({
                            error: "ERROR"
                        });

                    } else {
                        res.status(200).json({
                            status: "Success!"
                        });
                        }
                    });
                })
                .catch(function (err) {
                    return next(console.error('ERROR! ', err));
                });
        }


module.exports = {
    getAllQuestionnaires: getAllQuestionnaires,
    getQuestionnaireByCategory: getQuestionnaireByCategory,
    createUserAnswers: createUserAnswers
};