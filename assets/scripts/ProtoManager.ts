import { _decorator, Component, Node, TextAsset } from "cc";
const { ccclass, property } = _decorator;
import protobufjs, { Buffer } from "protobufjs";
import { WebSocketClient } from "../Network/WebsocketClient";

@ccclass("ProtoManager")
export class ProtoManager extends Component {
  @property(TextAsset)
  schemaProto: TextAsset = null;

  private pb = null;
  private ws = null;

  public SerializeMsg(mesName, mesBody): Uint8Array | Buffer {
    let rs = this.pb.root.lookupType(mesName);
    // Creates a new messages instance,
    let msg = rs.create(mesBody);

    // Encode a message to an Unit8Array or Buffle
    let buf = rs.encode(msg).finish();
    return buf;
  }

  public DeserializeMsg(msgName, msgBuf: Uint8Array | Buffer): Object {
    const rs = this.pb.root.lookupType(msgName);
    const msg = rs.decode(msgBuf);
    return msg;
  }
  protected start(): void {
    this.ws = WebSocketClient.getInstance();
    this.ws.connect("ws://localhost:5050", (event) => {
      console.log("Received in ProtoManager:", event.data);
      console.log(
        this.DeserializeMsg("ChatMessage", new Uint8Array(event.data))
      );
    });
  }
  onLogin() {
    this.pb = protobufjs.parse(this.schemaProto as any);
    const dummyMsg = {
      senderId: "123ABC",
      senderName: "Alex",
      content: "Hello world, my name is Alex",
      timestamp: 1718965246, // in second
    };
    const buf = this.SerializeMsg("ChatMessage", dummyMsg);
    this.ws.send(buf);
  }

  onDestroy() {
    this.ws.disconnect();
  }
}
