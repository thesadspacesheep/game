export class Data {
  static readonly speedDefault = 200;
  static readonly speedBooster = 1000;
  static readonly speedSlow = 50;
  static speed = Data.speedDefault;

  static isGameOver = false;
  static highScore = 0;

  static mute = false;

  static init() {
    Data.speed = 200;
    Data.isGameOver = false;
  }
}

///////////////////////////////////////////////////////////////////////////
// Util: create util class later
///////////////////////////////////////////////////////////////////////////

export const random = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
