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
  const [winningBid, setWinningBid] = useState(Infinity);
  const [ws, setWs] = useState(null);
  const [timer, setTimer] = useState(400);

  useEffect(() => {
    if (params?.loadId) setLoadId(params.loadId);
  }, [params]);

  // Fetch user authentication details
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

  // Fetch load details
  useEffect(() => {
    if (!loadId || !userToken) return;

    async function fetchLoadDetails() {
      try {
        const res = await fetch(`/api/load/${loadId}`);
        const data = await res.json();
        if (!data.success) throw new Error("Failed to load data");

        setLoad(data.load);
        setWinningBid(data.winningBid || Infinity);

        // Authorization logic
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

  // WebSocket connection for live bidding updates
  useEffect(() => {
    if (!isAuthorized) return;

    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

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
        setWinningBid(Math.min(...truckerArray.map((t) => t.bid), Infinity));
        setTimer(message.remainingTime);
      }
    };

    return () => {
      socket.close();
    };
  }, [isAuthorized]);

  if (!isAuthorized)
    return <p className="text-white text-center mt-4">Redirecting...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LoadDetailsBar load={load} winningBid={winningBid} timer={timer} />

      {/* Display for both truckers and shipper */}
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