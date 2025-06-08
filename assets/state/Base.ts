import { Component } from "cc";

export enum BaseState {
  IDLE = "idle",
  ATTACK = "attack",
  JUMP = "jump",
  DEAD = "dead",
  HURT = "hurt",
  RUN = "run",
}

export abstract class Base extends Component {
  private _state: BaseState = BaseState.IDLE;
  private _health: number;
  private _maxHealth: number;
  private _atkPower: number;
  private _stamina: number;
  private _maxStamina: number;
  private _inventorty: number;

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
  get atkPower() {
    return this._atkPower;
  }
  get stamina() {
    return this._stamina;
  }

  takeDamage(damage: number) {
    if (damage <= 0 || this.state === BaseState.DEAD)
      console.warn("Character is dead or damage value is not valid");
    this._health = Math.max(0, this._health - damage);
    if (this._health == 0) {
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
}
