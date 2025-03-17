"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadDetailsBar from "@/components/LoadDetailsBar";
import TruckerCard from "@/components/TruckerCard";

export default function BiddingPage({ params }) {
  const { loadId } = params;
  const router = useRouter();

  const [load, setLoad] = useState(null);
  const [truckers, setTruckers] = useState([]);
  const [winningBid, setWinningBid] = useState(Infinity);
  const [timer, setTimer] = useState(600);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    async function fetchLoadDetails() {
      try {
        const res = await fetch(`/api/load/${loadId}`);
        const data = await res.json();
        if (!data.success) throw new Error("Failed to load data");

        setLoad(data.load);
        setWinningBid(data.winningBid || Infinity);
      } catch (error) {
        console.error("Error fetching load:", error);
      }
    }

    fetchLoadDetails();

    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");

      // When a trucker joins, send their details to the server
      socket.send(
        JSON.stringify({
          type: "join",
          truckerId: Math.random().toString(36).substr(2, 9), // Generate a random trucker ID
          name: `Trucker ${Math.floor(Math.random() * 100)}`, // Temporary name
          bid: Infinity,
        })
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "update") {
        setTruckers(Object.values(message.truckers));
        const lowestBid = Math.min(
          ...Object.values(message.truckers).map((t) => t.bid),
          Infinity
        );
        setWinningBid(lowestBid);
      }

      if (message.type === "timer") {
        setTimer(message.timer);
      }
    };

    return () => {
      socket.close();
    };
  }, [loadId]);

  const handleBid = (truckerId, bidAmount) => {
    if (ws) {
      ws.send(JSON.stringify({ type: "bid", truckerId, bidAmount }));
    }
  };

  const handleTimerEnd = () => {
    alert("Bidding ended! Winning bid: ₹" + winningBid);
    router.push("/loads");
  };

  if (!load) return <p className="text-white text-center mt-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LoadDetailsBar
        load={load}
        winningBid={winningBid}
        timer={timer}
        onTimerEnd={handleTimerEnd}
      />

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {truckers.map((trucker) => (
          <TruckerCard
            key={trucker.id}
            trucker={trucker}
            currentBid={winningBid}
            onPlaceBid={handleBid}
          />
        ))}
      </div>
    </div>
  );
}
