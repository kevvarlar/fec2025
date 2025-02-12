/*global process*/
/*eslint no-undef: "error"*/
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {QuestionsActions} from '../../store/QuestionsSlice.js';
import Questions from './Q&AComponents/Questions.jsx';
import SearchQuestions from './Q&AComponents/SearchQuestions.jsx';
import swal from 'sweetalert';
import CreateQuestion from './Q&AComponents/CreateQuestion.jsx';

const QA = () => {
  const [refresh, setRefresh] = React.useState({});
  const Search = useSelector(store => store.Search);
  const Product = useSelector(store => store.Product);
  const [questions, setQuestions] = React.useState([])
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (Product.id) {
      axios.get(process.env.API_URL + `/qa/questions?count=2147483647&product_id=${Product.id}`,{headers: {Authorization:process.env.AUTH_SECRET} })
        .then((result)=>{
          setQuestions(result.data.results);
          const action = result.data.results.slice(0, 4);
          dispatch(QuestionsActions.setQuestions(action));
        })
        .catch((err) => {
          if (err.response && err.response.status === 429) {
            swal('Sorry!', 'Traffic is full please refresh your browser', 'warning');
          } else {
            swal('Error!', 'Error while retrieving questions', 'error');
          }
        })
    }
  },[Product.id, refresh])

  return (
    <>
      <div className="qa" data-testid="qa">
        <h3>Questions & Answers</h3>
        <SearchQuestions/>
        <br/>
        <Questions refresh={refresh} setRefresh={setRefresh}/>
        {!Search ? <CreateQuestion questions={questions} setQuestions={setQuestions} setRefresh={setRefresh}/> : null}
      </div>
      <br/>
    </>
  );
};


export default QA;