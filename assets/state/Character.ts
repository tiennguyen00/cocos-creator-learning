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
  BoxCollider2D,
} from "cc";
const { ccclass, property } = _decorator;

export enum CharacterState {
  IDLE = "IDLE",
  RUN = "RUN",
  ATTACK = "ATTACK",
  JUMP = "JUMP",
  DEAD = "DEAD",
  HURT = "HURT",
}

@ccclass("Character")
export class Character extends Component {
  @property
  moveSpeed: number = 300;

  @property
  jumpForce: number = 600;

  @property
  hitForce: number = 5;

  @property
  maxCompoTime: number = 1;

  private jumpCount = 0;
  private jumpMax = 2;

  private comboStep = 0;
  private comboTimer = 0;

  private hitTimer = 0;

  private _state: CharacterState = CharacterState.IDLE;
  private anim: Animation;
  private body: RigidBody2D;

  private moveDir: number = 0;

  public get state(): CharacterState {
    return this._state;
  }
  public set state(newState: CharacterState) {
    if (this._state !== newState) {
      this._state = newState;
    }
  }

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.body = this.getComponent(RigidBody2D);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  start() {
    this.anim.play("idle1");
  }

  updateState() {
    if (
      this.state === CharacterState.DEAD ||
      this.state === CharacterState.HURT
    )
      return;

    if (this.jumpCount > 0) {
      this.changeState(CharacterState.JUMP, "jump1");
    } else if (this.moveDir !== 0) {
      this.changeState(CharacterState.RUN, "walk1");
    } else if (this.comboStep > 0) {
      this.changeState(CharacterState.ATTACK);
    } else {
      this.changeState(CharacterState.IDLE, "idle1");
    }
  }

  changeState(newState: CharacterState, anim?: string) {
    if (this.state === newState) return;
    this.state = newState;
    console.log("State:", newState);
    this.anim.play(anim);
  }

  onKeyDown(event: EventKeyboard) {
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

  public takeDamage() {
    if (this.state === CharacterState.DEAD) return;
    this.changeState(CharacterState.HURT);
    // Optional: after a delay, return to Idle
    setTimeout(() => {
      this.changeState(CharacterState.IDLE, "idle1");
    }, 500);
  }

  public die() {
    this.changeState(CharacterState.DEAD);
  }

  update(dt: number) {
    // Handle left/right movement
    if (this.hitTimer > 0) {
      this.hitTimer -= dt;
    }

    // Handle combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
    } else {
      this.comboStep = 0;
    }

    if (
      this.state !== CharacterState.DEAD &&
      this.state !== CharacterState.HURT
    ) {
      this.body.linearVelocity = new Vec2(
        this.moveDir * this.moveSpeed +
          this.hitTimer * this.hitForce * this.node.scale.x,
        this.body.linearVelocity.y
      );
    }

    this.updateState();
  }
}
