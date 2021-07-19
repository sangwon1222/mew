import { SceneBase } from "../Core/SceneBase";
import { HowTo } from "../GameObject/Common/HowTo";
import { Outro } from "../GameObject/Common/Outro";
import { Home } from "./Home";
import { ReadTheLyricsViewerData } from "../Resource/ViewerResource/ReadTheLyrics";
import * as ReadTheLyricsProductData from "../Resource/ProductResource/ReadTheLyrics";
import PIXISound from "pixi-sound";
import { ResourceManager } from "../Core/ResourceManager";
import { ActivityMain } from "../GameObject/ReadTheLyrics/ActivityMain";
import { Header } from "../GameObject/Common/Header";

export class ReadTheLyrics extends SceneBase {
  static _handle: ReadTheLyrics;
  static get Handle(): ReadTheLyrics {
    return ReadTheLyrics._handle;
  }

  private mHeader: Header;
  private mActivityMain: ActivityMain;

  constructor() {
    super(`ReadTheLyrics`);
  }

  async onInit() {
    this.productName = Home.Handle.productName;

    ReadTheLyrics._handle = this;

    await this.loadViewerResource(ReadTheLyricsViewerData);
    await this.loadProductResource(ReadTheLyricsProductData[this.productName]);
  }

  async onStart() {
    PIXISound.stopAll();

    this.mActivityMain = new ActivityMain();
    this.addChild(this.mActivityMain);

    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`readtolyrics_title.png`).texture
    );
    title.y = 10;
    this.addChild(title);

    this.mHeader = new Header();
    this.addChild(this.mHeader);

    const howTo = new HowTo();
    this.addChild(howTo);
    await howTo.howTo();
    this.removeChild(howTo);

    this.mActivityMain.start();
  }

  async onEnd() {
    PIXISound.stopAll();
    this.mActivityMain.stop();
    /**OUTRO */
    const outro = new Outro();
    this.addChild(outro);
    await outro.outro();
  }
}
