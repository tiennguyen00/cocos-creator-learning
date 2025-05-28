import { _decorator, Component, Node, Animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Leaves")
export class Leaves extends Component {
  private randomNum = 0;
  private animation: Animation = null;
  onLoad() {
    this.animation = this.getComponent(Animation);
  }
  start() {
    this.node.x = Math.random() * 1280 - 640;
    this.node.y = 400 + Math.random() * 400;
    this.randomNum = Math.random() * 100;
  }

  update(deltaTime: number) {
    if (this.node.y < -280) {
      this.node.y = 100 + this.randomNum * 50;
      this.node.x = Math.random() * 1280 - 640;
    }
    this.node.y -= 100 * deltaTime;
    this.node.x -= Math.sin(this.node.y / 100) * this.randomNum * deltaTime;
  }
}
