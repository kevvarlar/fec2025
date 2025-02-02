import React, {useState, useEffect}  from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {ProductActions} from '../../../store/ProductSlice.js';

import GalleryElement from './GalleryElement.jsx';

import {GalleryActions} from '../../../store/GallerySlice.js';



const Gallery = () => {
  const GalleryData = useSelector(store => store.GalleryData);
  const [GallerySelection, GallerySelectionSet] = useState(0);
  const [arrows, activateArrows] = useState([null,null]);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [checkmark, checkmarkSet] = useState(null);
  const maxLength = 5



  useEffect(() => {
    if(GalleryData.Gallery.photos !== undefined){
      if(displayedIndex> GalleryData.Gallery.photos.length){
        setDisplayedIndex(0);
      }
      if(GalleryData.Gallery.photos.length > maxLength){
        activateArrows([
          <button type="button" key="GalleryUpArrow" onClick={()=>{

            if(GallerySelection>0){

              GallerySelectionSet(GallerySelection - 1);
            }
          }}>
            &uarr;
          </button>,
          <button type="button" key="GalleryDownArrow" onClick={()=>{
            if(GallerySelection<(GalleryData.Gallery.photos.length - maxLength)){
              GallerySelectionSet(GallerySelection + 1);
            }
          }}>
            &darr;
          </button>
        ]);
      }
    }
  },[GalleryData, GallerySelection]);




  if(GalleryData.Gallery.photos !== undefined){

    return(
      <div id='gallery'>
        {arrows[0]}
        {GalleryData.Gallery.photos.map((pic, index)=>{
          if(index >= GallerySelection && index < GallerySelection+maxLength){


          return (
          <GalleryElement image={pic.thumbnail_url} index={index} setDisplayedIndex={setDisplayedIndex} target={displayedIndex} setTarget={setDisplayedIndex} key={index}/>
        );}})}
        {arrows[1]}

      </div>
    );
  }
}



export default Gallery;