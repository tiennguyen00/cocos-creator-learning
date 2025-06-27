import { _decorator, Component, Node } from "cc";
import { RewardManager } from "./RewardManager";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager {
  rewardSystem = new RewardManager();
  start() {}

  update(deltaTime: number) {}
}
