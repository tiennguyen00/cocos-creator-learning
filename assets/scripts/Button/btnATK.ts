import { _decorator, CCInteger, Component, find, Node, Animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("btnATK")
export class btnATK extends Component {
  @property({
    type: CCInteger,
  })
  public LR: number = 0;
  private animScript = null;
  private player = null;
  private charScript = null;

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
    this.node.setScale(0.6, 0.6, 1);
    this.animScript.play("attack");
    this.charScript.hitForce = 5;
  }

  onBtnClickEnd() {
    this.node.setScale(0.5, 0.5, 1);
    // this.animScript.stop("attack");
    // this.animScript.play("idle");
  }

  update(deltaTime: number) {}
}
