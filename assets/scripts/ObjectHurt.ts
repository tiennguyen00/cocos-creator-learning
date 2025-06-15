import {
  _decorator,
  AudioSource,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  find,
  Prefab,
  instantiate,
  ProgressBar,
  EPhysics2DDrawFlags,
  PhysicsSystem2D,
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
  private hpBar = null;
  public playerScript = null;

  @property(Prefab)
  public hitEff: Prefab = null;

  protected onLoad(): void {
    // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb;
    this.playerScript = find("PersistNode").getComponent("PersistNode");
    this.collider = this.node.getComponent(BoxCollider2D);
    this.audioSource = this.getComponent(AudioSource);
    this.camera = find("Canvas/PlayerFollower/Camera");
    this.cameraShake = this.camera.getComponent(CameraShake);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    this.enemy = this.node.getComponent("Enemy");
    this.hpBar = this.node.getChildByName("Hp").getComponent(ProgressBar);
  }

  start() {}

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    // only fire this func if it was collided with hitbox player or ballAtk (bullet)
    if (
      otherCollider.node.name === "hitbox" ||
      otherCollider.node.name === "ballAtk"
    ) {
      console.log(
        "Objecthurt: There is collision with ",
        otherCollider.node.name
      );

      if (this.enemy.health == 0 && this.enemy.state === BaseState.DEAD) {
        // this.enemy.hitBackTimer = 0.5;
        if (!this.enemy.anim.getState("die")?.isPlaying) {
          this.enemy.anim.play("die");
          setTimeout(() => {
            if (this.enemy) {
              this.enemy.node.destroy();
            }
          }, 1000);
        }
      } else {
        this.playerScript.charScript.attack(this.enemy);
        this.hpBar.progress = this.enemy.health / this.enemy.maxHealth;
        this.onHitEffect();
        this.enemy.changeState(BaseState.HURT);
        if (!this.enemy.anim.getState("hit")?.isPlaying) {
          this.enemy.anim.play("hit");
        }
      }
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
