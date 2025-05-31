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
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerControl")
export class PlayerControl extends Component {
  @property(Node)
  public player: Node = null;

  private animationComponent: Animation = null;
  public jumpDuration = 0.5;
  public jumpHeight = 200;
  public speed: number;
  public hitForce: number;
  private playerSprite = null;

  start() {}
  protected onLoad(): void {
    this.speed = 0;
    this.hitForce = 0;
    this.animationComponent = this.getComponent(Animation);
    this.playerSprite = this.getComponent("PlayerSprite");

    // this.buttonScript = find("Canvas/btnL").getComponent("btnR");

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  onKeyDown(event: EventKeyboard) {
    const scale = this.player.getScale();
    // this.animationComponent.play("run");
    switch (event.keyCode) {
      case KeyCode.KEY_A:
        if (this.playerSprite.state == "idle") {
          this.animationComponent.play("run");
        }
        this.player.setScale(-Math.abs(scale.x), scale.y, scale.z);
        this.speed = -400;
        break;
      case KeyCode.KEY_D:
        if (this.playerSprite.state == "idle") {
          this.animationComponent.play("run");
        }
        this.player.setScale(Math.abs(scale.x), scale.y, scale.z);
        this.speed = 400;
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
        if (this.playerSprite.state == "idle") {
          this.animationComponent.play("idle");
        }
        this.speed = 0;
        break;
    }
  }

  update(deltaTime: number) {
    if (this.playerSprite.state == "idle") {
      this.node.x += this.speed * deltaTime;
    }
    this.node.x += this.hitForce * Math.sign(this.player.getScale().x);
    if (this.hitForce > 0) {
      this.hitForce -= 1;
    } else if (this.hitForce < 0) {
      this.hitForce = 0;
    }
  }
}
