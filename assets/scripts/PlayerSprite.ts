import {
  _decorator,
  Component,
  Node,
  Animation,
  AudioSource,
  AnimationState,
  find,
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
  private player: Node = null;
  private charScript = null;
  private state = "idle";

  start() {
    this.Anim = this.node.getComponent(Animation);
    this.Sound = this.soundSword.getComponent(AudioSource);
    this.SoundFire = this.soundFire.getComponent(AudioSource);
    this.player = find("Canvas/Character");
    this.charScript = this.player.getComponent("PlayerControl");

    this.state = "idle";
  }

  finish() {
    this.state = "idle";
    if (this.charScript.speed == 0) {
      this.Anim.play("idle");
    } else {
      this.Anim.play("run");
    }
  }

  sound() {
    this.Sound.play();
  }

  soundFireBall() {
    this.SoundFire.play();
  }

  update(deltaTime: number) {}
}
