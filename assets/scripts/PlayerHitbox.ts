import {
  _decorator,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  director,
  ICollisionEvent,
  IPhysics2DContact,
  PhysicsSystem2D,
  RigidBody2D,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerHitbox")
export class PlayerHitbox extends Component {
  private rigidBody: RigidBody2D = null;

  protected onLoad(): void {}

  start() {}

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    console.log("Collision begin with:", otherCollider.node.name);
  }
}
