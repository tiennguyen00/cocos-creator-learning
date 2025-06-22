import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PersistScript")
export class PersistScript extends Component {
  start(): void {
    if (!director.isPersistRootNode(this.node)) {
      director.addPersistRootNode(this.node);
    }
  }

  loadScene(name: string, cb?: () => void) {
    director.loadScene(name, cb);
  }

  onDestroy() {
    if (director.isPersistRootNode(this.node)) {
      director.removePersistRootNode(this.node);
    }
  }
}
