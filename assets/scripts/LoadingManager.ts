import { _decorator, Component, director, Label, Node, ProgressBar } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LoadingManager")
export class LoadingManager extends Component {
  @property(ProgressBar)
  progressBar: ProgressBar = null;

  @property(Label)
  label: Label = null;

  @property(Node)
  icon: Node = null;

  targetScene: string = "";
  prevXIcon = 0;

  onLoad() {
    this.progressBar.progress = 0;
  }

  start() {
    this.prevXIcon = this.icon.x;
    if (this.targetScene) {
      this.loadSceneAsync(this.targetScene);
    }
  }

  loadSceneAsync(sceneName: string) {
    director.preloadScene(
      sceneName,
      (completed, total) => {
        const progress = (completed / total) as number;
        this.progressBar.progress = progress;

        this.icon.x = this.prevXIcon + this.progressBar.progress * 500;
        this.label.string = `${(progress * 100).toFixed(2)}%`;
      },
      () => {
        director.loadScene(sceneName);
      }
    );
  }
}
