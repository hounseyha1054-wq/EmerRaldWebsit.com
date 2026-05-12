import React, { createContext, useState } from "react";

import {toast} from "react-toastify"
export const MenuContext = createContext()
import { Url_backend } from "../App";
import axios from "axios";
import { useEffect } from "react";

const MenuContextProvider=({children})=>{
    const [products,setproduct] = useState([])

    const getProductdata = async () => {
    try {
        const response = await axios.get(`${Url_backend}/api/product/list`);

         
        console.log(response.data);
        setproduct(response.data);
        

    } catch (error) {
        toast.error(
            error.response?.data?.message || "Error fetching product data"
        );
    }
}

    useEffect(()=>{
        getProductdata();
    },[])
    


    return(

         <MenuContext.Provider value={{products}}>

            {children}

         </MenuContext.Provider>
    )

}

export default MenuContextProvider;