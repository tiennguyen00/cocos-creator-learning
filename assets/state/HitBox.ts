import { _decorator, Component, Node, BoxCollider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HitBox')
export class HitBox extends Component {

    private collider = null
    onLoad() {
	this.collider = this.node.getComponent(BoxCollider2D)
    }
    start() {

    }

    update(deltaTime: number) {
        this.collider.apply()
    }
}

