import {
  _decorator,
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
  ProgressBar,
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
  private hpBar: ProgressBar = null;
  private mpBar: ProgressBar = null;
  private maxHealth: number = 250;

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.body = this.getComponent(RigidBody2D);
    this.collider = this.getComponent(BoxCollider2D);
    this.audioSource = this.getComponent(AudioSource);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    this.hitBox = find("Canvas/GirlCharacter/hitbox").getComponent(
      BoxCollider2D
    );
    this.hpBar = find("Canvas/UICamera/CharStas/Hp").getComponent(ProgressBar);
    this.mpBar = find("Canvas/UICamera/CharStas/Mp").getComponent(ProgressBar);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  start() {
    this.init(this.maxHealth, 10, 100);
    this.changeAnim("idle1");
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    if (otherCollider.node.name === "hitboxEne") {
      console.log("Character: hitboxEne");
      // effect when user was hit by enemy
      this.takeDamage(10);
      this.hpBar.progress = this.health / this.maxHealth;
      this.changeState(BaseState.HURT, "hurt1");
      this.body.applyLinearImpulseToCenter(new Vec2(80, 80), true);
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
    if (this.jumpCount === 0 && this.moveDir === 0 && this.comboStep === 0) {
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
    // console.log("Char State:", newState);

    // handle stun
    if (this.state === BaseState.HURT) {
      this.stunTimer = this.stunForce;
    }
    this.changeAnim(anim);
  }

  onJump() {
    if (
      this.jumpCount < this.jumpMax &&
      Math.abs(this.body.linearVelocity.y) < 3
    ) {
      this.body.applyLinearImpulseToCenter(
        new Vec2(0, this.jumpForce / Math.min(1.25, this.jumpCount + 1)),
        true
      );
      this.jumpCount++;
    }
    this.changeState(BaseState.JUMP, "jump1");
  }
  onRun(dir: 1 | -1) {
    this.moveDir = dir;
    this.node.setScale(dir, 1, 1);
    this.changeState(BaseState.RUN, "walk1");
  }

  onCombo() {
    this.moveDir = 0;
    //is onn air?
    if (this.jumpCount > 0) {
      this.body.linearDamping = 10;
    }
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
    this.changeState(BaseState.ATTACK, "atk1");
  }

  private playComboAnimation(step: number) {
    const state = this.anim.getState(`atk${step}`);
    if (state) {
      state.stop();
      state.play();
      this.node.emit("compo-attack", step);
    }
  }

  onKeyDown(event: EventKeyboard) {
    if (this.preventChangingState()) return;

    switch (this.state) {
      case BaseState.IDLE:
        if (event.keyCode === KeyCode.KEY_A) {
          this.onRun(-1);
        } else if (event.keyCode === KeyCode.KEY_D) {
          this.onRun(1);
        } else if (event.keyCode === KeyCode.SPACE) {
          this.onJump();
        } else if (event.keyCode === KeyCode.KEY_E) {
          this.onCombo();
        }
        break;
      case BaseState.ATTACK:
        if (event.keyCode === KeyCode.SPACE) {
          this.onJump();
        } else if (event.keyCode === KeyCode.KEY_E) {
          this.onCombo();
        }
        break;
      case BaseState.JUMP:
        if (event.keyCode === KeyCode.KEY_E) {
          this.onCombo();
        } else if (event.keyCode === KeyCode.SPACE) {
          this.onJump();
        } else if (event.keyCode === KeyCode.KEY_A) {
          this.onRun(-1);
        } else if (event.keyCode === KeyCode.KEY_D) {
          this.onRun(1);
        }
        break;
      case BaseState.RUN:
        if (event.keyCode === KeyCode.SPACE) {
          this.onJump();
        }
        if (event.keyCode === KeyCode.KEY_E) {
          this.onCombo();
        }
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
      this.body.linearDamping = 0;
      this.comboStep = 0;
    }

    this.body.linearVelocity = new Vec2(
      this.moveDir * this.moveSpeed +
        this.hitTimer * this.hitForce * this.node.scale.x,
      this.body.linearVelocity.y
    );

    this.updateState();
  }
}
