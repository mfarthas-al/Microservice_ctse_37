import React, { useEffect, useState } from "react";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import { getBookings } from "./services/bookingService";
import "./App.css";

function App() {

  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {

    const response = await getBookings();

    setBookings(response.data);
  };

  useEffect(() => {

    fetchBookings();

  }, []);

  return (

    <div className="container">

      <h1>Event Booking System</h1>

      <BookingForm refreshBookings={fetchBookings} />

      <BookingList
        bookings={bookings}
        refreshBookings={fetchBookings}
      />

    </div>

  );
}

export default App;