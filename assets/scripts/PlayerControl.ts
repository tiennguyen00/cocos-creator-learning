import {
  _decorator,
  Component,
  EventKeyboard,
  input,
  Input,
  KeyCode,
  Node,
  Animation,
  tween,
  Vec3,
  find,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerControl")
export class PlayerControl extends Component {
  @property(Node)
  public player: Node = null;

  private animationComponent: Animation = null;
  private groundScript = null;
  public jumpDuration = 0.5;
  public jumpHeight = 200;

  start() {}
  protected onLoad(): void {
    this.animationComponent = this.getComponent(Animation);
    this.groundScript = find("Canvas/Backround").getComponent("Ground");
    // this.buttonScript = find("Canvas/btnL").getComponent("btnR");

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  onKeyDown(event: EventKeyboard) {
    const scale = this.player.getScale();
    // this.animationComponent.play("run");
    switch (event.keyCode) {
      case KeyCode.KEY_A:
        this.animationComponent.play("run");
        this.player.setScale(-Math.abs(scale.x), scale.y, scale.z);
        this.groundScript.speed = 400;

        break;
      case KeyCode.KEY_D:
        this.animationComponent.play("run");
        this.player.setScale(Math.abs(scale.x), scale.y, scale.z);
        this.groundScript.speed = -400;
        break;
      case KeyCode.SPACE:
        this.animationComponent.stop();
        tween(this.player.position)
          .to(
            this.jumpDuration,
            new Vec3(
              this.player.position.x,
              this.player.position.y + this.jumpHeight,
              0
            ),
            {
              easing: "smooth",
              onUpdate: (target: Vec3) => {
                this.player.setPosition(target);
              },
            }
          )
          .start();
        break;
    }
  }

  onKeyUp(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.KEY_A:
      case KeyCode.KEY_D:
        this.animationComponent.play("idle");
        this.groundScript.speed = 0;
        break;
    }
  }

  update(deltaTime: number) {}
}
