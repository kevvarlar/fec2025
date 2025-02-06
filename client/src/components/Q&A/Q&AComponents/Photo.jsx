/*global */
/*eslint no-undef: "error"*/
import React from 'react';
import Modal from '../../Reviews/PhotoModal.jsx';
import PropTypes from 'prop-types';
// eslint-disable-next-line react/prop-types, no-unused-vars
const Photo = ({image}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <img data-testid="image" onClick={handleOpen} style={{height: '4em', width: '6em'}} src="https://i.ibb.co/1YscJG4P/Common-Coqui1-web-sized-1.webp" alt="Coqui" border="0"/>
      <Modal isOpen={open} onClose={handleClose}>
        <img data-testid="modal-image" style={{ maxWidth: '100%', maxHeight: 'auto', objectFit: 'contain'}} src="https://i.ibb.co/1YscJG4P/Common-Coqui1-web-sized-1.webp" alt="coqui"/>
      </Modal>
    </>
  );
};

Photo.propTypes = {
  image: PropTypes.string.isRequired
}

export default Photo;