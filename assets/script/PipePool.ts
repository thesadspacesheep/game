import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

import { Data } from './Data'

@ccclass('PipePool')
export class PipePool extends Component {

  @property({ type: Prefab })
  public prefabPipes = null

  pool = new NodePool

  onLoad() {
    const maxPipes = 3
    for (let i = 0; i < maxPipes; ++i) {
      const pipes = instantiate(this.prefabPipes)
      this.pool.put(pipes)
    }
  }

  addPipes () {
    let pipes: Node = this.pool.get()
    if (pipes) {
      pipes = instantiate(this.prefabPipes)
      this.pool.put(pipes)
    }
    this.node.addChild(pipes)
    pipes.on('pass', () => this.node.emit('pass'))
  }
}


