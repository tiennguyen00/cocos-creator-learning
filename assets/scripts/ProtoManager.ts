import {
  _decorator,
  Component,
  HorizontalTextAlignment,
  Label,
  Node,
  TextAsset,
  VerticalTextAlignment,
  Widget,
} from "cc";
const { ccclass, property } = _decorator;
import protobufjs, { Buffer } from "protobufjs";
import { WebSocketClient } from "../Network/WebsocketClient";
import { format } from "date-fns";

@ccclass("ProtoManager")
export class ProtoManager extends Component {
  @property(TextAsset)
  schemaProto: TextAsset = null;

  @property(Node)
  msgNode: Node = null;

  constructor() {
    super();
    this.onReceiveMsg = this.onReceiveMsg.bind(this);
  }

  pb = null;
  ws = null;

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
    const result: any = this.DeserializeMsg(
      "ChatMessage",
      new Uint8Array(event.data)
    );
    const newNode = new Node();
    newNode.layer = 4;
    const newLabel = newNode.addComponent(Label);

    newLabel.string = `${result.senderName}(${format(
      new Date(),
      "hh:mm dd/MM"
    )}): ${result.content}`;
    newLabel.fontSize = 16;
    newLabel.lineHeight = 16;
    newLabel.horizontalAlign = HorizontalTextAlignment.LEFT;
    newLabel.verticalAlign = VerticalTextAlignment.TOP;
    this.msgNode.addChild(newNode);
  }

  protected start(): void {
    this.ws = WebSocketClient.getInstance();
    this.ws.connect("ws://localhost:5050", this.onReceiveMsg);

    this.pb = protobufjs.parse(this.schemaProto as any);
  }

  // onDestroy() {
  //   this.ws.disconnect();
  // }
}
