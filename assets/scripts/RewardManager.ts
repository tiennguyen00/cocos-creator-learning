import { _decorator, Component, Node } from "cc";
import { EventType, Observer } from "./ObserverManager";
const { ccclass, property } = _decorator;

@ccclass("RewardManager")
export class RewardManager implements Observer {
  update(eventType: EventType, data?: any): void {
    console.log("RewardManager: " + eventType);
    if (eventType === EventType.REWARD) {
    }
  }
}
