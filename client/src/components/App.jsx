import React, {useEffect}  from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Overview from './Overview/overview.jsx';
import QA from './Q&A/QA.jsx';
import Reviews from './Reviews/Reviews.jsx';
import Similar from './Similar/similar.jsx';
import {ProductActions} from '../store/ProductSlice.js';

const App = () => {
  const Product = useSelector(store => store.Product);
  useEffect(() => {
    axios.get(process.env.API_URL + '/products',{headers: {Authorization:process.env.AUTH_SECRET} })
      .then((result)=>{
        useDispatch(ProductActions.setProduct(result.data[0]));
      })
  },[])


  return(
  <>
    {console.log(Product.product)}
    <Overview/>
    <Similar/>
    <QA/>
    <Reviews/>
  </>
);
}

export default App;