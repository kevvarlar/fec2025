/*global process*/
/*eslint no-undef: "error"*/
import React, {useEffect}  from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import ReviewsSidebar from './ReviewsSidebar.jsx'
import {ReviewsActions} from '../../store/ReviewsSlice.js';
import ReviewsList from './ReviewsList.jsx';
import {ReviewsMetaActions} from '../../store/ReviewsMetaSlice.js';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

const Reviews = ({ currPage, setCurrPage }) => {
  const Product = useSelector(store => store.Product);

  const [sort, setSort] = React.useState("relevant");
  const dispatch = useDispatch();

  useEffect(() => {
    if (Product.id) {
      axios.get(process.env.API_URL + `/reviews/`,{params: {
        product_id: Product.id,
        page: currPage,
        sort: sort,
      },
      headers: {
        Authorization:process.env.AUTH_SECRET
      } })
      .then((response)=>{
        dispatch(ReviewsActions.setReviews(response.data.results));
      })
      .catch((err) => {
        if (err.response && err.response.status === 429) {
          swal('Sorry!', 'Traffic is full please refresh your browser', 'warning');
        } else {
          swal('Error!', 'Error while retrieving questions', 'error');
        }
      })

      axios.get(process.env.API_URL + `/reviews/meta`,{params: {
        product_id: Product.id,
      }, headers: {Authorization:process.env.AUTH_SECRET} })
      .then((response)=>{
        dispatch(ReviewsMetaActions.setReviewsMeta(response.data));
      })
      .catch((err) => {
        if (err.response && err.response.status === 429) {
          swal('Sorry!', 'Traffic is full please refresh your browser', 'warning');
        } else {
          swal('Error!', 'Error while retrieving questions', 'error');
        }
      })
    }

  },[Product.id, currPage, sort]);

  return (
    <div data-testid="review-view" className="review-container">
      <div data-testid='metaData-view' className="sidebar">
        <ReviewsSidebar />
      </div>
      <div data-testid='reviewCards-view' className="reviews-list">
        <ReviewsList key={Product.id} setCurrPage={setCurrPage} currPage={currPage} setSort={setSort} sort={sort}/>
      </div>
    </div>
  )
}

Reviews.propTypes = {
  currPage: PropTypes.number.isRequired,
  setCurrPage: PropTypes.func.isRequired,
};


export default Reviews;