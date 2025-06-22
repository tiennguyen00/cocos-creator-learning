import { _decorator, Component, director, find, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Login")
export class Login extends Component {
  editBox: Node = null;
  private playerName: string = "";
  private pd = null;

  @property(Node)
  persistScript = null;

  onLoad(): void {
    this.editBox = find("EditBox", this.node);
    this.pd = find("Login", this.node).getComponent("ProtoManager");
    director.preloadScene("scene");
  }

  start(): void {
    this.persistScript = find("PersistNode").getComponent("PersistScript");
  }

  onEditTextChange(text) {
    this.playerName = text;
  }
  onLogin() {
    if (this.playerName.length == 0) return;
    // const buf = this.pd.SerializeMsg("ChatMessage", {
    //   senderId: "defaultId",
    //   senderName: this.playerName,
    //   content: "Greeting: Helloworld",
    //   timestamp: Date.now(),
    // });
    // this.pd.ws.send(buf);
    this.persistScript.playerName = this.playerName;
    this.persistScript.loadScene("scene", () => {});
  }

  onDestroy() {
    if (director.isPersistRootNode(this.node)) {
      director.removePersistRootNode(this.node);
    }
  }
}
