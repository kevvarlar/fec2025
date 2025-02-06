/*global describe, it, expect, beforeEach, beforeAll, jest, process*/
/*eslint no-undef: "error"*/
import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../../dist/output.css';
import STORE from '../../store/Store.js';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import Reviews from '../../components/Reviews/Reviews.jsx';
import axios from 'axios';
import ProductSlice from '../../store/ProductSlice.js';
import ReviewsSlice from '../../store/ReviewsSlice.js';
import ReviewsMetaSlice from '../../store/ReviewsMetaSlice.js';
import ReviewModal from '../../components/Reviews/ReviewModal.jsx';
import AddReviewModule from '../../components/Reviews/AddReviewModule.jsx';
import FileUpload from '../../components/Reviews/FileUpload.jsx';
import ReviewsListCard from '../../components/Reviews/ReviewsListCard.jsx';
import ModalComponent from '../../components/Reviews/PhotoModule.jsx';

jest.mock('axios');
jest.mock('../../components/Reviews/StarRatings', () => {
  return function StarRatings() {
    return <div>star ratings</div>;
  }
});

beforeAll(() => {
  // Mock URL.createObjectURL before tests start
  window.URL.createObjectURL = jest.fn().mockImplementation(() => 'https://www.image.com/frog');
});

beforeEach(() => {
  jest.clearAllMocks()
});

describe('Review',()=>{

  it('Should render all non-conditional components of Review', async () => {
    const Review = await render(
      <Provider store={STORE}>
        <Reviews />
      </Provider>
    );

    expect(Review.getByTestId('list-view')).toBeDefined();
  });
});

describe('Review\'s Components', () => {
  it('Should display data from Redux store', async () => {

    const mockProduct = [
      {
        "id": 1,
        "name": "Camo Onesie",
        "slogan": "Blend in to your crowd",
        "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
        "category": "Jackets",
        "default_price": "140"
      }
    ];

    const mockReviewsData = {
      "product": "2",
      "page": 1,
      "count": 5,
      "results": [
        {
          "review_id": 3,
          "rating": 4,
          "summary": "I am liking these glasses",
          "recommend": false,
          "response": "Glad you're enjoying the product!",
          "body": "They are very dark. But that's good because I'm in very sunny spots",
          "date": "2019-06-23T00:00:00.000Z",
          "reviewer_name": "bigbrotherbenjamin",
          "helpfulness": 5,
          "photos": [],
        },
      ]
    };

    const mockReviewsMetaData = {
      "product_id": "2",
      "ratings": {
        4: 2,
      },
      "recommended": {
        0: 5
      },
      "characteristics": {
        "Size": {
          "id": 14,
          "value": "4.0000"
        }
      }
    }

    const mockStore = configureStore({
      reducer: {
        Product: ProductSlice.reducer,
        ReviewsData: ReviewsSlice.reducer,
        ReviewsMeta: ReviewsMetaSlice.reducer
      },
      preloadedState: {
        Product: {id: 40344 },
        ReviewsData: {
          "product": "2",
          "page": 0,
          "count": 5,
          "results": [{ review_id: 1}, { review_id: 2}]
        },
        ReviewsMeta: { product_id: 2 }
      }
    });

    axios.get.mockResolvedValueOnce({ data: mockProduct });
    axios.get.mockResolvedValueOnce({ data: mockReviewsData });
    axios.get.mockResolvedValueOnce({ data: mockReviewsMetaData });
    let Review;
    await act(async () => {
      Review = render(
        <Provider store={mockStore}>
        <Reviews />
      </Provider>
    )});


    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(process.env.API_URL + `/reviews/meta`,{params: {
      "product_id": 40344,
    },
    headers: {
      Authorization:process.env.AUTH_SECRET
    } }));

    await waitFor(() => expect(Review.getByTestId('review-view')).toBeDefined());

  });

  it('Should open the Photo Modal when clicked, and close when onClose is clicked', async () => {

    const mockStore = configureStore({
      reducer: {
        Product: ProductSlice.reducer,
        ReviewsData: ReviewsSlice.reducer,
        ReviewsMeta: ReviewsMetaSlice.reducer
      },
      preloadedState: {
        Product: {id: 40344 },
        ReviewsData: {
          "product": "2",
          "page": 0,
          "count": 5,
          "results": [{ review_id: 1}, { review_id: 2}]
        },
        ReviewsMeta: { product_id: 2 }
      }
    });

    const mockFunc = jest.fn();

    let reviewOpenModal;
    await act(async () => {
      reviewOpenModal = render(
        <Provider store={mockStore}>
        <ReviewModal isOpen={true} onClose={mockFunc} childrn={['1','2','3']} />
      </Provider>
    )});

    const image = reviewOpenModal.getByTestId('reviewmodal-view');
    expect(image).toBeDefined();
    waitFor(() => expect(reviewOpenModal.findByTestId('reviewmodal-view')).toHaveTextContent("['1','2','3']"));
    waitFor(() => fireEvent.click(reviewOpenModal.getElementById('modal-close')));
    waitFor(() => expect(mockFunc).toHaveBeenCalled());
  });
  it('should not open if not clicked', async () => {

    const mockStore = configureStore({
      reducer: {
        Product: ProductSlice.reducer,
        ReviewsData: ReviewsSlice.reducer,
        ReviewsMeta: ReviewsMetaSlice.reducer
      },
      preloadedState: {
        Product: {id: 40344 },
        ReviewsData: {
          "product": "2",
          "page": 0,
          "count": 5,
          "results": [{ review_id: 1}, { review_id: 2}]
        },
        ReviewsMeta: { product_id: 2 }
      }
    });

    const mockFunc = jest.fn();

    let reviewCloseModal;
    await act(async () => {
      reviewCloseModal = render(
        <Provider store={mockStore}>
        <ReviewModal isOpen={false} onClose={mockFunc} childrn={['1','2','3']} />
      </Provider>
    )});

    const image = reviewCloseModal.queryByTestId('reviewmodal-view');
    expect(image).toBeNull();
  })
  it('should open AddReviewModule', async () => {
    const mockStore = configureStore({
      reducer: {
        Product: ProductSlice.reducer,
        ReviewsData: ReviewsSlice.reducer,
        ReviewsMeta: ReviewsMetaSlice.reducer
      },
      preloadedState: {
        Product: {id: 40344 },
        ReviewsData: {
          "product": "2",
          "page": 0,
          "count": 5,
          "results": [{ review_id: 1}, { review_id: 2}]
        },
        ReviewsMeta: { product_id: 2 }
      }
    });

    const mockCloseFunc = jest.fn();
    const mockSetFormRating = jest.fn();
    let addReviewModule;
    await act(async () => {
      addReviewModule = render(
        <Provider store={mockStore}>
        <AddReviewModule modalIsOpen={true} closeModal={mockCloseFunc} setFormRating={mockSetFormRating} formRating={4} />
      </Provider>
    )});

    const image = addReviewModule.findByTestId('AddReviewModule-view');
    expect(image).toBeDefined();

    waitFor(async () => {
      expect(image).toHaveTextContent("Please Rate:");
    });
  });
  it('should open FileUpload', async () => {
    const mockStore = configureStore({
    reducer: {
      Product: ProductSlice.reducer,
      ReviewsData: ReviewsSlice.reducer,
      ReviewsMeta: ReviewsMetaSlice.reducer
    },
    preloadedState: {
      Product: {id: 40344 },
      ReviewsData: {
        "product": "2",
        "page": 0,
        "count": 5,
        "results": [{ review_id: 1}, { review_id: 2}]
      },
      ReviewsMeta: { product_id: 2 }
    }
  });

    let mockFun = jest.fn();
    let fileUpload;
    await act(async () => {
      fileUpload = render(
        <Provider store={mockStore}>
        <FileUpload files={[]} setFiles={mockFun}/>
      </Provider>
    )});

    expect(fileUpload.findByTestId('fileupload-view')).toBeDefined();
  })
  it('should delete files when button is clicked', async () => {
    let setFiles = jest.fn();
    const mockStore = configureStore({
    reducer: {
      Product: ProductSlice.reducer,
      ReviewsData: ReviewsSlice.reducer,
      ReviewsMeta: ReviewsMetaSlice.reducer
    },
    preloadedState: {
      Product: {id: 40344 },
      ReviewsData: {
        "product": "2",
        "page": 0,
        "count": 5,
        "results": [{ review_id: 1}, { review_id: 2}]
      },
      ReviewsMeta: { product_id: 2 }
    }
  });

    let fileUpload;
    const file = new File(['file content'], 'ohSweetChildOMine.jpg', { type: 'image/plain'});
    await act(async () => {
      fileUpload = render(
        <Provider store={mockStore}>
        <FileUpload files={[{file: file, thumbnail: 'thumbnail'}]} setFiles={setFiles}/>
      </Provider>
    )});

    const fileUploadDelButton = fileUpload.getByTestId('removefile-button');

    fireEvent.click(fileUploadDelButton);

    expect(setFiles).toHaveBeenCalled();
  })

  it('should accept files in FileUpload', async () => {
    const mockStore = configureStore({
    reducer: {
      Product: ProductSlice.reducer,
      ReviewsData: ReviewsSlice.reducer,
      ReviewsMeta: ReviewsMetaSlice.reducer
    },
    preloadedState: {
      Product: {id: 40344 },
      ReviewsData: {
        "product": "2",
        "page": 0,
        "count": 5,
        "results": [{ review_id: 1}, { review_id: 2}]
      },
      ReviewsMeta: { product_id: 2 }
    }
  });

    let mockFun = jest.fn();
    let fileUpload;
    await act(async () => {
      fileUpload = render(
        <Provider store={mockStore}>
        <FileUpload files={[]} setFiles={mockFun}/>
      </Provider>
    )});
    const file = new File(['file content'], 'example.txt', { type: 'image/plain' })
    const fileUploadInput = fileUpload.getByTestId('fileupload-input');

    fireEvent.change(fileUploadInput, {target: {files: [file] } });

    expect(fileUploadInput.value).toBe('');
  })
  it('should reject non image files in FileUpload', async () => {
    const mockStore = configureStore({
    reducer: {
      Product: ProductSlice.reducer,
      ReviewsData: ReviewsSlice.reducer,
      ReviewsMeta: ReviewsMetaSlice.reducer
    },
    preloadedState: {
      Product: {id: 40344 },
      ReviewsData: {
        "product": "2",
        "page": 0,
        "count": 5,
        "results": [{ review_id: 1}, { review_id: 2}]
      },
      ReviewsMeta: { product_id: 2 }
    }
  });

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    let mockFun = jest.fn();
    let fileUpload;
    await act(async () => {
      fileUpload = render(
        <Provider store={mockStore}>
        <FileUpload files={[]} setFiles={mockFun}/>
      </Provider>
    )});
    const file = new File(['file content'], 'example.txt', { type: 'text/plain' });

    const fileUploadInput = fileUpload.getByTestId('fileupload-input');

    fireEvent.change(fileUploadInput, {target: {files: [file] } });

    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('Only image files are allowed.');
  })

  it('should load ReviewsListCard', async () => {
    const mockStore = configureStore({
    reducer: {
      Product: ProductSlice.reducer,
      ReviewsData: ReviewsSlice.reducer,
      ReviewsMeta: ReviewsMetaSlice.reducer
    },
    preloadedState: {
      Product: {id: 40344 },
      ReviewsData: {
        "product": "2",
        "page": 0,
        "count": 5,
        "results": [{ review_id: 1}, { review_id: 2}]
      },
      ReviewsMeta: { product_id: 2 }
    }
  });

    let reviewsListCard;
    await act(async () => {
      reviewsListCard = render(
        <Provider store={mockStore}>
        <ReviewsListCard review={{
          "review_id": 1280718,
          "rating": 4,
          "summary": "Never Gonna",
          "recommend": true,
          "response": null,
          "body": "give you up",
          "date": "2023-11-27T00:00:00.000Z",
          "reviewer_name": "Rick",
          "helpfulness": 3,
          "photos": [{
                  "id": 2459184,
                  "url": "https://i.insider.com/602ee9ced3ad27001837f2ac?width=1000%26format=jpeg%26auto=webp"
          }]}}/>
      </Provider>
    )});

    expect(reviewsListCard.getByTestId('reviewslistcard-view')).toBeDefined();
  })

  it('should load PhotoModule', async () => {
    const mockStore = configureStore({
    reducer: {
      Product: ProductSlice.reducer,
      ReviewsData: ReviewsSlice.reducer,
      ReviewsMeta: ReviewsMetaSlice.reducer
    },
    preloadedState: {
      Product: {id: 40344 },
      ReviewsData: {
        "product": "2",
        "page": 0,
        "count": 5,
        "results": [{ review_id: 1}, { review_id: 2}]
      },
      ReviewsMeta: { product_id: 2 }
    }
  });

    let mockFun = jest.fn();
    let photoModule;
    await act(async () => {
      photoModule = render(
        <Provider store={mockStore}>
        <ModalComponent url={'mockurl.com'} handleSize={mockFun}/>
      </Provider>
    )});

    expect(photoModule).toBeDefined();
  })
});