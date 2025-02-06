
/*global process*/
/*eslint no-undef: "error"*/
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import React, {useState, lazy, Suspense, useEffect}  from 'react';
import {PictureActions} from '../../store/PictureSlice.js';
import {GalleryActions} from '../../store/GallerySlice.js';
import {StylesActions} from '../../store/StylesSlice.js';
const MainDisplay = lazy(() => import('./overviewComponents/MainDisplay.jsx'));
import Share from './overviewComponents/Share.jsx'

import Styles from './overviewComponents/Styles.jsx';
import ProductForm from './overviewComponents/ProductForm.jsx';
import StarDisplay from './overviewComponents/StarDisplay.jsx';


// import star from '../../../img/stars/Star.png'
// import halfStar from '../../../img/stars/halfStar.png'
// import threeQuarterStar from '../../../img/stars/threeQuarterStar.png'
// import quarterStar from '../../../img/stars/quarterStar.png'

const Overview = ({overview}) => {
  const dispatch = useDispatch();
  const Product = useSelector(store => store.Product);

  const ReviewsData = useSelector(store => store.ReviewsData);


  const GalleryData = useSelector(store => store.GalleryData);
  const [price, setPrice] = useState('');
  const [score, setScore] = useState(0);


  useEffect(() => {
    dispatch(GalleryActions.setGallery(overview.gallery));
    dispatch(PictureActions.setPicture(overview.picture));
    dispatch(StylesActions.setStyles(overview.styles));
    setPrice(overview.price);
  }, [])

  useEffect(() => {
    if(ReviewsData){

      var scoreTemp = 0;
      for(var i = 0; i < ReviewsData.length;i++) {
        scoreTemp+=ReviewsData[i].rating;
      }
      scoreTemp/=ReviewsData.length;
      setScore(scoreTemp);

    }
  }
  ,[ReviewsData]);
  useEffect(() => {

    if(Product.id){
      axios.get(process.env.NEXT_PUBLIC_API_URL + `/products/${Product.id}/styles`,{headers: {Authorization:process.env.NEXT_PUBLIC_AUTH_SECRET} })
        .then((result)=>{

          if(result.data.results){
            dispatch(GalleryActions.setGallery(result.data.results[0]));
            dispatch(PictureActions.setPicture(result.data.results[0].photos[0].url));
            dispatch(StylesActions.setStyles(result.data.results));
            setPrice('$' + Product.default_price);
          }

        })
    }
  },[Product.id]);

  useEffect(() => {

    setPrice('$' + Product.default_price);

    if(GalleryData.Gallery.sale_price){
      setPrice(
      <p style={{color:'red'}}><s>{Product.default_price}</s>&nbsp;
      {GalleryData.Gallery.sale_price} </p>
    )

    }
  },[GalleryData]);

  if(GalleryData.Gallery.length === 0){
    return (  <div id="overview" data-testid="overview"
      style={{
        // background: "linear-gradient(rgb(27, 100, 60), rgb(25, 77, 146))",
        height: 800,
        width: "100%",
        margin: "auto",
        padding: "2%",
        // border: "2px solid #000",
        borderRadius: "10px",
        // boxShadow: "2px solid black",
        float: "left",



    }}>
    <div id='display' style={{height: "80%", width: "40%", float: "left",}}>
    <MainDisplay  />
    <Share />
    </div>

    {/* <p>price: {price}</p> */}


    <div className="clearfix"></div>




  </div>);
  }

  return(
  <div id="overview" data-testid="overview"
      style={{
        // background: "linear-gradient(rgb(27, 100, 60), rgb(25, 77, 146))",
        height: 800,
        width: "100%",
        margin: "auto",
        padding: "2%",
        // border: "2px solid #000",
        borderRadius: "10px",
        // boxShadow: "2px solid black",
        float: "left",



    }}>
    <div id='display' style={{height: "80%", width: "40%", float: "left",}}>
    <Suspense fallback={<div> it do be loadin </div>}>
      <MainDisplay  />
    </Suspense>
    </div>
    <StarDisplay score={score} />
    <button  onClick={()=>{document.getElementsByClassName("review-container")[0].scrollIntoView();}}>Reviews </button>&nbsp;
    <h3>{Product.category}</h3>
    <h2>{Product.name}</h2>
    {/* <p>price: {price}</p> */}
    {price}
    <Styles  id='styles' />
    <ProductForm/>
    <div className="clearfix"></div>


    <p>{Product.slogan}</p>
    <p>{Product.description}</p>


    <Share />
  </div>
);
}

export default Overview;