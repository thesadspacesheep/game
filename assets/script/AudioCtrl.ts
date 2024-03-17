import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { Data } from './Data'

export enum AudioSrc {
  HIT = 0,
  ITEM,
  POINT,
  SWOOSH
}

@ccclass('AudioCtrl')
export class AudioCtrl extends Component {

  @property(AudioClip)
  public clips: AudioClip[] = []

  @property(AudioSource)
  public audioSource: AudioSource = null

  play(index: number) {
    if (!Data.mute) {
      const clip: AudioClip = this.clips[index]
      this.audioSource.playOneShot(clip)
    }
  }
}


