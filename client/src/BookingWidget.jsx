import {useContext, useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";

export default function BookingWidget({place}) {
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [numberOfGuests,setNumberOfGuests] = useState(1);
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [redirect,setRedirect] = useState('');
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
    
  }, [user]);

var CO=new Date();
var CI=new Date();

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    CI=new Date(checkIn);
CO=new Date(checkOut);
CI.setDate(CI.getDate()+1);
CO.setDate(CO.getDate()-1);
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    
    if(user){
      if(!(checkIn && checkOut && numberOfGuests && name && phone)){
        alert("Please fill all the fields");
      }
      else if(numberOfGuests<=0){
        alert("Number of guests must be atleast one");
      }
      else if(numberOfGuests>place.maxGuests){
        alert("Maximum number of guests are "+place.maxGuests);
      }
      else{
        const response = await axios.post('/bookings', {
          checkIn,checkOut,numberOfGuests,name,phone,
          place:place._id,
          price:numberOfNights * place.price,
        });
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
      }
    }
    else{
      alert('Please login to book');
      setRedirect(`/login`);
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <form>
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: Rs.{place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date"
                   value={checkIn} max={checkOut || formatCurrentDate(CO)} min={formatCurrentDate(new Date())} required
                   onChange={ev => setCheckIn(ev.target.value)}/>
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date" min={formatCurrentDate(CI)} required
                   value={checkOut}
                   onChange={ev => setCheckOut(ev.target.value)}/>
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input type="number" min={1} max={place.maxGuests}  required
                 value={numberOfGuests}
                 onChange={ev => setNumberOfGuests(ev.target.value)}/>
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text"  required
                   value={name}
                   onChange={ev => setName(ev.target.value)}/>
            <label>Phone number:</label>
            <input type="tel" required
                   value={phone} 
                   onChange={ev => setPhone(ev.target.value)}/>
          </div>
        )}
      </div>
      
      <button type='submit'  onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && numberOfGuests<= place.maxGuests && numberOfGuests > 0 &&  (
          <span> Rs. {numberOfNights * place.price * numberOfGuests}</span>
        )}
      </button>
    </div>
    </form>
  );
}

function formatCurrentDate(today) {
  const month = new Intl.DateTimeFormat('en-US', { month: '2-digit' }).format(today);
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(today);
  const formattedDate = today.getFullYear()+'-'+(month)+'-'+day;
  return (formattedDate);
}

