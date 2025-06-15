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
  Prefab,
  Node,
} from "cc";
import { Base, BaseState } from "./Base";
import { ObjectPool } from "./ObjectPool";
import { PersistNode } from "../scripts/PersistNode";
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

  @property
  dashForce: number = 10;

  @property(Prefab)
  dashEffect: Prefab = null;

  @property(Prefab)
  powerUpEffect: Prefab = null;

  hitBox: BoxCollider2D = null;

  private persistScript = null;

  private jumpCount = 0;
  private jumpMax = 2;

  private comboStep = 0;
  private comboTimer = 0;

  private stunTimer = 0;

  private hitTimer = 0;

  private dashDuration = 0.3;
  private dashTimer = 0;

  private anim: Animation;
  private body: RigidBody2D;
  private collider: BoxCollider2D;
  private audioSource: AudioSource[];
  private moveDir: number = 0;
  private hpBar: ProgressBar = null;
  private mpBar: ProgressBar = null;
  private maxHealth: number = 150;
  private attackPower: number = 10;
  private maxStamina: number = 100;

  private ballPool = null;
  private powerUpTimer = 0;

  private dashPool = null;

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.body = this.getComponent(RigidBody2D);
    this.collider = this.getComponent(BoxCollider2D);
    this.audioSource = find("Canvas/GirlCharacter/sound").getComponents(
      AudioSource
    );
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
    this.init(this.maxHealth, this.attackPower, this.maxStamina);
    this.ballPool = new ObjectPool(this.powerUpEffect, this.node.parent);
    this.dashPool = new ObjectPool(this.dashEffect, this.node.parent, 7);
    this.anim.play("idle1");

    this.persistScript =
      find("PersistNode").getComponent(PersistNode)?.charScript;

    this.hpBar.progress = this.persistScript.health / this.maxHealth;
    this.mpBar.progress = this.persistScript.stamina / this.maxStamina;
  }

  public onPowerUpAnimEnd() {
    this.changeState(BaseState.IDLE, "idle1");
  }

  onDestroy() {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    this.ballPool.clear();
    this.dashPool.clear();
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    if (otherCollider.node.name === "hitboxEne") {
      console.log("Character: hitboxEne: ", this.persistScript.state);

      this.persistScript?.takeDamage(15);
      this.hpBar.progress = this.persistScript?.health / this.maxHealth;
      if (this.persistScript?.health <= 0) {
        this.anim.play("dead1");
        return;
      }
      this.changeState(BaseState.HURT, "hurt1");
      this.body.applyLinearImpulseToCenter(new Vec2(80, 80), true);
      this.audioSource[6].play();
    } else if (otherCollider.node.name === "ground") {
      if (this.anim.getState("jump1").isPlaying) {
        // temp recaculate the animation when user land
        if (this.moveDir !== 0) {
          this.changeState(BaseState.RUN, "walk1");
        } else {
          this.changeState(BaseState.IDLE, "idle1");
        }
      }
      this.onLanded();
    }
  }

  preventChangingState() {
    return (
      this.persistScript.state === BaseState.DEAD ||
      (this.persistScript.state === BaseState.HURT && this.stunTimer > 0) ||
      this.persistScript.state === BaseState.POWER_UP
    );
  }

  updateState() {
    if (this.preventChangingState()) return;

    if (this.dashTimer !== 0) {
      this.changeState(BaseState.DASH, "dash1");
    } else if (this.jumpCount !== 0) {
      this.changeState(BaseState.JUMP, "jump1");
    } else if (this.moveDir !== 0) {
      this.changeState(BaseState.RUN, "walk1");
    } else if (this.comboStep !== 0) {
      this.changeState(BaseState.ATTACK, "atk1");
    } else {
      this.changeState(BaseState.IDLE, "idle1");
    }
  }

  changeAnim(anim: string) {
    this.anim.stop();
    this.anim.play(anim);
  }

  changeState(newState: BaseState, anim?: string) {
    if (this.persistScript.state === newState) return;
    this.persistScript.state = newState;
    console.log("Char State:", newState);

    // handle stun
    if (this.persistScript.state === BaseState.HURT) {
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
  }
  onRun(dir: 1 | -1) {
    this.moveDir = dir;
    this.node.setScale(dir, 1, 1);
  }

  onCombo() {
    if (this.persistScript?.stamina < this.attackPower) return;

    this.moveDir = 0;
    //is onn air?
    if (this.jumpCount > 0) {
      this.body.linearDamping += 10;
    }
    // prevent spamming combo
    if (this.comboTimer >= 0.2) return;

    if (this.persistScript.isPoweringUp) {
      this.audioSource[5].play();
      const powerEffect = this.ballPool.get();
      powerEffect.setPosition(this.node.position);
      this.powerUpTimer = 0.7;
      this.scheduleOnce(() => {
        this.ballPool.put(powerEffect);
      }, this.powerUpTimer);
    }

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

  onKeyDown(event: EventKeyboard) {
    if (this.preventChangingState()) return;

    switch (this.persistScript.state) {
      case BaseState.IDLE:
        if (event.keyCode === KeyCode.KEY_A) {
          this.onRun(-1);
        } else if (event.keyCode === KeyCode.KEY_D) {
          this.onRun(1);
        } else if (event.keyCode === KeyCode.SPACE) {
          this.onJump();
        } else if (event.keyCode === KeyCode.KEY_E) {
          this.onCombo();
        } else if (event.keyCode === KeyCode.SHIFT_LEFT) {
          this.onDash();
        } else if (event.keyCode === KeyCode.KEY_Q) {
          this.onChangeSuperMode();
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
        } else if (event.keyCode === KeyCode.SHIFT_LEFT) {
          this.onDash();
        }
        break;
      case BaseState.RUN:
        if (event.keyCode === KeyCode.SPACE) {
          this.onJump();
        } else if (event.keyCode === KeyCode.KEY_E) {
          this.onCombo();
        } else if (event.keyCode === KeyCode.SHIFT_LEFT) {
          this.onDash();
        }
        break;
    }
  }
  onKeyUp(event: EventKeyboard) {
    if (event.keyCode === KeyCode.KEY_A || event.keyCode === KeyCode.KEY_D) {
      this.moveDir = 0;
    }
  }

  public onDash() {
    if (!this.persistScript?.dash(35)) return;
    this.dashTimer = this.dashDuration;
    this.onDashEffect();
    this.node.emit("on-dash");
  }

  private onDashEffect() {
    const delays = [0.1, 0.12, 0.14, 0.16, 0.18, 0.2];

    for (const delay of delays) {
      this.scheduleOnce(() => {
        const dashEffect = this.dashPool.get();
        dashEffect.setPosition(this.node.position);

        this.scheduleOnce(() => {
          // this.dashPool.put(dashEffect);
          dashEffect.destroy();
        }, this.dashDuration);
      }, delay);
    }
  }

  public onLanded() {
    this.jumpCount = 0;
  }

  public onChangeSuperMode() {
    this.persistScript.isPoweringUp = !this.persistScript?.isPoweringUp;
    this.changeState(BaseState.POWER_UP, "power_up");
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

    if (this.dashTimer > 0) {
      this.dashTimer -= dt;
    } else {
      this.dashTimer = 0;
    }

    this.body.linearVelocity = new Vec2(
      this.moveDir * this.moveSpeed +
        this.node.scale.x *
          (this.hitTimer * this.hitForce + this.dashTimer * this.dashForce),
      this.body.linearVelocity.y
    );

    if (
      this.persistScript?.stamina < this.maxStamina &&
      this.persistScript.state !== BaseState.DEAD
    ) {
      this.persistScript?.takeStaminaRest(dt * 10);
      this.mpBar.progress = this.persistScript?.stamina / this.maxStamina;
    }

    this.updateState();
  }
}
