import { _decorator, Component, Node, Vec3, tween, math } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CameraShake")
export class CameraShake extends Component {
  private _originalPos: Vec3 = new Vec3();
  private _isShaking: boolean = false;

  start() {
    this._originalPos.set(this.node.position);
  }

  public shake(duration: number = 0.5, magnitude: number = 5) {
    if (this._isShaking) return;
    this._isShaking = true;

    const shakeTween = tween(this.node)
      .repeat(
        Math.floor(duration / 0.02),
        tween()
          .call(() => {
            const offsetX = math.randomRange(-magnitude, magnitude);
            const offsetY = math.randomRange(-magnitude, magnitude);
            this.node.setPosition(
              this._originalPos.x + offsetX,
              this._originalPos.y + offsetY,
              this._originalPos.z
            );
          })
          .delay(0.02)
      )
      .call(() => {
        this.node.setPosition(this._originalPos);
        this._isShaking = false;
      });

    shakeTween.start();
  }
}
