/*global process*/
/*eslint no-undef: "error"*/
import React from 'react';
import Modal from './Modal.jsx';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {QuestionsActions} from '../../../store/QuestionsSlice.js';
import swal from 'sweetalert';

const CreateQuestion = ({questions, setQuestions, setRefresh}) => {
  const dispatch = useDispatch();
  const Product = useSelector(store => store.Product);
  const QuestionsData = useSelector(store => store.QuestionsData);
  const [open, setOpen] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit= (formData) => {
    const body = formData.get("body");
    const name = formData.get("name");
    const email = formData.get("email");
    if (!body || !name || !email) {
      swal('Warning', 'One or more required fields are empty', 'warning', {
        buttons: 'Continue filling form'
      });
      return;
    }
    axios.post(process.env.API_URL + '/qa/questions', {body, name, email, product_id: Product.id},{headers: {Authorization:process.env.AUTH_SECRET} })
      .then(() => {
        setOpen(false);
        setRefresh({});
        swal('Success', 'Successfully submitted!!! 🎉', 'success', {
          buttons: 'Continue!'
        });
      })
      .catch(() => {
        swal('Error', 'Could not submit form', 'error');
      })
  }
  const handleQuestions = () => {
    setClicked(true);
    const temp = QuestionsData;
    dispatch(QuestionsActions.setQuestions(questions));
    setQuestions(temp);
  }
  const handleCollapse = () => {
    setClicked(false);
    const temp = QuestionsData;
    dispatch(QuestionsActions.setQuestions(questions));
    setQuestions(temp);
  };
  return (
  <div data-testid="create-question">
    {questions && questions.length > 4 && !clicked ? <h3 data-testid="load-questions" className="question-button" onClick={handleQuestions}>MORE ANSWERED QUESTIONS</h3> : (clicked ? <h3 data-testid="collapse-questions" className="question-button" onClick={handleCollapse}>COLLAPSE QUESTIONS</h3> : null)}
    <h3 data-testid="open-question" className="question-button" onClick={handleOpen}>ADD A QUESTION ➕</h3>
    <Modal isOpen={open} onClose={handleClose}>
      <>
        <h1>Ask Your Question</h1>
        <h3>About the {Product.name}</h3>
        <form action={handleSubmit}>
          <label>Your Question*</label>
          <br/>
          <textarea data-testid="body" name="body" placeholder="Why did you like the product or not?" maxLength="1000" minLength="1" rows="5" cols="60"></textarea>
          <br/>
          <br/>
          <label> What is your nickname*</label>
          <br/>
          <input data-testid="name" placeholder="Example: jackson11!" name="name" maxLength="60" minLength="5"></input>
          <br/>
          <small>For privacy reasons, do not use your full name or email address</small>
          <br/>
          <br/>
          <label>Your email*</label>
          <br/>
          <input data-testid="email" type="email" placeholder="Example: john@gmail.com" name="email" maxLength="60" minLength="3"></input>
          <br/>
          <small>For authentication reasons, you will not be emailed</small>
          <br/>
          <br/>
          <button data-testid="submit" type="submit">Submit question</button>
        </form>
        <br/>
      </>
    </Modal>
    <div className="clearfix"></div>
  </div>
  );
};

CreateQuestion.propTypes = {
  questions: PropTypes.array.isRequired,
  setQuestions: PropTypes.func.isRequired,
  setRefresh: PropTypes.func.isRequired,
};

export default CreateQuestion;