import { _decorator, Component, Node, RigidBody2D, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { Data, random } from './Data'

@ccclass('ItemPool')
export class ItemPool extends Component {

  @property([Node])
  private items: Node[] = []

  private width = 0
  private itemWidth = 100

  onLoad () {
    this.width = this.node.getComponent(UITransform).width

    for (const item of this.items) {
      item.active = false
    }
  }

  spawn () {
    const item = this.items[random(0, 1)]
    if (item.active) return
    item.active = true
    item.setPosition(new Vec3(this.width + this.itemWidth, random(-300, 300)))
  }

  clearItem (itemIndex: number) {
    const item = this.items[itemIndex]
    this.scheduleOnce(() => item.active = false) // bug? This might happend when it called by in callback
  }

  update(deltaTime: number) {
    if (Data.isGameOver) return

    for (const item of this.items) {
      if (!item.active) continue
      // moving
      let { x, y } = item.position
      x -= Data.speed * deltaTime
      item.setPosition(new Vec3(x, y))

      // sleep
      if(x < -(this.width/2 + this.itemWidth)) {
        item.active = false
      }
    }
  }
}


