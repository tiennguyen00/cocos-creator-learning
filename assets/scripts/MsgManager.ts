import { _decorator, Component, EditBox, find } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MsgManager")
export class MsgManager extends Component {
  private persistScript = null;
  private message = "";

  onLoad() {
    this.persistScript = find("PersistNode").getComponent("PersistScript");
    console.log(this.node.layer);
  }

  onSend() {
    if (this.message.length > 0) {
      const buf = this.persistScript.proto.SerializeMsg("ChatMessage", {
        senderId: "defaultId",
        senderName: this.persistScript.playerName,
        content: this.message,
        timestamp: "",
      });
      this.persistScript.proto.ws.send(buf);
      this.node.getComponent(EditBox).string = "";
    }
  }

  onEditTextChange(text: string) {
    this.message = text;
  }
}
