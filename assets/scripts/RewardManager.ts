import { _decorator } from "cc";
import { EventType, Observer } from "./ObserverManager";
const { ccclass } = _decorator;

@ccclass("RewardManager")
export class RewardManager implements Observer {
  type: string;
  cb: () => void;
  constructor(_type?: string, cb?: () => void) {
    this.type = _type;
    this.cb = cb;
  }
  update(eventType: EventType, data?: any): void {
    if (
      eventType === EventType.REWARD &&
      data === "isDead" &&
      this.type === "Enemies"
    ) {
      this.cb();
    }
  }
}
