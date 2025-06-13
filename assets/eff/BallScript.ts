import {
  _decorator,
  AudioSource,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  find,
  instantiate,
  Prefab,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("BallScript")
export class BallScript extends Component {
  @property(Prefab)
  dustEffect: Prefab = null;

  private charScript = null;
  private collider = null;
  private eff = null;
  private audio = null;

  onLoad() {
    this.charScript = find("Canvas/GirlCharacter").getComponent("Character");
    this.collider = this.node.getComponent(BoxCollider2D);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    this.audio = find("Canvas/GirlCharacter/sound").getComponents(AudioSource);
  }

  start() {}

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    this.eff = instantiate(this.dustEffect);
    this.node.parent.addChild(this.eff);
    this.eff.setPosition(
      otherCollider.node.position.x,
      otherCollider.node.position.y + 22,
      otherCollider.node.position.z
    );
    this.audio[4].play();
  }

  update(deltaTime: number) {
    this.node.setPosition(
      this.node.position.add(new Vec3(this.charScript.node.scale.x * 10, 0, 0))
    );
    // this.eff.setPosition(0, 0, 0);
  }
}
