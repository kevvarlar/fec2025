/*global*/
/*eslint no-undef: "error"*/
import React from 'react';
import PropTypes from 'prop-types';
import Answers from './Answers.jsx';
import CreateAnswer from './CreateAnswer.jsx';

const Question = ({question, setRefresh}) => {
  const [answersData, setAnswersData] = React.useState([])
  const [answers, setAnswers] = React.useState([]);
  React.useEffect(() => {
    if(Object.keys(question.answers).length === 0) {
      return;
    }
    var answerArray = []
    for(var key in question.answers) {
      answerArray.push(question.answers[key]);
    }
    answerArray.sort((a, b) => b.helpfulness - a.helpfulness);
    setAnswersData(answerArray);
    setAnswers(answerArray.slice(0, 2));
  }, [question.answers]);
  return (
    <div data-testid="question">
      <div id="question">
        <h3 data-testid="question-body"><b>Q: {question.question_body}</b></h3>
        <CreateAnswer question={question} setRefresh={setRefresh}/>
      </div>
      <Answers answers={answers} setAnswers={setAnswers} answersData={answersData} setAnswersData={setAnswersData} question={question} setRefresh={setRefresh}/>
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.object.isRequired,
  setRefresh: PropTypes.func.isRequired
};

export default Question;