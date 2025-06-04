import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerFollower")
export class PlayerFollower extends Component {
  @property(Node)
  private player: Node = null;

  @property
  public maxBounds

  start() {}

  update(deltaTime: number) {
    this.node.x = Math.min(Math.max(this.player.x, 0), 1920);
  }
}
