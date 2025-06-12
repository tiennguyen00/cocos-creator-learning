import {
  _decorator,
  Component,
  find,
  Node,
  Sprite,
  SpriteFrame,
  UIOpacity,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("DashScript")
export class DashScript extends Component {
  private character: Node | null = null;
  private characterSpriteFrame: SpriteFrame | null = null;
  private uiOpacity: UIOpacity | null = null;

  private fadeSpeed: number = 700;

  protected onLoad(): void {
    this.character = find("Canvas/GirlCharacter");

    const spriteNode = this.character.getChildByName("sprite");
    const sprite = spriteNode.getComponent(Sprite);
    this.characterSpriteFrame = sprite.spriteFrame;

    this.uiOpacity = this.node.getComponent(UIOpacity);
  }

  start() {
    const sprite = this.node.getComponent(Sprite);
    sprite.spriteFrame = this.characterSpriteFrame;

    const direction = Math.sign(this.character.scale.x);
    const currentScale = this.node.getScale();
    this.node.setScale(
      new Vec3(
        direction * Math.abs(currentScale.x),
        currentScale.y,
        currentScale.z
      )
    );
  }

  update(deltaTime: number) {
    if (this.uiOpacity) {
      this.uiOpacity.opacity -= this.fadeSpeed * deltaTime;

      // if (this.uiOpacity.opacity <= 0) {
      //   this.node.destroy();
      // }
    }
  }
}
