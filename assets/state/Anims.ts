import { _decorator, Component, Node, Animation } from "cc";
import { BaseState } from "./Base";
const { ccclass, property } = _decorator;

@ccclass("Anims")
export class Anims extends Component {
  @property(Node)
  public character: Node = null;

  private anim: Animation;

  onLoad() {
    this.anim = this.character.getComponent(Animation);
    this.character.on("state-change", this.playAnims, this);
    this.character.emit("compo-attack", this.playAtkCombo, this);
  }

  playAnims(state: BaseState) {
    switch (state) {
      case BaseState.IDLE:
        this.anim.play("idle1");
        break;
      case BaseState.RUN:
        this.anim.play("walk1");
        break;
      case BaseState.JUMP:
        this.anim.play("jump1");
        break;
    }
  }

  start() {
    this.anim.play("idle1");
  }

  private playAtkCombo(step: number) {
    console.log("_step: ", step);
    const state = this.anim.getState(`atk${step}`);

    state.play();
  }

  update(dt: number) {
    // Handle combo timer
  }
}
