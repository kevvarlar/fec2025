/*global*/
/*eslint no-undef: "error"*/
import React from 'react';
import {useSelector} from 'react-redux';
import Question from './Question.jsx';
import CreateQuestion from './CreateQuestion.jsx';
import PropTypes from 'prop-types';

const Questions = ({refresh, setRefresh}) => {
  const QuestionsData = useSelector(store => store.QuestionsData);
  return (
  <div data-testid="questions">
    {QuestionsData.length > 0 ? [...QuestionsData].map((question) => {
      // console.log(typeof question);
      return (<Question key={question.question_id} question={question} refresh={refresh} setRefresh={setRefresh}/>)
    }) : <p><b>No questions here but feel free to add one</b></p>}
    <CreateQuestion setRefresh={setRefresh}/>
  </div>
  );
};

Questions.propTypes = {
  refresh: PropTypes.object.isRequired,
  setRefresh: PropTypes.func.isRequired,
};

export default Questions;