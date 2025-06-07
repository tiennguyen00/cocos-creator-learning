import { _decorator, Component, find, Node, Animation, CCInteger } from "cc";
import { BaseState } from "../../state/Base";
const { ccclass, property } = _decorator;

@ccclass("btnR")
export class btnR extends Component {
  @property({
    type: CCInteger,
  })
  public LR: number = 0;
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
    this.character.moveDir = this.LR;
    this.character.node.setScale(this.LR * 1, 1, 1);
    this.character.changeState(BaseState.RUN, "walk1");
    this.node.setScale(0.6, 0.6, 1);
  }

  onTouchEnd() {
    this.character.moveDir = 0;
    this.character.changeState(BaseState.IDLE, "idle1");
    this.node.setScale(0.5, 0.5, 1);
  }

  update(deltaTime: number) {}
}
