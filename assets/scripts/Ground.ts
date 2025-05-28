import { _decorator, Component, Node, UITransform, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Ground")
export class Ground extends Component {
  @property({
    type: Node,
    tooltip: "Ground1 is here",
  })
  public groundNode: Node = null;

  @property({
    type: Node,
    tooltip: "Ground2 is here",
  })
  public groundNode2: Node = null;

  @property({ tooltip: "Speed of ground movement" })
  private grounds: Node[] = [];
  private groundWidth: number = 640;
  private tempPos: Vec3 = new Vec3();
  private rightmostX: number = 0;

  public speed: number = 0; // pixels per second
  public groundNodeWidth: number;
  public groundNode2Width: number;

  protected onLoad(): void {
    this.speed = 0;
  }

  protected start() {
    this.grounds = [this.groundNode, this.groundNode2];
    this.rightmostX = 1920;
  }

  update(deltaTime: number) {
    for (let i = 0; i < this.grounds.length; i++) {
      const ground = this.grounds[i];
      ground.getPosition(this.tempPos);

      this.tempPos.x += this.speed * deltaTime; // Add speed to x position

      // Reset positions to create seamless looping
      if (this.tempPos.x <= -this.groundWidth) {
        this.tempPos.x = this.rightmostX;
      } else if (this.tempPos.x >= this.rightmostX) {
        this.tempPos.x = -this.groundWidth;
      }

      ground.setPosition(this.tempPos);
    }
  }
}
