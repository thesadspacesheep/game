import {
  _decorator,
  Component,
  ERigidBody2DType,
  Node,
  RigidBody2D,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

import { Data, random } from "./Data";

@ccclass("Pipes")
export class Pipes extends Component {
  @property({ type: Node })
  public pipeUp: Node;
  @property({ type: Node })
  public pipeDown: Node;

  isPassed = false;
  parentWidth: number;
  pipeWidth: number;

  onLoad() {
    this.parentWidth = this.node.parent.getComponent(UITransform).width;
    this.pipeWidth = this.node.getComponent(UITransform).width;

    const gap = random(350, 400);
    const delta = random(-290, 290);
    this.pipeUp.setPosition(new Vec3(0, delta + gap / 2));
    this.pipeDown.setPosition(new Vec3(0, delta - gap / 2));
    this.node.setPosition(
      new Vec3(this.parentWidth / 2 + this.pipeWidth / 2, 0)
    );
  }

  update(deltaTime: number) {
    if (Data.isGameOver) return;

    // moving
    let { x, y } = this.node.position;
    x -= Data.speed * deltaTime;
    this.node.setPosition(new Vec3(x, y));

    // pass
    if (!this.isPassed && x < -this.pipeWidth / 2) {
      this.isPassed = true;
      this.node.emit("pass");
    }

    // self destroy
    if (x < -(this.parentWidth / 2 + this.pipeWidth)) {
      this.destroy();
    }
  }
}
