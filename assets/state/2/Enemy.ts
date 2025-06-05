import {
  _decorator,
  Node,
  RigidBody2D,
  find,
  Animation,
  BoxCollider2D,
} from "cc";
const { ccclass, property } = _decorator;
import { Base, BaseState } from "../Base";

@ccclass("Enemy")
export class Enemy extends Base {
  @property
  moveSpeed: number = 1 / 5;

  @property
  attackRange: number = 50;

  @property
  detectRange: number = 200;

  attackDamage: number = 1;
  @property
  attackCooldown: number = 2;

  @property
  stunForce: number = 5;

  private attackTimer = 0;

  private stunTimer = 0;

  private anim: Animation;
  private body: RigidBody2D;
  public player: Node = null;
  public playerScript = null;
  private colliderHitbox: BoxCollider2D;

  private eslaped = 0;
  private rangePos = 200;

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.player = find("Canvas/GirlCharacter");
    this.playerScript = this.player.getComponent("Character");
    this.colliderHitbox = this.getComponentInChildren(BoxCollider2D);
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

    const distanceToPlayer = this.node.position
      .clone()
      .subtract(this.player.position)
      .length();

    // console.log("distanceToPlayer: ", distanceToPlayer);

    if (this.health <= 0) {
      this.changeState(BaseState.DEAD);
    } else if (distanceToPlayer <= this.attackRange) {
      if (this.attackTimer === 0) {
        this.anim.play("atk");
        this.changeState(BaseState.ATTACK, "atk");
        this.playerScript?.changeState(BaseState.HURT, "hurt1");
        this.attackTimer = this.attackCooldown;
      }
    } else if (distanceToPlayer <= this.attackRange + 250) {
      this.changeState(BaseState.RUN, "run");
      if (this.node.x > this.player.x + this.attackRange) {
        this.node.x -= this.moveSpeed * dt;
        this.node.setRotationFromEuler(0, 0, 0);
        this.colliderHitbox.offset.x = -Math.abs(this.colliderHitbox.offset.x);
      } else {
        this.node.x += this.moveSpeed * dt;
        this.node.setRotationFromEuler(0, -180, 0);
        this.colliderHitbox.offset.x = Math.abs(this.colliderHitbox.offset.x);
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

    // switch (newState) {
    //   case BaseState.ATTACK:
    //     this.unscheduleAllCallbacks();
    //     this.scheduleOnce(() => {
    //       this.anim.play("run");
    //       this.changeState(BaseState.RUN);
    //     }, this.attackCooldown);
    //     break;
    // }
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
