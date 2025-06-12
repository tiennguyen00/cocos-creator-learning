import {
  _decorator,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  find,
  Node,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("BallScript")
export class BallScript extends Component {
  private charScript = null;
  private collider = null;
  private hp = 3;

  onLoad() {
    this.charScript = find("Canvas/GirlCharacter").getComponent("Character");
    this.collider = this.node.getComponent(BoxCollider2D);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    console.log("BallScript: onBeginContact", otherCollider.node.name);
  }

  update(deltaTime: number) {
    this.node.setPosition(
      this.node.position.add(new Vec3(this.charScript.node.scale.x * 10, 0, 0))
    );
  }
}
