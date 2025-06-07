import {
  _decorator,
  AudioSource,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  Animation,
  find,
  Prefab,
  instantiate,
  PhysicsSystem2D,
  EPhysics2DDrawFlags,
} from "cc";
import { CameraShake } from "../utils/CameraShake";
import { BaseState } from "../state/Base";
const { ccclass, property } = _decorator;

@ccclass("ObjectHurt")
export class ObjectHurt extends Component {
  private audioSource: AudioSource | null = null;
  private collider = null;
  private cameraShake = null;
  private camera = null;
  private enemy = null;

  @property(Prefab)
  public hitEff: Prefab = null;

  protected onLoad(): void {
    PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb;
    this.collider = this.node.getComponent(BoxCollider2D);
    this.audioSource = this.getComponent(AudioSource);
    this.camera = find("Canvas/PlayerFollower/Camera");
    this.cameraShake = this.camera.getComponent(CameraShake);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    this.enemy = this.node.getComponent("Enemy");
  }

  start() {}

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    // only fire this func if it was collided with hitbox player
    if (otherCollider.node.name === "hitbox") {
      console.log(
        "Objecthurt: There is collision with ",
        otherCollider.node.name
      );
      this.onHitEffect();
      this.enemy.changeState(BaseState.HURT);
      this.enemy.anim.play("hit");
    }
  }

  onHitEffect() {
    const HITEFF = instantiate(this.hitEff);
    HITEFF.parent = this.node.parent;
    HITEFF.setPosition(this.node.position.x, this.node.position.y, 0);
    this.audioSource.play();
    this.cameraShake.shake(0.71, 2);
    setTimeout(() => {
      HITEFF.destroy();
    }, 500);
  }

  update(deltaTime: number) {}
}
