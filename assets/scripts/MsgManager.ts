import { _decorator, Component, EditBox, find } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MsgManager")
export class MsgManager extends Component {
  private persistScript = null;

  private message = "";

  onLoad() {
    this.persistScript = find("PersistNode").getComponent("PersistScript");
  }

  onEditDidEnd(editbox) {
    // The editbox here is a EditBox object.
    // this.onSend();
  }

  onTextChanged(text, editbox, customEventData) {
    // The editbox here is a EditBox object.
    console.log("onTextChanged: ", text);
  }

  onSend() {
    const message = this.node
      .getChildByName("EditBox")
      .getComponent(EditBox).string;

    if (message.length > 0) {
      const buf = this.persistScript.proto.SerializeMsg("ChatMessage", {
        senderId: "defaultId",
        senderName: this.persistScript.playerName,
        content: message,
        timestamp: "",
      });
      this.persistScript.proto.ws.send(buf);
      this.node.getChildByName("EditBox").getComponent(EditBox).string = "";
    }
  }
}
