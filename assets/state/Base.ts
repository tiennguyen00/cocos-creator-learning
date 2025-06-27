import { Component } from "cc";
import { EventType, Subject } from "../scripts/ObserverManager";

export enum BaseState {
  IDLE = "idle",
  ATTACK = "attack",
  JUMP = "jump",
  DEAD = "dead",
  HURT = "hurt",
  RUN = "run",
  DASH = "dash",
  POWER_UP = "power_up",
}

export abstract class Base extends Component {
  private _state: BaseState = BaseState.IDLE;
  private _health: number;
  private _maxHealth: number;
  private _atkPower: number;
  private _stamina: number;
  private _maxStamina: number;
  private _inventorty: number;

  // declaring the subject following the observer pattern
  private _subject = new Subject();

  init(_health: number, _atkPower: number, _stamina: number) {
    this._health = _health;
    this._stamina = _stamina;
    this._maxHealth = _health;
    this._maxStamina = _stamina;
    this._atkPower = _atkPower;
  }

  get state() {
    return this._state;
  }
  set state(s: BaseState) {
    this._state = s;
  }
  get health() {
    return this._health;
  }
  set health(h: number) {
    this._health = h;
  }

  get stamina() {
    return this._stamina;
  }
  set stamina(value: number) {
    this._stamina = value;
  }

  get subject() {
    return this._subject;
  }

  get atkPower() {
    return this._atkPower;
  }

  takeDamage(damage: number) {
    if (damage <= 0 || this.state === BaseState.DEAD)
      console.warn("Character is dead or damage value is not valid");
    this._health = Math.max(0, this._health - damage);
    if (this._health == 0) {
      this._subject.notify(EventType.UI, "isDead");
      this.state = BaseState.DEAD;
    }
  }
  takeHeal(value: number) {
    if (value <= 0 || this.state === BaseState.DEAD)
      console.warn("Heal value must be larger than 0 or character still alive");
    this._health = Math.min(this._maxHealth, this._health + value);
  }
  takeStaminaRest(value: number) {
    if (value <= 0 || this.state === BaseState.DEAD)
      console.warn(
        "Stamina value must be larger than 0 or character still alive"
      );
    this._stamina = Math.min(this._maxStamina, this._stamina + value);
  }
  takeStaminaCost(value: number) {
    if (value <= 0 || this.state === BaseState.DEAD)
      console.warn(
        "Stamina value must be larger than 0 or character still alive"
      );
    this._stamina = Math.max(0, this._stamina - value);
  }

  changeAtkPower(_power: number) {
    if (_power <= 0 || this.state === BaseState.DEAD)
      console.warn(
        "Attack power must be larger than 0 or character still alive"
      );
    this._atkPower = _power;
  }

  // Attack
  attack(target: Base) {
    if (this.stamina < this._atkPower && this._stamina > 0) {
      console.warn("Not enough stamina to attack");
      return;
    }
    target.takeDamage(this._atkPower);
    this.takeStaminaCost(this._atkPower);
  }

  // Dash
  dash(_value: number) {
    if (this.stamina < _value && this._stamina > 0) {
      console.warn("Not enough stamina to dash");
      return false;
    }
    this.takeStaminaCost(_value);
    return true;
  }
}
