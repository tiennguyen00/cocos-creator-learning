import { Node, Prefab, instantiate, Animation } from "cc";

export class ObjectPool {
  private prefab: Prefab;
  private pool: Node[] = [];
  private parent: Node;

  constructor(prefab: Prefab, parent: Node, initialSize: number = 3) {
    this.prefab = prefab;
    this.parent = parent;
    this.fillPool(initialSize);
  }

  private fillPool(size: number) {
    for (let i = 0; i < size; i++) {
      const node = instantiate(this.prefab);
      node.active = false;
      this.parent.addChild(node);
      this.pool.push(node);
    }
  }

  /** Get an object from the pool */
  public get(cb?: () => void): Node {
    let node: Node;
    if (this.pool.length > 0) {
      node = this.pool.pop();
    } else {
      node = instantiate(this.prefab);
      this.parent.addChild(node);
    }
    node.active = true;
    try {
      const anim = node.getComponent(Animation);
      if (anim) {
        anim.play();
      }
    } catch {}
    cb?.();

    return node;
  }

  /** Return the object to the pool */
  public put(node: Node, cb?: () => void) {
    node.active = false;
    this.pool.push(node);
    cb?.();
  }

  /** Clear the pool */
  public clear() {
    for (const node of this.pool) {
      node.destroy();
    }
    this.pool.length = 0;
  }
}
