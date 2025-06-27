import { _decorator, Node } from "cc";

// this pattern is perfect for decoupling systems (like reward, UI, sound, achievements, etc)

export enum EventType {
  REWARD = "reward",
  UI = "ui",
  SOUND = "sound",
  ACHIEVEMENT = "achievement",
}

export class Observer {
  update(eventType: EventType, data?: any) {
    console.log("This is the eventType:, " + eventType);
  }
}

export class Subject {
  private observers: Observer[] = [];

  addObserver(observer: Observer) {
    if (this.observers.indexOf(observer) === -1) {
      this.observers.push(observer);
    }
  }

  removeObserver(observer: Observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(eventType: EventType, data?: any) {
    this.observers.forEach((observer) => observer.update(eventType, data));
  }
}
