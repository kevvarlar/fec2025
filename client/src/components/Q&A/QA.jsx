/*global process*/
/*eslint no-undef: "error"*/
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from  'react';
import axios from 'axios';
import {QuestionsActions} from '../../store/QuestionsSlice.js';
import Questions from './Q&AComponents/Questions.jsx';
import SearchQuestions from './Q&AComponents/SearchQuestions.jsx';
//Product.product.id
const QA = () => {
  const [refresh, setRefresh] = React.useState({});
  const Product = useSelector(store => store.Product);
  const dispatch = useDispatch();
  useEffect(() => {
    if (Product.product.id) {
      axios.get(process.env.API_URL + `/qa/questions?count=4&product_id=${44500}`,{headers: {Authorization:process.env.AUTH_SECRET} })
      .then((result)=>{
        dispatch(QuestionsActions.setQuestions(result.data.results));
      })
      .catch(() => alert('error while retrieving questions'))
    }
  },[Product.product.id, refresh])

  return (
  <div data-testid="qa">
    <h3>Questions & Answers</h3>
    <SearchQuestions setRefresh={setRefresh}/>
    <br/>
    <Questions setRefresh={setRefresh}/>
  </div>
  );
};


export default QA;