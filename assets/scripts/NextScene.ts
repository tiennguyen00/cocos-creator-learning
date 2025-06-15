import {
  _decorator,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  Director,
  director,
  find,
  IPhysics2DContact,
  Node,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("NextScene")
export class NextScene extends Component {
  private char: Node | null = null;
  private collider: BoxCollider2D | null = null;

  onLoad() {
    this.char = find("Canvas/GirlCharacter");
    this.collider = this.node.getComponent(BoxCollider2D);
    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  start() {}

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    console.log("wall1 contact: ", otherCollider.node.name);

    director.once(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
      const char = find("Canvas/GirlCharacter");
      char.setPosition(-580, -120);
    });

    director.loadScene("scene2", () => {
      console.log("loading scene2: ", director.getScene());
    });
  }

  update(deltaTime: number) {}
}
