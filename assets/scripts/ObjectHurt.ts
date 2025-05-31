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
  Camera,
  Prefab,
  instantiate,
} from "cc";
import { CameraShake } from "../utils/CameraShake";
const { ccclass, property } = _decorator;

@ccclass("ObjectHurt")
export class ObjectHurt extends Component {
  private audioSource: AudioSource | null = null;
  private animation: Animation | null = null;
  private camera = null;
  private cameraShake = null;
  private elapsedTime: number = 0;

  private state = "normal";

  @property(Prefab)
  public hitEff: Prefab = null;

  protected onLoad(): void {
    this.camera = find("Canvas/PlayerFollower/Camera");
    this.cameraShake = this.camera.getComponent(CameraShake);
    this.animation = this.getComponent(Animation);
  }

  start() {
    this.audioSource = this.getComponent(AudioSource);

    const collider = this.getComponent(BoxCollider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
      collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
      collider.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    //
    this.animation.play("walk");

    this.state = "anger";
    const HITEFF = instantiate(this.hitEff);
    HITEFF.parent = this.node.parent;
    HITEFF.setPosition(this.node.position.x, this.node.position.y, 0);

    this.audioSource.play();
    this.cameraShake.shake(1, 2);
  }

  onEndContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    // this.animation.play("idle");
  }

  onPreSolve(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    // Optional
  }

  onPostSolve(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    // Optional
  }

  update(deltaTime: number) {
    // Optional update loop
    this.elapsedTime += deltaTime;
    if (this.state == "normal") {
      this.node.x += Math.sin(this.elapsedTime / 10);
    } else if (this.state == "anger") {
    }
  }
}
