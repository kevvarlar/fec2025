import React from 'react';
import {Provider} from 'react-redux';
import {render, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '../../dist/output.css';
import STORE from '../../store/Store.js';
import Similar from '../../components/Similar/similar.jsx';
import Carousel from '../../components/Similar/Carousel.jsx';
import Compare from '../../components/Similar/Compare.jsx';
import Outfit from '../../components/Similar/Outfit.jsx';
import Hover from '../../components/Similar/Hover.jsx'

describe('Similar', () => {

  it('Should render all non-conditional components of Similar component', () => {
    const Related = render(
      <Provider store={STORE}>
        <Similar />
      </Provider>
    );

    expect(Related.getByTestId('similar')).toBeDefined();

  });

  test('modal shows the children and a close button', () => {

    const handleClose = jest.fn();

    const {getByText} = render(
      <Compare onClose={handleClose}>
        <div>test</div>
      </Compare>
    )

    expect(getByText('test')).toBeTruthy();

    fireEvent.click(getByText(/close/i));

    expect(handleClose).toHaveBeenCalledTimes(1);

  })

  // it('Should render modal after ⭐ click', async () => {
  //   const handleOnClick = jest.fn();
  //   const { getByTestId } = render(<Similar onClick={handleOnClick} />);
  //   const element = getByTestId('star-button');

  //   fireEvent.click(element);

  //   expect(handleOnClick).toBeCalled();
  //   expect(element).toHaveClass('star-button');
  // })
});



