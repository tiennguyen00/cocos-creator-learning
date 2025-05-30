import {
  _decorator,
  AudioClip,
  AudioSource,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  Animation,
  find,
  Vec3,
  tween,
} from "cc";
const { ccclass, property } = _decorator;

class CameraShake extends Component {
  private originalPos = new Vec3();

  public shake(duration = 0.3, strength = 8) {
    this.originalPos.set(this.node.position);

    let seq = tween(this.node);
    const steps = 8;
    const interval = duration / steps;

    for (let i = 0; i < steps; i++) {
      const offsetX = (Math.random() - 0.5) * 2 * strength;
      const offsetY = (Math.random() - 0.5) * 2 * strength;
      seq = seq.to(interval, {
        position: this.originalPos.clone().add(new Vec3(offsetX, offsetY, 0)),
      });
    }

    seq.to(0.05, { position: this.originalPos }).start();
  }
}

@ccclass("ObjectHurt")
export class ObjectHurt extends Component {
  private audioSource: AudioSource | null = null;
  private animation: Animation | null = null;
  private camera = null;

  protected onLoad(): void {
    this.camera = find("Canvas/PlayerFollower/Camera");
  }

  start() {
    this.audioSource = this.getComponent(AudioSource);
    this.animation = this.getComponent(Animation);

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
    this.audioSource.play();
    // this.camera.getComponent("Camera").getShake(3);
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
  }
}
