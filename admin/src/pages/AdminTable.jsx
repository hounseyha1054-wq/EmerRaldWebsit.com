import React, { useEffect } from 'react'
import { toast } from "react-toastify";
import { useState } from 'react';
import axios from "axios";
import  {Url_backend}  from "../App";
const AdminTable = ({token}) => {
  
  const [reservation,setReservqation]=useState([])
  const fetchReservations= async()=>{
    try{

      const response= await axios.get(`${Url_backend}/api/reservation/get`,{
        headers:{
          token
        }
      })
       console.log(response.data);
       setReservqation(response.data);
       
    }catch(error){
      toast.error(error.response?.data?.message || "Error fetching reservations")

    }
  }
   const deleteReservation= async(id)=>{
      if(!window.confirm("Are you sure you want to delete this reservation?")){
        return;
      }
    try{
      await axios.delete(`${Url_backend}/api/reservation/remove/${id}`,{
        headers:{
          token
        }
      })
      toast.success("Reservation removed successfully")
    await  fetchReservations()
    }catch(error){
      toast.error(error.response?.data?.message || "Error removing reservation")

    }
  }

  useEffect(()=>{
    fetchReservations();
    // deleteReservation(); // Remove this line as it's not a valid function call

  },[])
  return (
    <div className='py-6 px-6'>
      <h1 className='text-2xl font-bold'>Restaurant Reservation </h1>

      <div className="reservation">
        {
          reservation.length===0 ? (
            <p>No reservations found</p>
          ):(
            <table className="min-w-full bg-white"> 
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">CustomerName</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b"> Reservation Date</th>
                  <th className="py-2 px-4 border-b"> Guest</th>
                  <th className="py-2 px-4 border-b"> Time</th>
                  <th className="py-2 px-4 border-b"> Action</th>
                  
                </tr>
              </thead>
              <tbody>
                {reservation.map((item,index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{item.name}</td>
                    <td className="py-2 px-4 border-b">{item.phone}</td>
                    <td className="py-2 px-4 border-b">{item.email}</td>
                    <td className="py-2 px-4 border-b">{item.date}</td>
                    <td className="py-2 px-4 border-b">{item.guests}</td>
                    <td className="py-2 px-4 border-b">{item.time}</td>
                    <td className="py-2 px-4 border-b">
                       
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteReservation(item._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  )
}

export default AdminTable
