import {
  _decorator,
  Component,
  Input,
  input,
  Animation,
  RigidBody2D,
  EventKeyboard,
  KeyCode,
  Vec2,
  Collider2D,
  BoxCollider2D,
  Contact2DType,
  find,
  AudioSource,
} from "cc";
import { Base, BaseState } from "./Base";
const { ccclass, property } = _decorator;

@ccclass("Character")
export class Character extends Base {
  @property
  moveSpeed: number = 300;

  @property
  jumpForce: number = 600;

  @property
  hitForce: number = 5;

  @property
  stunForce: number = 5;

  @property
  maxCompoTime: number = 1;

  hitBox: BoxCollider2D = null;

  private jumpCount = 0;
  private jumpMax = 2;

  private comboStep = 0;
  private comboTimer = 0;

  private stunTimer = 0;

  private hitTimer = 0;

  private anim: Animation;
  private body: RigidBody2D;
  private collider: BoxCollider2D;
  private audioSource: AudioSource;
  private moveDir: number = 0;

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.body = this.getComponent(RigidBody2D);
    this.collider = this.getComponent(BoxCollider2D);
    this.audioSource = this.getComponent(AudioSource);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    this.hitBox = find("Canvas/GirlCharacter/hitbox").getComponent(
      BoxCollider2D
    );
  }

  start() {
    this.init(100, 10, 50);
    this.changeAnim("idle1");
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    if (otherCollider.node.name === "hitboxEne") {
      console.log("Character: hitboxEne");
      this.audioSource.play();
    } else if (otherCollider.node.name === "ground") {
      this.onLanded();
    }
  }

  preventChangingState() {
    return (
      this.state === BaseState.DEAD ||
      (this.state === BaseState.HURT && this.stunTimer > 0)
    );
  }

  updateState() {
    if (this.preventChangingState()) return;

    if (this.jumpCount > 0) {
      this.changeState(BaseState.JUMP, "jump1");
    } else if (this.moveDir !== 0) {
      this.changeState(BaseState.RUN, "walk1");
    } else if (this.comboStep > 0) {
      this.changeState(BaseState.ATTACK);
    } else {
      this.changeState(BaseState.IDLE, "idle1");
    }
  }

  changeAnim(anim: string) {
    this.anim.stop();
    this.anim.play(anim);
  }

  changeState(newState: BaseState, anim?: string) {
    if (this.state === newState) return;
    this.state = newState;
    // console.log("State:", newState);

    // handle stun
    if (this.state === BaseState.HURT) {
      this.stunTimer = this.stunForce;
    }
    this.changeAnim(anim);
  }

  onKeyDown(event: EventKeyboard) {
    if (this.preventChangingState()) return;

    switch (event.keyCode) {
      case KeyCode.KEY_A:
        this.moveDir = -1;
        this.node.setScale(-1, 1, 1);
        break;
      case KeyCode.KEY_D:
        this.moveDir = 1;
        this.node.setScale(1, 1, 1);

        break;
      case KeyCode.SPACE:
      case KeyCode.KEY_W:
        if (this.jumpCount < this.jumpMax) {
          this.body.linearVelocity = new Vec2(this.body.linearVelocity.x, 0);
          this.body.applyLinearImpulseToCenter(
            new Vec2(0, this.jumpForce / Math.min(1.5, this.jumpCount + 1)),
            true
          );
          this.jumpCount++;
        }
        break;
      case KeyCode.KEY_E:
        this.onCombo();
        break;
    }
  }
  onKeyUp(event: EventKeyboard) {
    if (event.keyCode === KeyCode.KEY_A || event.keyCode === KeyCode.KEY_D) {
      this.moveDir = 0;
    }
  }

  public onLanded() {
    this.jumpCount = 0;
  }

  public onCombo() {
    // prevent combo when the character is moving
    this.moveDir = 0;
    // prevent spamming combo
    if (this.comboTimer >= 0.2) return;

    this.hitTimer = 0.25;
    this.comboTimer = this.maxCompoTime;

    if (this.comboTimer > 0) {
      if (this.comboStep == 3) {
        this.comboStep = 1;
      } else this.comboStep = (this.comboStep + 1) % 4;
    } else {
      this.comboStep = 0;
    }

    this.playComboAnimation(this.comboStep);
  }

  private playComboAnimation(step: number) {
    const state = this.anim.getState(`atk${step}`);

    if (state) {
      state.stop();
      state.play();
      this.node.emit("compo-attack", step);
    }
  }

  update(dt: number) {
    // Handle left/right movement
    if (this.hitTimer > 0) {
      this.hitTimer -= dt;
    } else {
      this.hitTimer = 0;
    }

    // Handle stun timer
    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
    } else {
      this.stunTimer = 0;
    }

    // Handle combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
    } else {
      this.comboStep = 0;
    }

    if (this.state !== BaseState.DEAD && this.state !== BaseState.HURT) {
      this.body.linearVelocity = new Vec2(
        this.moveDir * this.moveSpeed +
          this.hitTimer * this.hitForce * this.node.scale.x,
        this.body.linearVelocity.y
      );
    }

    this.updateState();
  }
}
