const WebSocket = require("ws");
const protobuf = require("protobufjs");

// Load the .proto file
protobuf
  .load("./chat.proto")
  .then((root) => {
    const ChatMessage = root.lookupType("ChatMessage");

    const wss = new WebSocket.Server({ port: 5050 }, () => {
      console.log("✅ WebSocket server listening on ws://localhost:5050");
    });

    wss.on("connection", (ws) => {
      console.log("🔗 Client connected");

      ws.on("message", (data) => {
        try {
          const message = ChatMessage.decode(new Uint8Array(data));
          console.log(
            `📨 ${message.senderName} (${message.senderId}): ${message.content}`
          );

          // Reply with acknowledgment
          const response = ChatMessage.create({
            senderId: "server",
            senderName: "ServerBot",
            content: `Got your message: "${message.content}"`,
            timestamp: Date.now(),
          });

          ws.send(ChatMessage.encode(response).finish());
        } catch (e) {
          console.error("❌ Decode error:", e);
        }
      });

      ws.on("close", () => console.log("❌ Client disconnected"));
    });
  })
  .catch((err) => {
    console.error("❌ Failed to load .proto:", err);
  });
