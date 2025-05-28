import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerFollower")
export class PlayerFollower extends Component {
  @property(Node)
  private player: Node = null;

  start() {}

  update(deltaTime: number) {
    this.node.x = this.player.x;
  }
}
