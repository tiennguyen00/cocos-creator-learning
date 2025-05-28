import { _decorator, Component, find, Node, Animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("btnR")
export class btnR extends Component {
  @property({
    type: Number,
  })
  public LR: number = 0;
  private charScript = null;
  private animScript = null;
  private player = null;

  onLoad() {
    this.player = find("Canvas/Character");
    this.charScript = this.player.getComponent("PlayerControl");
    this.animScript = this.player.getComponent(Animation);
  }

  start() {
    this.node.on(Node.EventType.TOUCH_START, this.onBtnClick, this);
    this.node.on(Node.EventType.TOUCH_END, this.onBtnClickEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onBtnClickEnd, this);
  }

  onBtnClick() {
    const scale = this.player.getScale();
    this.node.setScale(0.6, 0.6, 1);
    this.charScript.speed = 400 * this.LR;
    this.animScript.play("run");
    this.player.setScale(this.LR * Math.abs(scale.x), scale.y, scale.z);
  }

  onBtnClickEnd() {
    this.node.setScale(0.5, 0.5, 1);
    this.charScript.speed = 0;
    this.animScript.play("idle");
  }

  update(deltaTime: number) {}
}
