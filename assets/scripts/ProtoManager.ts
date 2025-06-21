import { _decorator, Component, Node, TextAsset } from "cc";
const { ccclass, property } = _decorator;
import protobufjs, { Buffer } from "protobufjs";
import { WebSocketClient } from "../Network/WebsocketClient";

@ccclass("ProtoManager")
export class ProtoManager extends Component {
  @property(TextAsset)
  schemaProto: TextAsset = null;

  constructor() {
    super();
    this.onReceiveMsg = this.onReceiveMsg.bind(this);
  }

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

  public onReceiveMsg(event) {
    console.log("Received in ProtoManager:", event.data);
    console.log(this.DeserializeMsg("ChatMessage", new Uint8Array(event.data)));
  }
  protected start(): void {
    this.ws = WebSocketClient.getInstance();
    this.ws.connect("ws://localhost:5050", this.onReceiveMsg);
    this.pb = protobufjs.parse(this.schemaProto as any);
  }

  onDestroy() {
    this.ws.disconnect();
  }
}
