"use client";
import { useEffect, useState } from "react";

export default function LoadDetailsBar({
  load,
  winningBid,
  timer,
  onTimerEnd,
}) {
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      onTimerEnd();
    }
  }, [timeLeft]);

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">Load Details</h2>
        <p>
          Pickup: {load.pickupLocation} → Dropoff: {load.dropoffLocation}
        </p>
        <p>
          Weight: {load.weight} kg | Truck Type: {load.truckType}
        </p>
        <p>Shipper ID: {load.shipperId}</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Winning Bid: ₹{winningBid}</h2>
        <p className="text-red-400 font-bold">Timer: {timeLeft}s</p>
      </div>
    </div>
  );
}