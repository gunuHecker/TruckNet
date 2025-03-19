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
  const [timer, setTimer] = useState(400);
  const [biddingStarted, setBiddingStarted] = useState(false);

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
        setTimer(data.remainingTime || 400);

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

    // connect frontend to websocket server
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    // connect client to server
    socket.onopen = () => {
      console.log("✅ Connected to WebSocket server");
      socket.send(JSON.stringify({ type: "join", loadId, userRole, userId }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 WebSocket received message:", message);

      if (message.type === "update" && message.loadId === loadId) {
        const truckerArray = Object.values(message.truckers);
        console.log("🚛 Updated truckers:", truckerArray);

        setTruckers(truckerArray);
        setWinningBid(Math.min(...truckerArray.map((t) => t.bid), 1000000));
        setTimer(message.remainingTime);
      }
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
    setTimer(400);
  };
  
  if (!userRole) return <p className="text-white text-center mt-4">Loading...</p>;

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

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {truckers.map((trucker) => (
          <TruckerCard
            key={trucker.id}
            trucker={trucker}
            currentBid={winningBid}
          />
        ))}
      </div>
    </div>
  );
}