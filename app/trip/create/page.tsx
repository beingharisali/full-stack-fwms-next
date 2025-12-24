"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTrip } from "../../../services/trip.api";
import { Trip } from "../../../types/trip"; 

export default function CreateTrip() {
  const router = useRouter();

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(""); 
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const handleCreate = async () => {
    if (!departure || !destination || !date || !departureTime || !arrivalTime) {
      alert("Fill all fields");
      return;
    }

   const payload: Trip = {
  departure,
  destination,
  departureTime,
  arrivalTime,
  date: new Date(date),
};

    await createTrip(payload);
    router.push("/trips");
  };

  return (
    <div>
      <input
        placeholder="Departure"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
      />

      <input
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        value={departureTime}
        onChange={(e) => setDepartureTime(e.target.value)}
      />

      <input
        type="time"
        value={arrivalTime}
        onChange={(e) => setArrivalTime(e.target.value)}
      />

      <button onClick={handleCreate}>Save</button>
    </div>
  );
}
