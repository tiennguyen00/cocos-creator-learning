import { _decorator, AudioSource, Component, find, Node } from "cc";
import { CharacterState } from "./Character";
const { ccclass, property } = _decorator;

@ccclass("Sound")
export class Sound extends Component {
  private character = null;
  private audioSource: AudioSource[] | null = null;

  onLoad() {
    this.character = find("Canvas/GirlCharacter");
    this.audioSource = this.character
      .getChildByName("sound")
      .getComponents(AudioSource);

    this.character.on("compo-attack", this.playAtkSound, this);
  }

  playAtkSound(step: number) {
    switch (step) {
      case 1:
      case 2:
        this.audioSource[0].playOneShot(this.audioSource[0].clip);
        break;
      case 3:
        this.audioSource[1].playOneShot(this.audioSource[1].clip);
        break;
      case 4:
        this.audioSource[2].playOneShot(this.audioSource[2].clip);
        break;
    }
  }

  start() {}

  update(deltaTime: number) {}
}
