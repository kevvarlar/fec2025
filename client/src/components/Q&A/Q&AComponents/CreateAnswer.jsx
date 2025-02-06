/*global process*/
/*eslint no-undef: "error"*/
import React from 'react';
import Modal from './Modal.jsx';
import {useSelector} from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

const CreateAnswer = ({question, setRefresh}) => {
  const Product = useSelector(store => store.Product);
  const [open, setOpen] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const imageInputRef = React.useRef(null);
  const [photos, setPhotos] = React.useState([])
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
    axios.post(process.env.NEXT_PUBLIC_API_URL + `/qa/questions/${question.question_id}/answers`, {body, name, email, photos},{headers: {Authorization:process.env.NEXT_PUBLIC_AUTH_SECRET} })
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
  const handleYes = () => {
    if (!clicked) {
      axios.put(process.env.NEXT_PUBLIC_API_URL + `/qa/questions/${question.question_id}/helpful`, {}, {headers: {Authorization:process.env.NEXT_PUBLIC_AUTH_SECRET} })
        .then( () => {
          setClicked(true);
          setRefresh({});
          swal('Success!!!', 'Successfully marked question as helpful', 'success', {
            buttons: 'Continue!'
          });
        })
        .catch(() => swal('Error', 'Could not mark question as helpful', 'error'))
    } else {
      swal('Warning', 'You cannot mark a question as helpful more than once ❌', 'warning');
    }
  }
  const handleImages = (event) => {
    const fileArray = Array.from(event.target.files);
    if (fileArray.length <= 5) {
      var photosData = fileArray.map((file) => URL.createObjectURL(file));
      setPhotos([...photosData]);
    } else {
      imageInputRef.current.value = '';
      setPhotos([]);
      swal('Warning', 'You can only upload a max of 5 images', 'warning', {
        buttons: 'Continue filling form'
      });
    }
  }
  return (
  <div data-testid="create-answer">
      <small>Helpful?  <u data-testid="yes-question" className="helpButton" onClick={handleYes}>Yes</u> {'(' + question.question_helpfulness + ')'} | </small>
      <small><u className="helpButton" data-testid="open-answer" id="open-answer" onClick={handleOpen}>Add Answer</u></small>
      <Modal isOpen={open} onClose={handleClose}>
        <>
          <h1>Submit your Answer</h1>
          <h3>{Product.name}: {question.question_body}</h3>
          <form action={handleSubmit}>
            <label>Your Answer*</label>
            <br/>
            <textarea data-testid="body" name="body" placeholder="Your answer to the question above" maxLength="1000" minLength="1" rows="5" cols="65"></textarea>
            <br/>
            <br/>
            <label> What is your nickname*</label>
            <br/>
            <input data-testid="name" placeholder="Example: jack543!" name="name" maxLength="60" minLength="5"></input>
            <br/>
            <small>For privacy reasons, do not use your full name or email address</small>
            <br/>
            <br/>
            <label>Your email*</label>
            <br/>
            <input data-testid="email" type="email" placeholder="Example: jack@email.com" name="email" maxLength="60" minLength="3"></input>
            <br/>
            <small>For authentication reasons, you will not be emailed</small>
            <br/>
            <br/>
            <label>Photos</label>
            <br/>
            <input data-testid="images" type="file" ref={imageInputRef} multiple accept="image/*" onChange={handleImages}></input>
            <br/>
            {photos.map(photo => <img key={photo} style={{height: '50px', width: '100px'}} src={photo} alt="Preview Image"></img>)}
            <br/>
            <small>Only upload up to 5 images</small>
            <br/>
            <br/>
            <button data-testid="submit" type="submit">Submit Answer</button>
          </form>
          <br/>
        </>
      </Modal>
    </div>
  );
};

CreateAnswer.propTypes = {
  question: PropTypes.object.isRequired,
  setRefresh: PropTypes.func.isRequired,
};

export default CreateAnswer;