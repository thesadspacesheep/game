import {
  _decorator,
  director,
  Component,
  Button,
  Sprite,
  AudioSource,
} from "cc";
const { ccclass, property } = _decorator;

import { Data } from "./Data";
import { Rocket } from "./Rocket";

@ccclass("IntroScene")
export class IntroScene extends Component {
  @property(Rocket)
  rocket: Rocket = null;
  // UI
  @property(Button)
  startButton: Button = null;
  @property(Button)
  volumnButton: Button = null;
  @property(Sprite)
  volumnOn: Sprite = null;
  @property(Sprite)
  volumnOff: Sprite = null;

  @property(AudioSource)
  audio: AudioSource = null;

  onLoad() {
    // UI Event
    this.startButton.node.once(Button.EventType.CLICK, this.onStart, this);
    this.volumnButton.node.on(
      Button.EventType.CLICK,
      this.onVolumnToggle,
      this
    );

    this.volumnButton.getComponent(Button).normalSprite = Data.mute
      ? this.volumnOff.spriteFrame
      : this.volumnOn.spriteFrame;
  }

  start() {
    this.rocket.idle();
  }

  onStart() {
    director.loadScene("GameScene");
  }

  onRanking() {
    director.loadScene("RankingScene");
  }

  onVolumnToggle() {
    if (Data.mute) {
      this.audio.play();
    }
    Data.mute = !Data.mute;
    this.volumnButton.getComponent(Button).normalSprite = Data.mute
      ? this.volumnOff.spriteFrame
      : this.volumnOn.spriteFrame;
  }
}
