import { ClientOnly } from './client'
import React from 'react';
import axios from 'axios';
/*global process*/
const Page = async () => {
  const product = await axios.get(`${process.env.API_URL}/products/${40344}`,{headers: {Authorization:process.env.AUTH_SECRET} }).then((response) => response.data);
  const overview = await axios.get(process.env.API_URL + `/products/${40344}/styles`,{headers: {Authorization:process.env.AUTH_SECRET} }).then((result)=>{
    if(result.data.results){
      return {gallery: result.data.results[0], picture: result.data.results[0].photos[0].url, styles: result.data.results, price: '$' + product.default_price}
    }
  })
  return <ClientOnly product={product} overview={overview}/>
}

export async function generateStaticParams() {
  return [{slug: ['']}]
}

export default Page;