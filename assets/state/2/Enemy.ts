import {
  _decorator,
  Node,
  find,
  Animation,
  BoxCollider2D,
  Vec3,
  director,
  game,
} from "cc";
const { ccclass, property } = _decorator;
import { Base, BaseState } from "../Base";
import {
  ActionNode,
  BTStatus,
  ConditionNode,
  SelectorNode,
  SequenceNode,
} from "./Nodes";

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

  @property
  maxHealth: number = 100;

  @property
  power: number = 10;

  @property
  isFly: boolean = false;

  private attackTimer = 0;

  private stunTimer = 0;
  private hitBackTimer = 0;

  private anim: Animation;
  private hitBoxEne: Node = null;
  public player: Node = null;
  public playerScript = null;

  private eslaped = 0;

  private btRoot: SelectorNode;

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.hitBoxEne = this.node.getChildByName("hitboxEne");
    this.player = find("Canvas/GirlCharacter");
    this.playerScript = this.player.getComponent("Character");
    this.init(this.maxHealth, this.power, -1);
  }

  start() {
    this.btRoot = new SelectorNode([
      new ConditionNode(
        () => this.isDead() || this.playerScript.state === BaseState.DEAD
      ),
      new ConditionNode(() => this.isHurt() && this.isStun()),
      new SequenceNode([
        new ConditionNode(() => this.isPlayerInAttackRange()),
        new ActionNode(() => this.attackPlayer()),
      ]),
      new SequenceNode([
        new ConditionNode(() => this.canSeePlayer()),
        new ActionNode(() => this.chasePlayer()),
      ]),
      new ActionNode(() => this.patrolArea()),
    ]);
  }

  isHurt(): boolean {
    return this.state === BaseState.HURT;
  }

  isDead(): boolean {
    return this.state === BaseState.DEAD;
  }

  isStun(): boolean {
    return this.stunTimer > 0;
  }

  isPlayerInAttackRange(): boolean {
    const dist = Vec3.distance(
      this.hitBoxEne.worldPosition,
      this.player.worldPosition
    );
    // console.log("isPlayerInAttackRange: ", dist);
    return (
      dist <= this.attackRange || this.playerScript.state === BaseState.HURT
    );
  }

  canSeePlayer(): boolean {
    const dist = Vec3.distance(
      this.hitBoxEne.worldPosition,
      this.player.worldPosition
    );
    return dist <= this.detectRange;
  }

  attackPlayer(): BTStatus {
    if (this.attackTimer === 0) {
      this.changeState(BaseState.ATTACK);
      this.anim.play("atk");
      this.attackTimer = this.attackCooldown;
    } else {
      if (
        !this.anim.getState("idle").isPlaying &&
        !this.anim.getState("atk").isPlaying
      ) {
        this.changeState(BaseState.IDLE);
        this.anim.play("idle");
      }
    }
    return BTStatus.SUCCESS;
  }

  chasePlayer(): BTStatus {
    const enePos = this.hitBoxEne.worldPosition;
    const charPos = this.player.worldPosition;
    const direction = new Vec3();
    Vec3.subtract(direction, charPos, enePos);
    if (Math.abs(direction.x) > 100) {
      this.node.setRotationFromEuler(0, direction.x > 0 ? -180 : 0, 0);
    }
    direction.normalize();

    // Move enemy toward player
    const moveStep = direction.multiplyScalar(this.moveSpeed);
    if (!this.isFly) moveStep.y = 0;
    this.node.setWorldPosition(this.node.worldPosition.add(moveStep));

    if (this.isFly) {
      if (!this.anim.getState("idle")?.isPlaying) {
        this.changeState(BaseState.IDLE);
        this.anim.play("idle");
      }
    } else {
      if (!this.anim.getState("run")?.isPlaying) {
        this.changeState(BaseState.RUN);
        this.anim.play("run");
      }
    }

    return BTStatus.RUNNING;
  }

  patrolArea(): BTStatus {
    return BTStatus.RUNNING;
  }

  changeState(newState: BaseState) {
    if (this.state === newState || this.state === BaseState.DEAD) return;

    this.state = newState;

    if (newState === BaseState.HURT) {
      this.stunTimer = this.stunForce;
    }

    // console.log("changeState: ", newState);
  }

  update(dt: number) {
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

    if (this.hitBackTimer > 0) {
      this.hitBackTimer -= dt;
      this.node.setPosition(
        this.node.position.x + this.hitBackTimer * 50 * this.player.scale.x,
        this.node.position.y
      );
    } else {
      this.hitBackTimer = 0;
    }
    this.btRoot.tick();
  }
}
