import {
  _decorator,
  director,
  instantiate,
  Component,
  Node,
  Button,
  Input,
  input,
  Label,
  EventKeyboard,
  KeyCode,
  Collider2D,
  Prefab,
  Vec3,
  RigidBody2D,
  ERigidBody2DType,
  EditBox,
} from "cc";
const { ccclass, property } = _decorator;

import { Data } from "./Data";
import { Rocket } from "./Rocket";
import { PipePool } from "./PipePool";
import { ItemPool } from "./ItemPool";
import { AudioCtrl, AudioSrc } from "./AudioCtrl";

@ccclass("GameScene")
export class GameScene extends Component {
  @property(Rocket)
  rocket: Rocket = null;
  @property(PipePool)
  pipePool: PipePool = null;
  @property(ItemPool)
  itemPool: ItemPool = null;

  // UI
  @property(Label)
  scoreLabel: Label = null;
  @property(Node)
  resultNode: Node = null;
  @property(Label)
  resultTitle: Label = null;
  @property(Node)
  leadScoreNode: Node = null;
  @property(EditBox)
  nicknameBox: EditBox = null;
  @property(Button)
  againButton: Button = null;
  @property(Button)
  saveButton: Button = null;

  @property(Prefab)
  fxCircle: Prefab = null;
  @property(Prefab)
  fxTail: Prefab = null;

  @property(AudioCtrl)
  audio: AudioCtrl = null;

  score = 0;
  booster = false;
  speedBefore = Data.speedDefault;

  onLoad() {
    Data.init();

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);

    this.againButton.node.once(Button.EventType.CLICK, this.onAgain, this);
    this.saveButton.node.once(Button.EventType.CLICK, this.onSave, this);

    this.rocket.node.on("hit", this.onHitRocket, this);
    this.pipePool.node.on("pass", this.onPassPipes, this);
  }

  start() {
    this.pipePool.addPipes();
  }

  async gameOver() {
    Data.isGameOver = true;
    this.rocket.stop();
    this.resultNode.active = true;
    this.audio.play(AudioSrc.HIT);
    Data.highScore = Math.max(this.score, Data.highScore);
    this.resultTitle.string = "HIGH SCORE: " + Data.highScore.toString();
  }

  fly() {
    if (Data.isGameOver) return;
    this.rocket.fly();
    this.audio.play(AudioSrc.SWOOSH);
  }

  onKeyDown(event: EventKeyboard) {
    event.keyCode === KeyCode.SPACE && this.fly();
  }

  onTouchStart() {
    this.fly();
  }

  onAgain() {
    director.loadScene("IntroScene");
  }

  async onSave() {
    this.leadScoreNode.active = false;
    const name = this.nicknameBox.string.trim();
    if (!name) return;
  }

  onHitRocket(target: Collider2D) {
    const { tag } = target;
    if (tag !== 10 && this.booster) return;

    if (tag < 100) {
      if (!Data.isGameOver) {
        this.gameOver();
      }
    } else {
      const itemIndex = tag - 100;
      this.itemPool.clearItem(itemIndex);
      if (itemIndex === 0) {
        Data.speed = Math.max(Data.speedDefault, Data.speed - Data.speedSlow);
      } else {
        this.booster = true;
        this.speedBefore = Data.speed;
        Data.speed = Data.speedBooster;

        this.scheduleOnce(() => {
          this.booster = false;
          Data.speed = this.speedBefore;
        }, 3);

        const fx = instantiate(this.fxTail);
        fx.setPosition(new Vec3());
        this.rocket.node.addChild(fx);
      }

      const fx = instantiate(this.fxCircle);
      fx.setPosition(new Vec3());
      this.rocket.node.addChild(fx);
      this.audio.play(AudioSrc.ITEM);
    }
  }

  onPassPipes() {
    ++this.score;
    this.scoreLabel.string = this.score.toString();
    this.pipePool.addPipes();
    Data.speed += 10;
    this.audio.play(AudioSrc.POINT);

    if (this.score % 5 === 0) {
      this.itemPool.spawn();
    }
  }
}
