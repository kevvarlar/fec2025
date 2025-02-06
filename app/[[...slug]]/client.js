'use client'
import React from 'react';
import dynamic from 'next/dynamic'
import {Provider} from 'react-redux';
import STORE from '../../client/src/store/Store.js';

const App = dynamic(() => import('../../client/src/components/App'), { ssr: false })

export function ClientOnly({product, overview}) {
  return (
    <Provider store={STORE}>
      <App product={product} overview={overview} logo={'/east_blue_logo.jpg'}/>
    </Provider>
  )
}
