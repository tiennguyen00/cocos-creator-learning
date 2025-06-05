import { _decorator, CCInteger, Component, find, Node, Animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("btnATK")
export class btnATK extends Component {
  private character = null;

  onLoad() {
    this.character = find("Canvas/GirlCharacter").getComponent("Character");
  }

  start() {
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  onTouchStart() {
    this.character.onCombo();
    this.node.setScale(0.6, 0.6, 1);
  }

  onTouchEnd() {
    this.node.setScale(0.5, 0.5, 1);
  }
}
