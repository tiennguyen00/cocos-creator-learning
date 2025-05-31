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
  Contact2DType,
  Collider2D,
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

  private jumpCount = 0;
  private jumpMax = 2;

  private comboStep = 0;
  private comboTimer = 0;
  private maxCompoTime = 1;

  private state: CharacterState = CharacterState.IDLE;
  private anim: Animation;
  private body: RigidBody2D;
  private collider: BoxCollider2D;

  private moveDir: number = 0;

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.body = this.getComponent(RigidBody2D);
    this.collider = this.getComponent(BoxCollider2D);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    this.onLanded();
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
        if (event.keyCode === KeyCode.SPACE && this.jumpCount < this.jumpMax) {
          this.body.linearVelocity = new Vec2(this.body.linearVelocity.x, 0);
          this.body.applyLinearImpulseToCenter(
            new Vec2(0, this.jumpForce),
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
    this.comboTimer = this.maxCompoTime;

    if (this.comboTimer > 0) {
      this.comboStep = (this.comboStep + 1) % 5;
    } else {
      this.comboStep = 0;
    }

    this.playComboAnimation(this.comboStep);
  }

  private playComboAnimation(step: number) {
    const state = this.anim.getState(`atk${step == 0 ? 1 : step}`);

    if (state) {
      state.stop(); // Ensure restart even if same
      state.play();
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

  start() {}

  update(dt: number) {
    // Handle left/right movement
    if (
      this.state !== CharacterState.DEAD &&
      this.state !== CharacterState.HURT
    ) {
      this.body.linearVelocity = new Vec2(
        this.moveDir * this.moveSpeed,
        this.body.linearVelocity.y
      );
    }
    // Handle combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
    } else {
      this.comboStep = 0;
    }

    this.updateState();
  }
}
