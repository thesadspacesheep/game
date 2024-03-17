import { _decorator, Component, Animation, RigidBody2D, ERigidBody2DType, Collider2D, Contact2DType, tween, Tween, Vec3, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Rocket')
export class Rocket extends Component {

  readonly Fly = { DURATION: 0.3, HEIGHT: 100 } as const

  private get ani() { return this.node.getComponent(Animation) }
  private get rigid() { return this.node.getComponent(RigidBody2D) }

  onLoad() {
    this.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.onContact, this)
  }

  onContact (self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
    this.node.emit('hit', other)
  }

  idle() {
    this.ani.play('idle')
    this.rigid.type = ERigidBody2DType.Static
  }

  fly() {
    this.ani.stop()
    tween(this.node.position)
      .to(
        this.Fly.DURATION,
        new Vec3(this.node.position.x, this.node.position.y + this.Fly.HEIGHT, 0),
        { easing: 'smooth', onUpdate: (target: Vec3) => { this.node ? this.node.position = target : undefined } }
      )
      .start()
    this.ani.play('fly')
    // this.audio.play(0)
  }

  stop () {
    this.rigid.gravityScale = 0
    this.rigid.sleep()
    Tween.stopAllByTarget(this.node.position)
  }
}


