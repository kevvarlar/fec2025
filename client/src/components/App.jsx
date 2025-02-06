/*global*/
/*eslint no-undef: "error"*/
import React, { lazy, useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Overview from './Overview/overview.jsx';
import {ProductActions} from '../store/ProductSlice.js';
import PropTypes from 'prop-types';
const QA = lazy(() => import('./Q&A/QA.jsx'));
const Reviews = lazy(() => import('./Reviews/Reviews.jsx'));
const Similar = lazy(() => import('./Similar/similar.jsx'));
const swal = lazy(() => import('sweetalert'));

const App = ({product, overview, logo}) => {
  const dispatch = useDispatch();
  const [currPage, setCurrPage] = React.useState(1);
  const Product = useSelector(store => store.Product);
  // if (product.error) {
  //   if (product.error.response?.status === 429) {
  //     swal('Sorry!', 'Traffic is full please refresh your browser', 'warning');
  //   } else {
  //     swal('Error!', 'Error while retrieving questions', 'error');
  //   }
  // }

  useEffect(() => {
    if (Product.id) {
      setCurrPage(1);
    }
    } ,[Product.id])

  useEffect(() => {
    dispatch(ProductActions.setProduct(product));
  }, [])

  return(
  <div data-testid="app">
    <div className="logo-container">
      <img className="logo" src={logo} alt="East Blue Logo" />
    </div>
    <div className="app-content">
    <Overview overview={overview}/>
    <Similar/>
    <QA/>
    <Reviews currPage={currPage} setCurrPage={setCurrPage} />
    </div>
  </div>
  );
}

App.propTypes = {
  product: PropTypes.object,
  logo: PropTypes.string,
}

export default App;
