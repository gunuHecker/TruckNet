"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadDetailsBar from "@/components/LoadDetailsBar";
import TruckerCard from "@/components/TruckerCard";

export default function BiddingPage() {
  const params = useParams();
  const router = useRouter();
  const [loadId, setLoadId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [load, setLoad] = useState(null);
  const [truckers, setTruckers] = useState([]);
  const [winningBid, setWinningBid] = useState(20000);
  const [ws, setWs] = useState(null);
  const [timer, setTimer] = useState(45);
  const [biddingStarted, setBiddingStarted] = useState(false);
  const [winner, setWinner] = useState(null); // State to store the winner

  useEffect(() => {
    if (params?.loadId) setLoadId(params.loadId);
  }, [params]);

  useEffect(() => {
    async function fetchAuthDetails() {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success) return router.push("/login");

        setUserToken(data.token);
        setUserRole(data.userRole);
        setUserId(data.userId);
      } catch (error) {
        console.error("Error fetching auth details:", error);
        router.push("/login");
      }
    }

    fetchAuthDetails();
  }, []);

  useEffect(() => {
    if (!loadId || !userToken) return;

    async function fetchLoadDetails() {
      try {
        const res = await fetch(`/api/load/${loadId}`);
        const data = await res.json();
        if (!data.success) throw new Error("Failed to load data");

        setLoad(data.load);
        setWinningBid(data.winningBid || 1000000);
        setTimer(data.remainingTime || 45);

        if (userRole === "shipper" && data.load.shipperId === userId) {
          setIsAuthorized(true);
        } else if (userRole === "trucker") {
          setIsAuthorized(true);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching load:", error);
        router.push("/shipper/openLoads");
      }
    }

    fetchLoadDetails();
  }, [loadId, userToken, userRole]);

  useEffect(() => {
    if (!isAuthorized) return;

    // Connect frontend to WebSocket server
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    // Connect client to server
    socket.onopen = () => {
      console.log("✅ Connected to WebSocket server");
      socket.send(JSON.stringify({ type: "join", loadId, userRole, userId }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 WebSocket received message:", message);

      if (message.type === "update" && message.loadId === loadId) {
        // Convert trucker object into an array
        const truckerArray = Object.entries(message.truckers).map(
          ([key, trucker]) => ({
            id: String(key), // Ensure `id` is always a string
            ...trucker,
          })
        );
        console.log("🚛 Updated truckers:", truckerArray);

        setTruckers(truckerArray);
        setWinningBid(Math.min(...truckerArray.map((t) => t.bid), 1000000));
        setTimer(message.remainingTime);
        setBiddingStarted(message.biddingStarted);
      }

      if (message.type === "bidding-started" && message.loadId === loadId) {
        setBiddingStarted(true);
      }

      if (message.type === "winner" && message.loadId === loadId) {
        console.log("🎉 Winner Received:", message);
        setWinner({ id: message.winnerId, bid: message.winningBid });

        // Call the API to store the winner in the database
        fetch("/api/bidding/winner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loadId,
            winnerId: message.winnerId,
            winningBid: message.winningBid,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log("Winner stored in the database:", message.winnerId);
            } else {
              console.error("Error storing winner:", data.message);
            }
          })
          .catch((error) => {
            console.error("Error calling API:", error);
          });
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [isAuthorized]);

  const handleStartBidding = () => {
    if (ws) {
      ws.send(
        JSON.stringify({ type: "start-bidding", loadId, userRole, userId })
      );
    }
    setBiddingStarted(true);
    setTimer(45);
  };

  if (!userRole)
    return <p className="text-white text-center mt-4">Loading...</p>;

  if (!isAuthorized)
    return <p className="text-white text-center mt-4">Redirecting...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LoadDetailsBar
        load={load}
        winningBid={winningBid}
        timer={timer}
        isShipper={userRole === "shipper"}
        onStartBidding={handleStartBidding}
        biddingStarted={biddingStarted}
      />

      {winner && (
        <div className="bg-green-500 text-white p-4 text-center">
          <h2 className="text-xl font-bold">Winner Announced!</h2>
          <p>Trucker ID: {winner.id}</p>
          <p>Winning Bid: ₹{winner.bid}</p>
        </div>
      )}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {truckers.map((trucker) => (
          <TruckerCard
            key={trucker.id}
            trucker={trucker}
            currentBid={winningBid}
            userId={userId}
            biddingStarted={biddingStarted}
            onPlaceBid={(truckerId, bidAmount) => {
              if (ws) {
                ws.send(
                  JSON.stringify({
                    type: "bid",
                    loadId,
                    userRole,
                    userId: truckerId,
                    bidAmount,
                  })
                );
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}