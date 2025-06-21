// import * as protobuf from "../proto-generated/chat_pb";

// export class WebSocketClient {
//   private ws: WebSocket;

//   constructor(serverUrl: string) {
//     this.ws = new WebSocket(serverUrl);
//     this.ws.binaryType = "arraybuffer";

//     this.ws.onopen = () => {
//       console.log("WebSocket connected");

//       // Send a protobuf-encoded message
//       const message = protobuf.ChatMessage.create({
//         sender: "Player1",
//         content: "Hello World!",
//       });

//       const buffer = protobuf.ChatMessage.encode(message).finish();
//       this.ws.send(buffer);
//     };

//     this.ws.onmessage = (event) => {
//       const data = new Uint8Array(event.data);
//       const message = protobuf.ChatMessage.decode(data);
//       console.log(`[${message.sender}] says: ${message.content}`);
//     };

//     this.ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//     };

//     this.ws.onclose = () => {
//       console.log("WebSocket closed");
//     };
//   }

//   sendMessage(sender: string, content: string) {
//     const message = protobuf.ChatMessage.create({ sender, content });
//     const buffer = protobuf.ChatMessage.encode(message).finish();
//     this.ws.send(buffer);
//   }
// }
