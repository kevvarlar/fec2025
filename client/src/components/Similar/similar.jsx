/*global process*/
/*eslint no-undef: "error"*/
import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
// import {RelatedActions} from '../../store/RelatedSlice.js';
import {ProductActions} from '../../store/ProductSlice.js';
import Carousel from './Carousel.jsx';
import Outfit from './Outfit.jsx';
import Compare from './Compare.jsx';
import swal from 'sweetalert';


const Similar = () => {
  const Product = useSelector(store => store.Product);
  // const Related = useSelector(store => store.Related);
  const dispatch = useDispatch();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [styles, setStyles] = useState([]);
  const [products, setProducts] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [starClicked, setStarClicked] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(null);

  const getStyles = (productIds) => {
    if (!productIds || productIds.length === 0) {
      swal('Product Id undefined in Similar Styles');
      return;
    }
    const styleRequests = productIds.map((pid) =>
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${pid}/styles`, {headers: {Authorization: process.env.NEXT_PUBLIC_AUTH_SECRET}}));
    Promise.all(styleRequests)
      .then((responses) => {
        const allStyles = responses.map((response, index) => ({
          id: productIds[index],
          results: response.data.results
        }));
        setStyles(allStyles);
      })
      .catch((err) => {
        swal('Styles GET failed', err);
      })
  };

  const getProducts = (productIds) => {
    if (!productIds || productIds.length === 0) {
      swal('Product Id undefined in Similar Products');
      return;
    }
    const productRequests = productIds.map((pid) =>
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${pid}`, {headers: {Authorization: process.env.NEXT_PUBLIC_AUTH_SECRET}}));
    Promise.all(productRequests)
      .then((responses) => {
        const allRelatedProducts = responses.map((response, index) => ({
          id: productIds[index],
          ...response.data
        }));
        setProducts(allRelatedProducts);
      })
      .catch((err) => {
        swal('Styles GET failed', err);
      })
  }

  const getRelated = () => {
    setStyles([]);
    setProducts([]);
    setCombinedData([]);

    if (!Product.id) {
      swal('Product Id undefined in Similar Product');
      return;
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${Product.id}/related`, {headers: {Authorization: process.env.NEXT_PUBLIC_AUTH_SECRET}})
    .then((response) => {
      // dispatch(RelatedActions.setRelated(response.data));
      getStyles(response.data);
      getProducts(response.data);
    })
    .catch((err) => {
      swal('Related GET failed', err);
    })
   };

   const getCurrentDetails = (currentId) => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${currentId}/styles`, {headers: {Authorization: process.env.NEXT_PUBLIC_AUTH_SECRET}})
      .then((response) => {
        setCurrentStyle(response.data);
      })
      .catch((err) => {
        swal('current style GET error', err);
      })
    }

    useEffect(() => {
      if (Product.id) {
        setCurrentProduct(Product);
        getRelated();
        getCurrentDetails(Product.id);
      }
    }, [Product.id]);

    useEffect(() => {
      if (products.length > 0 && styles.length > 0) {
        const combined = products.map((product) => {
          const style = styles.find((s) => s.id === product.id);
          return {
            ...product,
            ...style
          };
        });
        setCombinedData(combined);
      }
    }, [products, styles]);

    const handleCardClick = (product) => {
      dispatch(ProductActions.setProduct(product));
    };

    const handleStarClick = (product) => {
      setStarClicked(product);
      setIsOpen(true);
    };

    const handleCloseModal = () => {
      setStarClicked(null);
      setIsOpen(false);
    };



  return (
    <div data-testid="similar">
      <h3>Related Products</h3>
        {combinedData.length > 0 ? (
          <Carousel
          items={combinedData}
          handleCardClick={handleCardClick}
          handleStarClick={handleStarClick}
          currentProduct={currentProduct}
          currentStyle={currentStyle} />
        ) : (
          <div>Loading related products...</div>
        )}
        {modalIsOpen && (
          <Compare
            currentProduct={currentProduct}
            currentStyle={currentStyle}
            starClicked={starClicked}
            onClose={handleCloseModal} />
        )}
        <Outfit
          currentProduct={currentProduct}
          currentStyle={currentStyle}
          handleCardClick={handleCardClick} />
      </div>
  );
};



export default Similar;

