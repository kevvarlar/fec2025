import React from 'react';
import {render, fireEvent, userEvent, waitFor, act} from '@testing-library/react';

import Overview from '../../components/Overview/overview.jsx';
import MainDisplay from '../../components/Overview/overviewComponents/MainDisplay.jsx';

import GalleryElement from '../../components/Overview/overviewComponents/GalleryElement.jsx';
import Styles from '../../components/Overview/overviewComponents/Styles.jsx';
import ProductForm from '../../components/Overview/overview'
import '@testing-library/jest-dom';
import '../../dist/output.css';
import STORE from '../../store/Store.js';
import {Provider} from 'react-redux';

import {configureStore} from '@reduxjs/toolkit';
import axios from 'axios';

import ProductSlice from '../../store/ProductSlice.js';
import GallerySlice from '../../store/GallerySlice.js';
import StylesSlice from '../../store/StylesSlice.js';
import PictureSlice from '../../store/PictureSlice.js';
import OverviewSlice from '../../store/OverviewSlice.js';
import GallerySelectionSlice from '../../store/GallerySelectionSlice.js';
import {ProductActions} from '../../store/ProductSlice.js';

import {PictureActions} from '../../store/PictureSlice.js';
import {GalleryActions} from '../../store/GallerySlice.js';
import {StylesActions} from '../../store/StylesSlice.js';

import DummyData from './TestData/dummyData.js';




jest.mock('axios');

describe('Overview',()=>{


  beforeEach(() => {
    const mockResponse = { data: {message : 'Grabbed'}};
    axios.get.mockResolvedValue(mockResponse);
  })

  it('Should render non-conditional subcomponents of Overview', () => {
    const OverviewTest = render(
      <Provider store={STORE}>
        <Overview/>
      </Provider>
    );

    expect(OverviewTest.queryByTestId('overview')).toBeDefined();
    expect(OverviewTest.queryByTestId('mainDisplay')).toBeDefined();

  });
  it('Should render images in galleryElement when images are provided', () => {
    const GalleryElementTest = render(
      <Provider store={STORE}>
        <GalleryElement image= {'https://pbs.twimg.com/media/GSsUqwGXsAA-cD_.jpg:large'} index = {0}/>
      </Provider>
    );

    expect(GalleryElementTest.getByTestId('galleryPicture0')).toBeDefined();


  });

  it('Should render placeholder if the image provided is an invalid type', () => {
    const GalleryElementTest = render(
      <Provider store={STORE}>
        <GalleryElement image= {7} index = {0}/>
      </Provider>
    );

    expect(GalleryElementTest.getByTestId('galleryPicturePlaceholder')).toBeDefined()


  });



  it('Should render GalleryAlt when Main Display is clicked on twice ', async () => {//to realistically run the majority of these tests, a mock API request seems to be the only way...

    const dummyStyles = DummyData.dummyStyles.results;
    const dummyGallery = DummyData.dummyStyles.results[0];
    const dummyProduct = DummyData.dummyProduct;
    const dummyPicture = DummyData.dummyStyles.results[0].photos[0].url;


    const mockStore = configureStore({
      reducer: {
        Product: ProductSlice.reducer,
        OverviewData: OverviewSlice.reducer,
        GalleryData: GallerySlice.reducer,
        PictureData: PictureSlice.reducer,
        StylesData: StylesSlice.reducer,
        GallerySelection: GallerySelectionSlice.reducer,
      }
    })

    mockStore.dispatch(PictureActions.setPicture(dummyPicture));
    mockStore.dispatch(ProductActions.setProduct(dummyProduct));
    mockStore.dispatch(GalleryActions.setGallery(dummyGallery));
    mockStore.dispatch(StylesActions.setStyles(dummyStyles));


    const Apple = render(
      <Provider store={mockStore}>
        <MainDisplay/>
      </Provider>
    );
    const mainDisplay = Apple.getByTestId("mainDisplay");


    await waitFor(()=>{
      fireEvent.click(mainDisplay);
      //Apple.getByTestId("mainDisplay").click();

    })
    await waitFor(()=>{
      fireEvent.click(mainDisplay);
      //Apple.getByTestId("mainDisplay").click();

    })

    expect(Apple.getByTestId("galleryAlt")).toBeDefined();
    expect(Apple.getByTestId("mainDisplayModal")).toBeDefined();

  });

  it('Should change gallery elements displayed when buttons clicked ', async () => {//to realistically run the majority of these tests, a mock API request seems to be the only way...

    const dummyStyles = DummyData.dummyStyles.results;
    const dummyGallery = DummyData.dummyStyles.results[0];
    const dummyProduct = DummyData.dummyProduct;
    const dummyPicture = DummyData.dummyStyles.results[0].photos[0].url;


    const mockStore = configureStore({
      reducer: {
        Product: ProductSlice.reducer,
        OverviewData: OverviewSlice.reducer,
        GalleryData: GallerySlice.reducer,
        PictureData: PictureSlice.reducer,
        StylesData: StylesSlice.reducer,
        GallerySelection: GallerySelectionSlice.reducer,
      }
    })

    mockStore.dispatch(PictureActions.setPicture(dummyPicture));
    mockStore.dispatch(ProductActions.setProduct(dummyProduct));
    mockStore.dispatch(GalleryActions.setGallery(dummyGallery));
    mockStore.dispatch(StylesActions.setStyles(dummyStyles));


    const Apple = render(
      <Provider store={mockStore}>
        <MainDisplay/>
      </Provider>
    );
    const mainDisplay = Apple.getByTestId("mainDisplay");
    const upButton = Apple.getByTestId("GalleryUpArrow")
    const downButton = Apple.getByTestId("GalleryDownArrow")

    expect(Apple.getByTestId("galleryPicture0")).toBeDefined();
    await waitFor(()=>{
      fireEvent.click(downButton);


    })

    expect(Apple.queryByTestId("galleryPicture0")).toEqual(null);

    await waitFor(()=>{
      fireEvent.click(upButton);


    })
    expect(Apple.queryByTestId("galleryPicture0")).toBeDefined();

  });

  it('Should zoom in on mainDisplayModal when double clicked and shift between gallery Alt elements', async () => {//to realistically run the majority of these tests, a mock API request seems to be the only way...

    const dummyStyles = DummyData.dummyStyles.results;
    const dummyGallery = DummyData.dummyStyles.results[0];
    const dummyProduct = DummyData.dummyProduct;
    const dummyPicture = DummyData.dummyStyles.results[0].photos[0].url;


    const mockStore = configureStore({
      reducer: {
        Product: ProductSlice.reducer,
        OverviewData: OverviewSlice.reducer,
        GalleryData: GallerySlice.reducer,
        PictureData: PictureSlice.reducer,
        StylesData: StylesSlice.reducer,
        GallerySelection: GallerySelectionSlice.reducer,
      }
    })

    mockStore.dispatch(PictureActions.setPicture(dummyPicture));
    mockStore.dispatch(ProductActions.setProduct(dummyProduct));
    mockStore.dispatch(GalleryActions.setGallery(dummyGallery));
    mockStore.dispatch(StylesActions.setStyles(dummyStyles));


    const Apple = render(
      <Provider store={mockStore}>
        <MainDisplay/>
      </Provider>
    );
    const mainDisplay = Apple.getByTestId("mainDisplay");


    await waitFor(()=>{
      fireEvent.click(mainDisplay);
      //Apple.getByTestId("mainDisplay").click();

    })
    await waitFor(()=>{
      fireEvent.click(mainDisplay);
      //Apple.getByTestId("mainDisplay").click();

    })
    await waitFor(()=>{
      fireEvent.mouseEnter(Apple.getByTestId("mainDisplayModal"));
      //Apple.getByTestId("mainDisplay").click();

    })
    await waitFor(()=>{
      fireEvent.mouseMove(Apple.getByTestId("mainDisplayModal"));
      //Apple.getByTestId("mainDisplay").click();

    })
    const style = Apple.getByTestId("mainDisplayModal").style._values;
    const testStyle = {
      height: '100%',
      width: '100%',
      position: 'absolute',
      'transform-origin': 'NaN% NaN%',
      transform: 'scale(2.5)',
      cursor: 'crosshair'
    }

    expect(JSON.stringify(style) === JSON.stringify(testStyle)).toBeTruthy();
    const leftButton = Apple.getByTestId("GalleryLeftArrow")
    const rightButton = Apple.getByTestId("GalleryRightArrow")


    expect(Apple.getByTestId("galleryAltPicture0")).toBeDefined();
    await waitFor(()=>{
      fireEvent.click(rightButton);
      //Apple.getByTestId("mainDisplay").click();

    })
    expect(Apple.queryByTestId("galleryAltPicture0")).toEqual(null);
    //expect(Apple.getByTestId("galleryPicture0")).toBeDefined();
    await waitFor(()=>{
      fireEvent.click(leftButton);
      //Apple.getByTestId("mainDisplay").click();

    })
    expect(Apple.getByTestId("galleryAltPicture0")).toBeDefined();
    //expect(Apple.getByTestId("galleryPicture0")).toBeDefined();
  });


  it('Should change display based on style selected ', async () => {//to realistically run the majority of these tests, a mock API request seems to be the only way...

    const dummyStyles = DummyData.dummyStyles.results;
    const dummyGallery = DummyData.dummyStyles.results[0];
    const dummyProduct = DummyData.dummyProduct;
    const dummyPicture = DummyData.dummyStyles.results[0].photos[0].url;


    const mockStore = configureStore({
      reducer: {
        Product: ProductSlice.reducer,
        OverviewData: OverviewSlice.reducer,
        GalleryData: GallerySlice.reducer,
        PictureData: PictureSlice.reducer,
        StylesData: StylesSlice.reducer,
        GallerySelection: GallerySelectionSlice.reducer,
      }
    })

    mockStore.dispatch(PictureActions.setPicture(dummyPicture));
    mockStore.dispatch(ProductActions.setProduct(dummyProduct));
    mockStore.dispatch(GalleryActions.setGallery(dummyGallery));
    mockStore.dispatch(StylesActions.setStyles(dummyStyles));


    const Apple = render(
      <Provider store={mockStore}>
        <MainDisplay/>
        <Styles/>
      </Provider>
    );
    Apple.getByTestId("mainDisplay");

    const firstStyle = mockStore.getState().GalleryData.Gallery.style_id;
    act(()=>{
      Apple.getByTestId('stylePicture2').click();
    })

    const secondStyle = mockStore.getState().GalleryData.Gallery.style_id;
    expect(firstStyle).not.toBe(secondStyle);


  });


  it('Should show OUT OF STOCK when no quantity is available', async () => {//to realistically run the majority of these tests, a mock API request seems to be the only way...

    const dummyStyles = DummyData.dummyStyles.results;
    const dummyGallery = DummyData.dummyStyles.results[0];
    const dummyProduct = DummyData.dummyProduct;
    const dummyPicture = DummyData.dummyStyles.results[0].photos[0].url;

    const mockResponse = { data: {message : 'Grabbed'}};
    axios.get.mockResolvedValue(mockResponse);

    const mockStore = configureStore({
      reducer: {
        Product: ProductSlice.reducer,
        OverviewData: OverviewSlice.reducer,
        GalleryData: GallerySlice.reducer,
        PictureData: PictureSlice.reducer,
        StylesData: StylesSlice.reducer,
        GallerySelection: GallerySelectionSlice.reducer,
      }
    })

    mockStore.dispatch(PictureActions.setPicture(dummyPicture));
    mockStore.dispatch(ProductActions.setProduct(dummyProduct));
    mockStore.dispatch(GalleryActions.setGallery(dummyGallery));
    mockStore.dispatch(StylesActions.setStyles(dummyStyles));


    const Apple = render(
      <Provider store={mockStore}>
        <ProductForm/>
      </Provider>
    );


    const formSizes = Apple.getByTestId("formSizes");


    await waitFor(() => fireEvent.change(formSizes, {target: {value: 'M'}}));
    const formQuantities = Apple.getByTestId("formQuantities");



    expect(formQuantities).toHaveValue('OUT OF STOCK');


  });
  // it('should list a product as OUT OF STOCK when quantity is 0', () => {
  //   const Apple = render(
  //     <Provider store={STORE}>
  //       <App/>
  //     </Provider>
  //   );

  //   expect(.getByTestId('galleryPicturePlaceholder')).toBeDefined()


  // });

});
