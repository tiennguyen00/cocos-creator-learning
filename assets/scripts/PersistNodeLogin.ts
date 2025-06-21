import { _decorator, Component, director, find, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PersistNodeLogin")
export class PersistNodeLogin extends Component {
  private _userName: Component | null = null;

  get userName() {
    return this._userName;
  }

  set userName(value: Component) {
    this._userName = value;
  }

  onLoad() {
    this.userName = find("Canvas/UI/Login").getComponent("ProtoManager");
  }

  start() {
    director.addPersistRootNode(this.node);
  }
}
