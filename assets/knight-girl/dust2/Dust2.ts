import { _decorator, Component, Node, Animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Dust2")
export class Dust2 extends Component {
  private anim: Animation = null;

  start() {
    this.anim = this.node.getComponent(Animation);
    this.anim.on(Animation.EventType.FINISHED, this.onFinished, this);
  }

  onFinished() {
    this.node.destroy();
  }

  update(deltaTime: number) {}
}
