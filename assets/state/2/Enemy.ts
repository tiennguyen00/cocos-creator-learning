import { _decorator, Node, find, Animation, BoxCollider2D } from "cc";
const { ccclass, property } = _decorator;
import { Base, BaseState } from "../Base";

@ccclass("Enemy")
export class Enemy extends Base {
  @property
  moveSpeed: number = 1 / 5;

  @property
  attackRange: number = 50;

  @property
  detectRange: number = 500;

  attackDamage: number = 1;
  @property
  attackCooldown: number = 2;

  @property
  stunForce: number = 5;

  private attackTimer = 0;

  private stunTimer = 0;

  private anim: Animation;
  private hitBoxEne: Node = null;
  public player: Node = null;
  public playerScript = null;

  private eslaped = 0;
  private rangePos = 200;

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.hitBoxEne = this.node.getChildByName("hitboxEne");
    this.player = find("Canvas/GirlCharacter");
    this.playerScript = this.player.getComponent("Character");
  }

  start() {
    this.node.setRotationFromEuler(0, -180, 0);
  }

  preventChangingState() {
    return (
      this.state === BaseState.DEAD ||
      (this.state === BaseState.HURT && this.stunTimer > 0)
    );
  }

  changeAnim(anim: string) {
    this.anim.stop();
    this.anim.play(anim);
  }

  updateState(dt: number) {
    if (this.preventChangingState()) return;
    const enePos = this.hitBoxEne.getWorldPosition().x;
    const charPos = this.player.getWorldPosition().x;
    const distanceToPlayer = Math.abs(enePos - charPos);

    if (distanceToPlayer <= this.attackRange) {
      if (this.attackTimer === 0) {
        this.anim.play("atk");
        this.changeState(BaseState.ATTACK, "atk");
        this.playerScript?.changeState(BaseState.HURT, "hurt1");
        this.attackTimer = this.attackCooldown;
      }
    } else if (
      distanceToPlayer <= this.detectRange &&
      distanceToPlayer >= this.moveSpeed
    ) {
      this.changeState(BaseState.RUN, "run");
      if (enePos > charPos) {
        this.node.x -= this.moveSpeed;
        if (distanceToPlayer > 100) {
          this.node.setRotationFromEuler(0, 0, 0); // face left
        }
      } else {
        this.node.x += this.moveSpeed;
        if (distanceToPlayer > 100) {
          this.node.setRotationFromEuler(0, -180, 0); // face right
        }
      }
    } else {
      this.changeState(BaseState.IDLE, "walk");
    }
  }

  changeState(newState: BaseState, anim?: string) {
    if (this.state === newState) return;

    this.state = newState;

    if (newState === BaseState.HURT) {
      this.stunTimer = this.stunForce;
    }

    this.changeAnim(anim);
  }

  update(dt: number) {
    this.eslaped += dt;

    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
    } else {
      this.stunTimer = 0;
    }

    if (this.attackTimer > 0) {
      this.attackTimer -= dt;
    } else {
      this.attackTimer = 0;
    }

    this.updateState(dt);
  }
}
