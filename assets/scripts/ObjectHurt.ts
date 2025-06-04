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
EPhysics2DDrawFlags
} from "cc";
import { CameraShake } from "../utils/CameraShake";
const { ccclass, property } = _decorator;

@ccclass("ObjectHurt")
export class ObjectHurt extends Component {
  private audioSource: AudioSource | null = null;
  private animation: Animation | null = null;
  private collider = null
  private cameraShake = null;

  private state = "normal";

  @property(Prefab)
  public hitEff: Prefab = null;

  protected onLoad(): void {
    PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb
    this.collider = this.node.getComponent(BoxCollider2D)
    this.audioSource = this.getComponent(AudioSource);
    this.camera = find("Canvas/PlayerFollower/Camera");
    this.cameraShake = this.camera.getComponent(CameraShake);
    this.animation = this.getComponent(Animation);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  start() {
    
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
  	console.log("Objecthurt: There is collision with ", otherCollider.node.name)
  	this.onHitEffect()
  }


  onHitEffect() {
    const HITEFF = instantiate(this.hitEff);
    HITEFF.parent = this.node.parent;
    HITEFF.setPosition(this.node.position.x, this.node.position.y, 0);
    this.audioSource.play();
    this.cameraShake.shake(0.71, 2);
  }

  update(deltaTime: number) {}
}
