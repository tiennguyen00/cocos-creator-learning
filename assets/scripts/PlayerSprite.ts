import {
  _decorator,
  Component,
  Node,
  Animation,
  AudioSource,
  AnimationState,
} from "cc";
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
    this.Anim.on(Animation.EventType.FINISHED, this.onAnimationEvent, this);
    this.Sound = this.soundSword.getComponent(AudioSource);
    this.SoundFire = this.soundFire.getComponent(AudioSource);
  }

  onAnimationEvent(type: Animation.EventType, state: AnimationState) {
    console.log("onAnimationEvent", type, state);
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
