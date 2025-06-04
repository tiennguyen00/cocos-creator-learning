import {
  _decorator,
  Component,
  Node,
  Vec3,
  Quat,
  BoxCollider2D,
  RigidBody2D,
  find,
  Animation,
} from "cc";
const { ccclass, property } = _decorator;

export enum EnemyState {
  PATROL = "PATROL",
  ATTACK = "ATTACK",
  CHASE = "CHASE",
  DEAD = "DEAD",
  HIT = "HIT",
}

@ccclass("Enemy")
export class Enemy extends Component {
  @property
  moveSpeed: number = 1 / 5;

  @property
  attackRange: number = 15;

  @property
  attackCooldown: number = 1;

  @property
  health: number = 100;

  private _state: EnemyState = EnemyState.PATROL;
  private anim: Animation;
  private body: RigidBody2D;
  private player: Node = null;

  private originPos;
  private eslaped = 0;
  private rangePos = 200;

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.player = find("Canvas/GirlCharacter");
  }

  start() {
    this.originPos = this.node.x;
    this.node.setRotationFromEuler(0, -180, 0);
  }

  updateState() {
    if (this._state === EnemyState.DEAD) return;

    const distanceToPlayer = this.node.position
      .clone()
      .subtract(this.player.position)
      .length();

    if (this.health <= 0) {
      this.changeState(EnemyState.DEAD);
    } else if (distanceToPlayer <= this.attackRange) {
      this.changeState(EnemyState.ATTACK);
    } else if (distanceToPlayer <= this.attackRange + 250) {
      this.changeState(EnemyState.CHASE);
      if (this.node.x > this.player.x) {
        this.node.x -= this.moveSpeed * 0.01;
        this.node.setRotationFromEuler(0, 0, 0);
      } else {
        this.node.x += this.moveSpeed * 0.01;
        this.node.setRotationFromEuler(0, -180, 0);
      }
    } else {
      this.changeState(EnemyState.PATROL);
    }
  }

  changeState(newState: EnemyState) {
    if (this._state === newState) return;
    this._state = newState;
    switch (newState) {
      case EnemyState.PATROL:
        this.anim.play("walk");
        break;
      case EnemyState.CHASE:
        this.anim.play("run");
        break;
      case EnemyState.ATTACK:
        this.anim.play("atk");
        setTimeout(() => {
          this.anim.play("walk");
          this.changeState(EnemyState.CHASE);
        }, 2000);
        break;
      case EnemyState.DEAD:
        this.anim.play("dead");
        break;
    }
  }

  update(dt: number) {
    this.eslaped += dt;
    this.updateState();
    // if (this.node.x >= this.originPos + this.rangePos - 10) {
    //   this.node.setRotationFromEuler(0, 0, 0);
    // } else if (this.node.x <= this.originPos - this.rangePos + 10) {
    //   this.node.setRotationFromEuler(0, -180, 0);
    // }
    // this.node.x =
    //   this.originPos + Math.sin(this.moveSpeed * this.eslaped) * this.rangePos;
  }
}
