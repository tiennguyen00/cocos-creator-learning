import { _decorator, Component, EditBox, find } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MsgManager")
export class MsgManager extends Component {
  private persistScript = null;

  onLoad() {
    this.persistScript = find("PersistNode").getComponent("PersistScript");
  }

  onSend() {
    const message = this.node.getComponent(EditBox).string;
    if (message.length > 0) {
      const buf = this.persistScript.proto.SerializeMsg("ChatMessage", {
        senderId: "defaultId",
        senderName: this.persistScript.playerName,
        content: message,
        timestamp: "",
      });
      this.persistScript.proto.ws.send(buf);
      this.node.getComponent(EditBox).string = "";
    }
  }
}
