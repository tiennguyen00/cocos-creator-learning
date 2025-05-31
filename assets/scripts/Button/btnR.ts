import { _decorator, Component, find, Node, Animation, CCInteger } from "cc";
const { ccclass, property } = _decorator;

@ccclass("btnR")
export class btnR extends Component {
  @property({
    type: CCInteger,
  })
  public LR: number = 0;
  private charScript = null;
  private animScript = null;
  private player = null;
  private spriteScript = null;

  onLoad() {
    this.player = find("Canvas/Character");
    this.charScript = this.player.getComponent("PlayerControl");
    this.animScript = this.player.getComponent(Animation);
    this.spriteScript = this.player.getComponent("PlayerSprite");
  }

  start() {
    this.node.on(Node.EventType.TOUCH_START, this.onBtnClick, this);
    this.node.on(Node.EventType.TOUCH_END, this.onBtnClickEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onBtnClickEnd, this);
  }

  onBtnClick() {
    const scale = this.player.getScale();
    this.node.setScale(0.6, 0.6, 1);
    if (this.spriteScript.state == "idle") {
      this.animScript.play("run");
    }
    this.charScript.speed = 400 * this.LR;
    this.player.setScale(this.LR * Math.abs(scale.x), scale.y, scale.z);
  }

  onBtnClickEnd() {
    this.node.setScale(0.5, 0.5, 1);
    if (this.spriteScript.state == "idle") {
      this.animScript.play("idle");
    }
    this.charScript.speed = 0;
  }

  update(deltaTime: number) {}
}
