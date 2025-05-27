import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("btnL")
export class btnL extends Component {
  start() {
    this.node.on(Node.EventType.TOUCH_START, this.onBtnClick, this);
    this.node.on(Node.EventType.TOUCH_END, this.onBtnClickEnd, this);
  }

  onBtnClick() {
    this.node.setScale(0.8, 0.8, 1);
  }

  onBtnClickEnd() {
    this.node.setScale(0.5, 0.5, 1);
  }
}
