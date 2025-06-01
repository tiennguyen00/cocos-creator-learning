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
} from "cc";
import { CameraShake } from "../utils/CameraShake";
const { ccclass, property } = _decorator;

@ccclass("ObjectHurt")
export class ObjectHurt extends Component {
  private audioSource: AudioSource | null = null;
  private animation: Animation | null = null;
  private camera = null;
  private cameraShake = null;

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
  }

  onHitEffect() {
    const HITEFF = instantiate(this.hitEff);
    HITEFF.parent = this.node.parent;
    HITEFF.setPosition(this.node.position.x, this.node.position.y, 0);
    this.audioSource.play();
    this.cameraShake.shake(1, 2);
  }

  update(deltaTime: number) {}
}
