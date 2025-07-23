import {
  _decorator,
  Node,
  find,
  Animation,
  BoxCollider2D,
  Vec3,
  Prefab,
  instantiate,
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
import { RewardManager } from "../../scripts/RewardManager";

@ccclass("Enemy")
export class Enemy extends Base {
  @property
  moveSpeed: number = 1 / 5;

  @property
  attackRange: number = 50;

  @property
  detectRange: number = 500;

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

  @property(Prefab)
  public rewardCoin: Prefab = null;

  private attackTimer = 0;

  private stunTimer = 0;
  private hitBackTimer = 0;

  private anim: Animation;
  private hitBoxEne: Node = null;
  public player: Node = null;
  public persistScript = null;
  private playerScript = null;

  private btRoot: SelectorNode;

  onLoad() {
    this.anim = this.getComponent(Animation);
    this.hitBoxEne = this.node.getChildByName("hitboxEne");
    this.player = find("Canvas/GirlCharacter");

    this.init(this.maxHealth, this.power, -1);
    this.persistScript = find("PersistNode").getComponent("PersistScript");
  }

  start() {
    console.log("Strt: ", this.rewardCoin);

    // Register the observer for this enemy
    const reward = new RewardManager("Enemies", () => {
      if (this.rewardCoin) {
        const reward = instantiate(this.rewardCoin);
        reward.parent = this.node.parent;
        reward.setPosition(this.node.position);

        console.log("Node parent: ", this.node.parent);
        console.log("Node position: ", this.node.position);
      }
    });
    this.subject.addObserver(reward);

    this.playerScript = this.persistScript.playerScript;

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
      this.changeState(BaseState.ATTACK, "atk");
      this.attackTimer = this.attackCooldown;
    } else {
      if (
        !this.anim.getState(BaseState.IDLE).isPlaying &&
        !this.anim.getState("atk")?.isPlaying
      ) {
        this.changeState(BaseState.IDLE, "idle");
        this.anim.play(BaseState.IDLE);
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
      if (!this.anim.getState(BaseState.IDLE)?.isPlaying) {
        this.changeState(BaseState.IDLE, "idle");
      }
    } else {
      if (!this.anim.getState(BaseState.RUN)?.isPlaying) {
        this.changeState(BaseState.RUN, "run");
      }
    }

    return BTStatus.RUNNING;
  }

  patrolArea(): BTStatus {
    return BTStatus.RUNNING;
  }
  changeAnim(anim: string) {
    this.anim.stop();
    this.anim.play(anim);
  }

  changeState(newState: BaseState, anim?: string) {
    if (this.state === newState || this.state === BaseState.DEAD) return;

    this.state = newState;

    if (newState === BaseState.HURT) {
      this.stunTimer = this.stunForce;
    }
    // console.log("changeState: ", newState);
    this.changeAnim(anim);
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
