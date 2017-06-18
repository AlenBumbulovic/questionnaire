var express = require('express');
var router = express.Router();
var db = require('./queries');

router.get('/questionnaire', db.getAllQuestionnaires);
router.get('/questionnaire/:category', db.getQuestionnaireByCategory);
router.post('/answers/create', db.createUserAnswers);


module.exports = router;
