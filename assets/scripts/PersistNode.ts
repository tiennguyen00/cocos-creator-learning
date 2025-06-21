import { _decorator, Component, director, find, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PersistNode")
export class PersistNode extends Component {
  private _charScript: Component | null = null;

  get charScript() {
    return this._charScript;
  }

  set charScript(value: Component) {
    this._charScript = value;
  }

  onLoad() {
    this.charScript = find("Canvas/GirlCharacter").getComponent("Character");
    console.log("this.charactert: ", this.charScript);
  }

  start() {
    director.addPersistRootNode(this.node);
  }
}
