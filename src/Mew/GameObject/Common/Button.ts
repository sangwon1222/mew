import { ResourceManager } from "../../Core/ResourceManager";

export class Button extends PIXI.Sprite {
  private mTextureNormal: PIXI.Texture;
  private mTextureOver: PIXI.Texture;
  private mTextureDown: PIXI.Texture;
  private mTextureDis: PIXI.Texture;

  private mIsDisable = false;

  get disable(): boolean {
    return this.mIsDisable;
  }
  set disable(v: boolean) {
    this.mIsDisable = v;
    if (this.mIsDisable) {
      this.interactive = false;
      if (this.mTextureDis) this.texture = this.mTextureDis;
    } else {
      this.interactive = true;
      this.texture = this.mTextureNormal;
    }
    // console.log(this.interactive)
  }

  constructor(
    normal: PIXI.Texture,
    down?: PIXI.Texture,
    over?: PIXI.Texture,
    dis?: PIXI.Texture
  ) {
    super();

    this.interactive = true;
    this.buttonMode = true;

    this.mTextureNormal = normal;
    if (down) this.mTextureDown = down;
    if (over) this.mTextureOver = over;
    if (dis) this.mTextureDis = dis;

    if (this.mTextureNormal == undefined) {
      //   console.log(
      //     `%c ${normal} 파일이 없습니다`,
      //     "color:red; font-weight:bold;"
      //   );
    }

    this.anchor.set(0.5);

    this.texture = this.mTextureNormal;

    this.position.set(this.width / 2, this.height / 2);

    this.on("pointerdown", () => {
      if (this.mTextureDown) this.texture = this.mTextureDown;
    });
    this.on("pointerover", () => {
      if (this.mTextureOver) this.texture = this.mTextureOver;
    });
    this.on("pointerout", () => {
      this.texture = this.mTextureNormal;
    });
    this.on("pointertap", () => {
      this.texture = this.mTextureNormal;
      if (!this.mIsDisable) this.onClick();
    });
  }

  onClick() {
    //
  }

  changeTexture(
    normal: PIXI.Texture,
    down?: PIXI.Texture,
    over?: PIXI.Texture,
    dis?: PIXI.Texture
  ) {
    this.mTextureNormal = normal;
    if (down) this.mTextureDown = down;
    if (over) this.mTextureOver = over;
    if (dis) this.mTextureDis = dis;
    this.texture = this.mTextureNormal;
  }

  wrongMotion(texture: PIXI.Texture) {
    this.texture = texture;
  }

  correctMotion(texture: PIXI.Texture) {
    this.texture = texture;
  }

  nextQuiz() {
    //
  }
}
