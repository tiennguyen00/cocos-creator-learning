import { _decorator, Component, Node, TextAsset } from "cc";
const { ccclass, property } = _decorator;
import protobufjs from "protobufjs";

@ccclass("ProtoManager")
export class ProtoManager extends Component {
  @property(TextAsset)
  schemaProto: TextAsset = null;

  private pb = null;

  public SerializeMsg(mesName, mesBody): Uint8Array {
    let rs = this.pb.root.lookupType(mesName);
    let msg = rs.create(mesBody);

    let buf = rs.encode(msg).finish();
    return buf;
  }
  onLogin() {
    this.pb = protobufjs.parse(this.schemaProto as any);
    console.log("this.pb: ", this.pb);
  }
}
