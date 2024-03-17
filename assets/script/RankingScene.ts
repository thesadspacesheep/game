import { _decorator, Component, Button, director, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RankingScene')
export class RankingScene extends Component {

  @property(Button)
  homeButton: Button = null
  @property(Label)
  loadingLabel: Label = null

  dotCount = 1

  onLoad () {
    this.homeButton.node.once(Button.EventType.CLICK, this.onHome, this)
    this.schedule(() => {
      this.loadingLabel.string = 'Loading' + '.'.repeat(this.dotCount)
      if (++this.dotCount > 3) this.dotCount = 1
    }, 0.5)
  }

  onHome () {
    director.loadScene('IntroScene')
  }
}


