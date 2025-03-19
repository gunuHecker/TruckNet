"use client";
import { useState } from "react";

export default function TruckerCard({ trucker, currentBid, onPlaceBid }) {
  const [newBid, setNewBid] = useState(1000000);

  const handleBid = () => {
    if (newBid >= currentBid || newBid <= 0) {
      alert("Bid must be lower than the current winning bid!");
      return;
    }
    onPlaceBid(trucker.userId, newBid);
    setNewBid("");
  };

  return (
    <div className="bg-gray-700 text-white p-4 rounded-lg shadow-md flex flex-col items-center">
      <h3 className="text-lg font-bold">Trucker: {trucker.userId}</h3>
      <p>License Duration: {trucker.licenseDuration} years</p>
      <p>Truck Age: {trucker.truckAge} years</p>
      <p className="text-blue-400">Current Bid: ₹{currentBid}</p>

      <input
        type="number"
        value={newBid}
        onChange={(e) => setNewBid(e.target.value)}
        placeholder="Enter lower bid"
        className="mt-2 p-2 text-black rounded"
      />
      <button
        onClick={handleBid}
        className="mt-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-400"
      >
        Place Lower Bid
      </button>
    </div>
  );
}