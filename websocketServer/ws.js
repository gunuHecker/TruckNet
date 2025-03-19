import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server running on port 8080!!");

const rooms = {}; // Stores truckers, shippers, WebSocket connections, and timer

wss.on("connection", (ws) => {
  let loadId = null;
  let userRole = null;
  let userId = null;

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "join") {
      loadId = data.loadId;
      userRole = data.userRole;
      userId = data.userId;

      if (!rooms[loadId]) {
        rooms[loadId] = {
          truckers: {},
          shipper: null,
          startTime: null, // Timer starts when shipper presses "Start Bidding"
          clients: new Set(),
          interval: null, // Store interval reference for timer updates
        };
      }

      rooms[loadId].clients.add(ws); // Store WebSocket connection

      if (userRole === "shipper") {
        if (!rooms[loadId].shipper) {
          rooms[loadId].shipper = userId;
        }
      } else if (userRole === "trucker") {
        if (!rooms[loadId].truckers[userId]) {
          rooms[loadId].truckers[userId] = { id: userId, bid: 1000000 };
        }
      }

      broadcastToRoom(loadId);
    }

    if (data.type === "start-bidding" && userRole === "shipper") {
      if (rooms[loadId].shipper === userId) {
        rooms[loadId].startTime = Date.now(); // Start timer when shipper presses "Start Bidding"

        // Start a countdown interval if it doesn't exist
        if (!rooms[loadId].interval) {
          rooms[loadId].interval = setInterval(() => {
            broadcastToRoom(loadId);
          }, 1000);
        }

        broadcastToRoom(loadId);
      }
    }

    if (data.type === "bid" && loadId && userRole === "trucker") {
      if (rooms[loadId].truckers[data.userId]) {
        rooms[loadId].truckers[data.userId].bid = data.bidAmount;
      }
      broadcastToRoom(loadId);
    }
  });

  ws.on("close", () => {
    if (loadId && rooms[loadId]) {
      rooms[loadId].clients.delete(ws); // Remove client on disconnect

      if (userRole === "trucker") {
        delete rooms[loadId].truckers[userId];
      }

      // If no clients are left in the room, stop the timer
      if (rooms[loadId].clients.size === 0 && rooms[loadId].interval) {
        clearInterval(rooms[loadId].interval);
        rooms[loadId].interval = null;
        rooms[loadId].startTime = null; // Reset timer
      }

      broadcastToRoom(loadId);
    }
  });
});

function broadcastToRoom(loadId) {
  if (!rooms[loadId]) return;

  const truckers = rooms[loadId].truckers;
  console.log("🚛 Truckers in room:", truckers);

  // Ensure the remaining time updates consistently for all clients
  let remainingTime = 400;
  if (rooms[loadId].startTime) {
    const timeElapsed = Math.floor(
      (Date.now() - rooms[loadId].startTime) / 1000
    );
    remainingTime = Math.max(400 - timeElapsed, 0);

    // Stop broadcasting if time runs out
    if (remainingTime === 0 && rooms[loadId].interval) {
      clearInterval(rooms[loadId].interval);
      rooms[loadId].interval = null;
    }
  }

  const message = JSON.stringify({
    type: "update",
    loadId,
    truckers,
    remainingTime,
    biddingStarted: rooms[loadId].startTime !== null, // Tell the frontend if bidding has started
  });

  console.log("📤 Broadcasting to room:", message);

  // Send updates to **all** connected clients (truckers + shipper)
  rooms[loadId].clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}