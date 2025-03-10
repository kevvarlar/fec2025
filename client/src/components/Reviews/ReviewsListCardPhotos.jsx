import React from 'react';
import PhotoModule from './PhotoModule.jsx';
import PropTypes from 'prop-types';

const ReviewsListCardPhotos = ({ photo }) => {
  const [size, setSize] = React.useState('down');
  const handleSize = () => {
    setSize(size === 'down' ? 'up' : 'down');
  }
  if (size === 'down') {
    return (
      <img
      style={{ height:'50px'}}
      src={photo.url}
      onClick={() => handleSize()}
      />
    )
  } else {
    return (
      <PhotoModule url={photo.url} handleSize={handleSize}/>
    )
  }
}

ReviewsListCardPhotos.propTypes = {
  photo: PropTypes.object.isRequired,
};

export default ReviewsListCardPhotos;