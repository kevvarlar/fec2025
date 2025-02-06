/*global process*/
/*eslint no-undef: "error"*/
import React, { useState } from 'react';
import axios from 'axios';
import Modal from './ReviewModal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux';
import FileUpload from './FileUpload.jsx';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

const AddReviewModule = ({modalIsOpen, closeModal, setFormRating, formRating}) => {
  const Product = useSelector(store => store.Product);
  const ReviewsMeta = useSelector(store => store.ReviewsMeta);
  const [sizeRec, setSizeRec] = useState([]);
  const [widthRec, setWidthRec] = useState([]);
  const [comfortRec, setComfortRec] = useState([]);
  const [qualityRec, setQualityRec] = useState([]);
  const [lengthRec, setLengthRec] = useState([]);
  const [fitRec, setFitRec] = useState([]);
  const [recommend, setRecommend] = useState(false);
  const [bodyText, setBodyText] = useState('');
  const [files, setFiles] = useState([]);

  const handleSizeChange = (event) => {
    setSizeRec([ReviewsMeta.characteristics['Size'].id, event.target.value, event.target.id.slice(-1)]);
  };
  const handleWidthChange = (event) => {
    setWidthRec([ReviewsMeta.characteristics['Width'].id, event.target.value, event.target.id.slice(-1)]);
  };
  const handleComfortChange = (event) => {
    setComfortRec([ReviewsMeta.characteristics['Comfort'].id, event.target.value, event.target.id.slice(-1)]);
  };
  const handleQualityChange = (event) => {
    setQualityRec([ReviewsMeta.characteristics['Quality'].id, event.target.value, event.target.id.slice(-1)]);
  };
  const handleLengthChange = (event) => {
    setLengthRec([ReviewsMeta.characteristics['Length'].id, event.target.value, event.target.id.slice(-1)]);
  };
  const handleFitChange = (event) => {
    setFitRec([ReviewsMeta.characteristics['Fit'].id, event.target.value, event.target.id.slice(-1)]);
  };
  const [hoverRating, setHoverRating] = useState(0);
  const stars = {
    fullStar: <FontAwesomeIcon icon={faStar} />,
    emptyStar: <FontAwesomeIcon icon={faRegularStar} />,
  };

  const ratingTexts = {
    1: 'Poor',
    2: 'Fair',
    3: 'Average',
    4: 'Good',
    5: 'Great',
  };

  const handleRating = (index) => {
    setFormRating(index);
  };

  const handleHover = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = () => {
    var productChars = {
      [sizeRec[0]]: Number(sizeRec[2]),
      [widthRec[0]]: Number(widthRec[2]),
      [comfortRec[0]]: Number(comfortRec[2]),
      [qualityRec[0]]: Number(qualityRec[2]),
      [lengthRec[0]]: Number(lengthRec[2]),
      [fitRec[0]]: Number(fitRec[2]),
    }
    var filteredProductChars = Object.fromEntries(
      Object.entries(productChars).filter(([key, value]) => !isNaN(value) || key === undefined)
    );
    var formUrls = files.slice(5).map(file => file.thumbnail);
    var formSummary = document.getElementById('form-summary').value;
    var formName = document.getElementById('nickname-form').value;
    var formEmail = document.getElementById('email-form').value;

    axios.post(process.env.NEXT_PUBLIC_API_URL + '/reviews', {
        product_id: Product.id,
        rating: formRating,
        summary: formSummary,
        body: bodyText,
        recommend: recommend,
        name: formName,
        email: formEmail,
        photos: formUrls,
        characteristics: filteredProductChars,
    },
    { headers: { 'Authorization': process.env.NEXT_PUBLIC_AUTH_SECRET }})
    .then(() => {
    })
    .catch((err) => {
      if (err.response && err.response.status === 429) {
        swal('Sorry!', 'Traffic is full please refresh your browser', 'warning');
      } else {
        swal('Error!', 'Error while retrieving questions', 'error');
      }
    })
  }
  const handleMinText = () => {
    if (bodyText.length < 50) {
      return (50 - bodyText.length);
    } else {
      return "Minimum reached";
    }
  }
  const handleCharacteristics = () => {

    var formFields = [];
    const listOfChars = {
      'Size' : <fieldset id='size-form' name='size-form' key="size-form">
          <legend>Size: {sizeRec[1]}</legend>
      <div>
        <input
        type="radio"
        id="form-size1"
        name="size"
        required={true}
        onChange={handleSizeChange}
        value={'A size too small'}
        />
        <label htmlFor="form-size1">1</label>

        <input
        type="radio"
        id="form-size2"
        name="size"
        onChange={handleSizeChange}
        value={'½ a size too small'}
        />
        <label htmlFor="form-size2">2</label>

        <input
        type="radio"
        id="form-size3"
        name="size"
        onChange={handleSizeChange}
        value={'Perfect'}
        />
        <label htmlFor="form-size3">3</label>

        <input
        type="radio"
        id="form-size4"
        name="size"
        onChange={handleSizeChange}
        value={'½ a size too big'}
        />
        <label htmlFor="form-size4">4</label>

        <input
        type="radio"
        id="form-size5"
        name="size"
        onChange={handleSizeChange}
        value={'A size too wide'}
        />
        <label htmlFor="form-size5">5</label>
      </div>
              </fieldset>,
      'Width': <fieldset id='width-form' name='width-form' key="width-form">
        <legend>Width: {widthRec[1]}</legend>
      <div>
        <input
        type="radio"
        id="form-width1"
        name="width"
        onChange={handleWidthChange}
        required={true}
        value={'Too Narrow'} />
        <label htmlFor="form-width1">1</label>

        <input
        type="radio"
        id="form-width2"
        name="width"
        onChange={handleWidthChange}
        value={'Slightly Narrow'} />
        <label htmlFor="form-width2">2</label>

        <input
        type="radio"
        id="form-width3"
        name="width"
        onChange={handleWidthChange}
        value={'Perfect'}
        />
        <label htmlFor="form-width3">3</label>

        <input
        type="radio"
        id="form-width4"
        name="width"
        onChange={handleWidthChange}
        value={'Slightly Wide'}
        />
        <label htmlFor="form-width4">4</label>

        <input
        type="radio"
        id="form-width5"
        name="width"
        onChange={handleWidthChange}
        value={'Too wide'}
        />
        <label htmlFor="form-width5">5</label>
      </div>
              </fieldset>,
      'Comfort': <fieldset id='comfort-form' name='comfort-form' key="comfort-form">
      <legend>Comfort: {comfortRec[1]}</legend>
  <div>
    <input
    type="radio"
    id="form-comfort1"
    name="comfort"
    onChange={handleComfortChange}
    required={true}
    value={'Uncomfortable'} />
    <label htmlFor="form-comfort1">1</label>

    <input
    type="radio"
    id="form-comfort2"
    name="comfort"
    onChange={handleComfortChange}
    value={'Slightly uncomfortable'} />
    <label htmlFor="form-comfort2">2</label>

    <input
    type="radio"
    id="form-comfort3"
    name="comfort"
    onChange={handleComfortChange}
    value={'Ok'}
    />
    <label htmlFor="form-comfort3">3</label>

    <input
    type="radio"
    id="form-comfort4"
    name="comfort"
    onChange={handleComfortChange}
    value={'Comfortable'}
    />
    <label htmlFor="form-comfort4">4</label>

    <input
    type="radio"
    id="form-comfort5"
    name="comfort"
    onChange={handleComfortChange}
    value={'Perfect'}
    />
    <label htmlFor="form-comfort5">5</label>
  </div>
              </fieldset>,
      'Quality': <fieldset id='quality-form' name='quality-form' key="quality-form">
      <legend>Quality: {qualityRec[1]}</legend>
  <div>
    <input
    type="radio"
    id="form-quality1"
    name="quality"
    onChange={handleQualityChange}
    required={true}
    value={'Poor'} />
    <label htmlFor="form-quality1">1</label>

    <input
    type="radio"
    id="form-quality2"
    name="quality"
    onChange={handleQualityChange}
    value={'Below average'} />
    <label htmlFor="form-quality2">2</label>

    <input
    type="radio"
    id="form-quality3"
    name="quality"
    onChange={handleQualityChange}
    value={'What I expected'}
    />
    <label htmlFor="form-quality3">3</label>

    <input
    type="radio"
    id="form-quality4"
    name="quality"
    onChange={handleQualityChange}
    value={'Pretty great'}
    />
    <label htmlFor="form-quality4">4</label>

    <input
    type="radio"
    id="form-quality5"
    name="quality"
    onChange={handleQualityChange}
    value={'Perfect'}
    />
    <label htmlFor="form-quality5">5</label>
  </div>
              </fieldset>,
      'Length': <fieldset id='length-form' name='length-form' key="length-form">
      <legend>Length: {lengthRec[1]}</legend>
  <div>
    <input
    type="radio"
    id="form-length1"
    name="length"
    onChange={handleLengthChange}
    required={true}
    value={'Runs Short'} />
    <label htmlFor="form-length1">1</label>

    <input
    type="radio"
    id="form-length2"
    name="length"
    onChange={handleLengthChange}
    value={'Runs slightly short'} />
    <label htmlFor="form-length2">2</label>

    <input
    type="radio"
    id="form-length3"
    name="length"
    onChange={handleLengthChange}
    value={'Perfect'}
    />
    <label htmlFor="form-length3">3</label>

    <input
    type="radio"
    id="form-length4"
    name="length"
    onChange={handleLengthChange}
    value={'Runs slightly long'}
    />
    <label htmlFor="form-length4">4</label>

    <input
    type="radio"
    id="form-length5"
    name="length"
    onChange={handleLengthChange}
    value={'Runs long'}
    />
    <label htmlFor="form-length5">5</label>
  </div>
              </fieldset>,
      'Fit': <fieldset id='fit-form' name='fit-form' key="fit-form">
      <legend>Fit: {fitRec[1]}</legend>
  <div>
    <input
    type="radio"
    id="form-fit1"
    name="fit"
    onChange={handleFitChange}
    required={true}
    value={'Runs tight'} />
    <label htmlFor="form-fit1">1</label>

    <input
    type="radio"
    id="form-fit2"
    name="fit"
    onChange={handleFitChange}
    value={'Runs slightly tight'} />
    <label htmlFor="form-fit2">2</label>

    <input
    type="radio"
    id="form-fit3"
    name="fit"
    onChange={handleFitChange}
    value={'Perfect'}
    />
    <label htmlFor="form-fit3">3</label>

    <input
    type="radio"
    id="form-fit4"
    name="fit"
    onChange={handleFitChange}
    value={'Runs slightly long'}
    />
    <label htmlFor="form-fit4">4</label>

    <input
    type="radio"
    id="form-fit5"
    name="fit"
    onChange={handleFitChange}
    value={'Runs long'}
    />
    <label htmlFor="form-fit5">5</label>
  </div>
              </fieldset>
    };
    for (var characteristic in ReviewsMeta.characteristics) {
      formFields.push(listOfChars[characteristic]);
    }
    return formFields;
  }
  return (
    <div data-testid='addreviewmodule-view'>
    <Modal isOpen={modalIsOpen} onClose={closeModal}>
      <form action={() => handleSubmit()}>
      <h2>Please Rate:</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          {[...Array(5)].map((_, index) => {
            const starIndex = index + 1;
            return (
              <button
                data-testid={`starrating-view${index}`}
                key={starIndex}
                type="button"
                onMouseOver={() => handleHover(starIndex)}
                onClick={() => handleRating(starIndex)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer', padding: '5px' }}
              >
                {starIndex <= (hoverRating || formRating) ? stars.fullStar : stars.emptyStar}
              </button>
            );
          })}
        </div>
        <span style={{ marginLeft: '15px', fontSize: '16px', color: 'gray' }}>
          {ratingTexts[hoverRating || formRating]}
        </span>
      </div>
      <section>
        <fieldset>
          <legend>Would you recommend this product: {recommend ? 'Yes' : 'No'}</legend>
          <div>
            <input type="radio" id="form-recommend" name="recommend" onChange={() => setRecommend(true)} required={true} value={true} />
            <label htmlFor="form-recommend">Yes</label>

            <input type="radio" id="form-do-not-recommend" name="recommend" onChange={() =>setRecommend(false)}  value={false} />
            <label htmlFor="form-do-not-recommend">No</label>
          </div>
        </fieldset>
      </section>
      {handleCharacteristics()}
       <section>
        <h4>Summary: </h4>
        <input id='form-summary' size='60' maxLength="60" required={true} placeholder={'Example: Best purchase ever!'}></input>
      </section>
      <h4>Full Review:</h4>
      <textarea id='form-body' rows='15' cols='65' maxLength="1000" required={true} placeholder={'Why did you like the product or not?'} onChange={e => setBodyText(e.target.value)} ></textarea>
      <div>
      <small>Minimum required characters left: [{handleMinText()}]</small>
      </div>
      <FileUpload files={files} setFiles={setFiles}/>
      <div>
      <h4>Nickname:</h4>
      <input id='nickname-form' name='nickname' placeholder='Nickname...' required={true} ></input>
      </div>
      <div>
      <h4>Email:</h4>
      <input id='email-form' name='email' placeholder='Enter Email...' required={true} ></input>
      </div>
      <button className='submit-review'type='submit' value='Submit Review'>Submit Review</button>
    </form>
    </Modal>
    </div>
  );
};

AddReviewModule.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  setFormRating: PropTypes.func.isRequired,
  formRating: PropTypes.number.isRequired,
};

export default AddReviewModule;