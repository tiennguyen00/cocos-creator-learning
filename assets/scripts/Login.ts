import { _decorator, Component, director, EditBox, find, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Login")
export class Login extends Component {
  editBox: Node = null;
  private playerName: string = "";
  private pd = null;

  onLoad(): void {
    this.editBox = find("EditBox", this.node);
    this.pd = find("Login", this.node).getComponent("ProtoManager");
    director.preloadScene("scene");
  }

  onEditTextChange(text) {
    this.playerName = text;
  }
  onLogin() {
    if (this.playerName.length == 0) return;
    const buf = this.pd.SerializeMsg("ChatMessage", {
      senderId: "1A",
      senderName: this.playerName,
      content: "Helloworld",
      timestamp: Date.now(),
    });
    this.pd.ws.send(buf);
    // Switch screen:
    director.loadScene("scene");
  }
}
