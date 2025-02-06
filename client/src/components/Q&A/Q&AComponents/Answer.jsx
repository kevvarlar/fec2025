/*global process*/
/*eslint no-undef: "error"*/
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Photo from './Photo.jsx';
import swal from 'sweetalert';

const Answer = ({answer, setRefresh, isClicked}) => {

  const [yes, setYes] = React.useState(false);

  const handleYes = () => {
    if (!yes) {
      axios.put(process.env.NEXT_PUBLIC_API_URL + `/qa/answers/${answer.id}/helpful`, {}, {headers: {Authorization:process.env.NEXT_PUBLIC_AUTH_SECRET} })
        .then( () => {
          isClicked(false);
          setYes(true);
          setRefresh({});
          swal('Success!!!', 'Successfully marked answer as helpful', 'success', {
            buttons: 'Continue!'
          });
        })
        .catch((err) => {
          console.error(err)
          swal('Error', 'Could not mark answer as helpful', 'error');
        })
    } else {
      swal('Warning', 'You cannot mark a answer as helpful more than once ❌', 'warning');
    }
  }
  const handleReport = () => {
    axios.put(process.env.NEXT_PUBLIC_API_URL + `/qa/answers/${answer.id}/report`, {}, {headers: {Authorization:process.env.NEXT_PUBLIC_AUTH_SECRET} })
        .then( () => {
          isClicked(false);
          setYes(true);
          setRefresh({});
          swal('Success!!!', 'Thank you for reporting this inappropriate answer 🫡', 'success', {
            buttons: 'Continue!'
          });
        })
        .catch(() => {
          swal('Error', 'Could not report answer', 'error');
        })
    }

  return (
    <>
      <div id="answer" data-testid="answer">
        <p id="answer-body" data-testid="answer-body">{answer.body}</p>
        {answer.photos.map(photo => <Photo key={photo} photo={photo}/>)}
        {answer.photos.length > 0 ? <br/> : null}
        <small>by {answer.answerer_name}, {new Date(answer.date).toLocaleString(undefined, {year: 'numeric',  day: 'numeric', month: 'long'})} | Helpful?  <u className="helpButton" data-testid="yes-answer" onClick={handleYes}>Yes</u> {'(' + answer.helpfulness + ')'} | <u className="helpButton" data-testid="report" onClick={handleReport}>Report</u></small>
      </div>
    </>
  );
};

Answer.propTypes = {
  answer: PropTypes.object.isRequired,
  setRefresh: PropTypes.func.isRequired,
  isClicked: PropTypes.func.isRequired
};


export default Answer;