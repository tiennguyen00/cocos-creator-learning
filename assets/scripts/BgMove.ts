import { _decorator, CCFloat, Component, find, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BgMove")
export class BgMove extends Component {
  @property({
    type: CCFloat,
  })
  private speed: number = 0;

  private Cam = null;
  private originPos = null;

  protected onLoad(): void {
    this.Cam = find("Canvas/PlayerFollower");
    this.originPos = this.node.x;
  }
  start() {}

  update(deltaTime: number) {
    this.node.x = this.originPos - this.Cam.x * this.speed;
  }
}
