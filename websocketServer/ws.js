import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const rooms = {}; // Stores truckers, shippers, WebSocket connections, and timer start times

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
          startTime: null,
          clients: new Set(),
        };
      }

      rooms[loadId].clients.add(ws); // Store WebSocket connection

      if (userRole === "shipper") {
        if (!rooms[loadId].shipper) {
          rooms[loadId].shipper = userId;
          rooms[loadId].startTime = Date.now(); // Start timer
        }
      } else if (userRole === "trucker") {
        if (!rooms[loadId].truckers[userId]) {
          rooms[loadId].truckers[userId] = { id: userId, bid: Infinity };
        }
      }

      broadcastToRoom(loadId);
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
      broadcastToRoom(loadId);
    }
  });
});

function broadcastToRoom(loadId) {
  if (!rooms[loadId]) return;

  const truckers = rooms[loadId].truckers;
  console.log("🚛 Truckers in room:", truckers);

  const timeElapsed = rooms[loadId].startTime
    ? Math.floor((Date.now() - rooms[loadId].startTime) / 1000)
    : 0;
  const remainingTime = Math.max(30 - timeElapsed, 0);

  const message = JSON.stringify({
    type: "update",
    loadId,
    truckers,
    remainingTime,
  });

  console.log("📤 Broadcasting to room:", message);

  // Send updates to **all** connected clients (truckers + shipper)
  rooms[loadId].clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
