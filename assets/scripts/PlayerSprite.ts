import { _decorator, Component, Node, Animation, AudioSource } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerSprite")
export class PlayerSprite extends Component {
  @property(Node)
  public soundSword: Node = null;

  @property(Node)
  public soundFire: Node = null;

  private Anim: Animation = null;
  private Sound: AudioSource = null;
  private SoundFire: AudioSource = null;

  start() {
    this.Anim = this.node.getComponent(Animation);
    this.Sound = this.soundSword.getComponent(AudioSource);
    this.SoundFire = this.soundFire.getComponent(AudioSource);
  }

  finish() {
    this.Anim.play("idle");
  }

  sound() {
    this.Sound.play();
  }

  soundFireBall() {
    this.SoundFire.play();
  }

  update(deltaTime: number) {}
}
