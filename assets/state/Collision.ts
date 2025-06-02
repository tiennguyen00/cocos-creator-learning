import {
  _decorator,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  EPhysics2DDrawFlags,
  find,
  Node,
  PhysicsSystem2D,
  RigidBody2D,
} from "cc";
import { CharacterState } from "./Character";
import { ObjectHurt } from "../scripts/ObjectHurt";
const { ccclass, property } = _decorator;

const enemies: string[] = ["bear"];

@ccclass("Collision")
export class Collision extends Component {
  @property(Node)
  public character: Node = null;

  @property(Node)
  public objectHurt: Node[] = [];

  private charScript = null;
  private collider: BoxCollider2D;
  private testCol = null;
  private isHit = false;

  protected onLoad(): void {
    PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb;
    this.charScript = this.character.getComponent("Character");
    this.collider = this.character.getComponent(BoxCollider2D);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    this.character.on("compo-attack", this.playAtkSound, this);
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    if (otherCollider.node.name === "bear") {
      console.log("onBeginContact: ", otherCollider.node.name);
      this.isHit = true;
    }
    this.charScript.onLanded();
  }

  onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    if (otherCollider.node.name === "bear") {
      this.isHit = false;
    }
  }

  playAtkSound(step: number) {
    if (this.isHit) {
      console.log("step__: ", step);
      this.objectHurt[0].getComponent(ObjectHurt).onHitEffect();
    }
  }

  start() {}

  update(deltaTime: number) {
    // this.collider.node.setPosition(this.character.position);
    // console.log(this.collider.node.position);
  }
}
