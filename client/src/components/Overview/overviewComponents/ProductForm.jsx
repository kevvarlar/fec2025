
import React, {useState, useEffect}  from 'react';

import { useSelector} from 'react-redux';


import axios from 'axios';

const ProductForm = () => {
  const [quantity, setQuantity] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState('');
  const [notify, setNotify] = useState('\n');

  const [inStock, setInStock] =useState(true);
  const [purchase, setPurchase] =useState('');
  const [quantities, setQuantities] = useState([]);
  const GalleryData = useSelector(store => store.GalleryData);

  useEffect(() => {

    if(GalleryData.Gallery.name){
      var tempSizes = [{size:'select size'},...Object.keys(GalleryData.Gallery.skus).map((key) => GalleryData.Gallery.skus[key])];
      var tempSizesUpdated = [];
      var tempSizesListed = {};
      for(var i = 0; i < tempSizes.length; i++){
        if(tempSizesListed[tempSizes[i].size]){

          tempSizesUpdated[tempSizesListed[tempSizes[i].size]].quantity+=tempSizes[i].quantity;
        } else {
          tempSizesListed[tempSizes[i].size] = i;
          tempSizesUpdated.push({size:tempSizes[i].size,quantity:tempSizes[i].quantity})
        }
      }

      setSizes(tempSizesUpdated);
    }
  },[GalleryData]);


  useEffect(() => {
    if(inStock){
      setPurchase(<button type="button" onClick={()=>{
        if(size!=='' && size!=='select size'){


          var sku = 0;

          Object.keys(GalleryData.Gallery.skus).map((key) => {
            if(GalleryData.Gallery.skus[key].size === size)
              sku = key;
            })

          for(var i = 0; i < quantity; i++){
            axios.post(process.env.NEXT_PUBLIC_API_URL + '/cart'  ,{sku_id:sku}, {headers: {Authorization:process.env.NEXT_PUBLIC_AUTH_SECRET} })
            .then((res)=>{

              alert('wow');
            })
            .catch((err)=>{
              alert('no way')

            })
          }


        } else {
          setNotify('please select a size');
        }
      }}>add to cart</button>)
    } else {
      setPurchase('');
    }
  },[size])
  if(GalleryData.Gallery.name !== undefined){
    return(
      <form>
        <p>{notify}</p>
        <select name="sizes" data-testid="formSizes" onChange={(e)=>{

          setSize(e.target.value);
          var index = -1;
          for(var i = 0; i < sizes.length; i++) {

            if(sizes[i].size === e.target.value){

              index = i;
            }
          }
          var tempQuantity;
          if(index<0){
            tempQuantity = -1;
          } else {
            tempQuantity = sizes[index].quantity;
          }
          var tempQuantities = [];
          for(i = 1; i <= tempQuantity; i++){
            tempQuantities.push(i);
          }

          if(e.target.value === 'select size'){
            setQuantities([]);
            setQuantity(0);
          } else if(tempQuantity>0){
            setQuantities(tempQuantities);
            setQuantity(1);
            setInStock(true);
          } else{

            setInStock(false);

            //setSizes(['OUT OF STOCK']);
            setQuantities(['OUT OF STOCK'])
            setQuantity('OUT OF STOCK')
          }
        }} >

          {sizes.map((size)=>{
            return(
            <option value={size.size} key={GalleryData.Gallery.name + size.size}> {size.size} </option>
          )})}
        </select>

        <select name="quantity" data-testid="formQuantities" onChange={(e)=>{
          setQuantity(e.target.value);
        }} >
          {quantities.map((amount)=>(
            <option value={amount} key={amount}> {amount} </option>
          ))}
        </select>
        {purchase}
      </form>
    );
  }
}

export default ProductForm;