import { _decorator, Canvas, Component, director, find, Node } from "cc";
import { LoadingManager } from "./LoadingManager";
const { ccclass, property } = _decorator;

@ccclass("Login")
export class Login extends Component {
  editBox: Node = null;
  private playername: string = "";

  persistScript = null;

  onLoad(): void {
    this.editBox = find("EditBox", this.node);
    // preload-forfistTime
    // director.preloadScene("scene");
  }

  start(): void {
    this.persistScript = find("PersistNode").getComponent("PersistScript");
  }

  onEditTextChange(text) {
    this.playername = text;
  }
  onLogin() {
    if (this.playername.length == 0) return;

    director.loadScene("loading", (_, scene) => {
      const canvas = scene.getChildByName("Canvas");
      const lLoadingManager = canvas.getComponent(LoadingManager);
      lLoadingManager.targetScene = "scene";
    });

    this.persistScript.name = this.playername;
  }
}
