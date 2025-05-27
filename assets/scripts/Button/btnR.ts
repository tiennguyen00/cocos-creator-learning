import { _decorator, Component, find, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("btnR")
export class btnR extends Component {
  @property({
    type: Number,
  })
  public LR: number = 0;
  private groundScript = null;

  onLoad() {
    this.groundScript = find("Canvas/Backround").getComponent("Ground");
  }

  start() {
    this.node.on(Node.EventType.TOUCH_START, this.onBtnClick, this);
    this.node.on(Node.EventType.TOUCH_END, this.onBtnClickEnd, this);
  }

  onBtnClick() {
    this.node.setScale(0.6, 0.6, 1);
    this.groundScript.speed = 400 * this.LR;
  }

  onBtnClickEnd() {
    this.node.setScale(0.5, 0.5, 1);
    this.groundScript.speed = 0;
  }

  update(deltaTime: number) {}
}
