/*global describe, it, expect, jest, process, beforeEach*/
/*eslint no-undef: "error"*/
import React from 'react';
import {render, waitFor, act} from '@testing-library/react';
import App from '../components/App.jsx';
import '@testing-library/jest-dom'
import '../../dist/output.css'
import STORE from '../store/Store.js';
import {Provider} from 'react-redux';
import axios from 'axios';

jest.mock('axios');

describe('App',()=>{

  beforeEach(() => {
    const mockResponse = { data: {message : 'Grabbed'}};
    axios.get.mockResolvedValue(mockResponse);
  })

  it('Should render app and the four main components', async () => {
    var Apple;
    await act( async () => Apple = render(
      <Provider store={STORE}>
        <App/>
      </Provider>));
    expect(Apple.getByTestId('app')).toBeDefined();

    //expect(Apple.getByTestId('overview')).toBeDefined();

    expect(Apple.getByTestId('similar')).toBeDefined();

    expect(Apple.getByTestId('qa')).toBeDefined();

    expect(Apple.getByTestId('review-view')).toBeDefined();
  });

  it('Should make an initial axios request', async () => {
    await act( async () => render(
    <Provider store={STORE}>
      <App/>
    </Provider>));

    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(axios.get).toHaveBeenCalledWith(`${process.env.API_URL}/products/40344`,{headers: {Authorization:process.env.AUTH_SECRET} });

  })
});