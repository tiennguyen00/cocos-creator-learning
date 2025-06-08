import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Stats")
export class Stats extends Component {
  @property(Node)
  player: Node = null;

  private playerScript = null;
  private hpBar: Node = null;
  private mpBar: Node = null;

  onLoad() {
    this.hpBar = this.player.getChildByName("Hp");
    this.mpBar = this.player.getChildByName("Mp");
    this.playerScript = this.player.getComponent("Character");
  }

  start() {}

  update(deltaTime: number) {}
}
