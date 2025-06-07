export enum BTStatus {
  SUCCESS,
  FAILURE,
  RUNNING,
}

export abstract class BTNode {
  abstract tick(): BTStatus;
}

export class SequenceNode extends BTNode {
  constructor(private children: BTNode[]) {
    super();
  }

  tick(): BTStatus {
    for (const child of this.children) {
      const status = child.tick();
      if (status !== BTStatus.SUCCESS) return status;
    }
    return BTStatus.SUCCESS;
  }
}

export class SelectorNode extends BTNode {
  constructor(private children: BTNode[]) {
    super();
  }

  tick(): BTStatus {
    for (const child of this.children) {
      const status = child.tick();
      if (status === BTStatus.SUCCESS) return BTStatus.SUCCESS;
    }
    return BTStatus.FAILURE;
  }
}

export class ConditionNode extends BTNode {
  constructor(private condition: () => boolean) {
    super();
  }

  tick(): BTStatus {
    return this.condition() ? BTStatus.SUCCESS : BTStatus.FAILURE;
  }
}

export class ActionNode extends BTNode {
  constructor(private action: () => BTStatus) {
    super();
  }

  tick(): BTStatus {
    return this.action();
  }
}
