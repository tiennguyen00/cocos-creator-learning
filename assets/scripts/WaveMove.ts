import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("WaveMove")
export class WaveMove extends Component {
  @property(Number)
  speed: number = 1;
  prevX = 0;
  start() {
    this.prevX = this.node.x;
  }

  update(deltaTime: number) {
    if (this.node.x > this.prevX + 250) this.node.x = this.prevX;
    this.node.x += deltaTime * this.speed;
  }
}
