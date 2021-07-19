import { SceneBase } from "../Core/SceneBase";
import { Header } from "../GameObject/Common/Header";
import { HowTo } from "../GameObject/Common/HowTo";
import { Outro } from "../GameObject/Common/Outro";
import { ResourceManager } from "../Core/ResourceManager";
import { Palette } from "../GameObject/Pigment/Palette";
import { DrawCanvas } from "../GameObject/Pigment/DrawCanvas";
import { ScreenShotButton } from "../GameObject/Common/ScreenShotButton";
import { App } from "../Core/App";
import PIXISound from "pixi-sound";
import { PigmentViewerData } from "../Resource/ViewerResource/Pigment";
import * as PigmentProductData from "../Resource/ProductResource/Pigment";
import { Home } from "./Home";
import gsap from "gsap";
import { PigmentModule } from "@/store/pigment";
import Util from "@/Util";

export class Pigment extends SceneBase {
  private mHeader: Header;

  private mPallet: Palette;
  private mCanvas: DrawCanvas;

  private mScreenShotBtn: ScreenShotButton;

  constructor() {
    super(`Pigment`);
    // this.productName = "b1"
  }

  async onInit() {
    this.productName = Home.Handle.productName;
    PIXISound.stopAll();
    await this.loadViewerResource(PigmentViewerData);
    await this.loadProductResource(PigmentProductData[this.productName]);
  }

  async onStart() {
    this.mPallet = new Palette();
    this.addChild(this.mPallet);

    //mPallet의 클릭 함수를 Pigment 함수에 연결해 Pigment에서 제어
    this.mPallet.onPaletteDown = () => {
      this.receiveOnPaletteDown();
    };
    this.mPallet.onAllRemoverDown = () => {
      this.receiveOnAllRemoverDown();
    };

    this.mCanvas = new DrawCanvas(this.productName);
    this.mCanvas.x = 220;
    this.addChild(this.mCanvas);

    this.mScreenShotBtn = new ScreenShotButton(640, 70);
    this.addChild(this.mScreenShotBtn);
    this.screenShotButton();

    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource("pigment_text.png").texture
    );
    title.y = 16;
    this.addChild(title);

    this.mHeader = new Header();
    this.addChild(this.mHeader);

    // mPallet에서 선택되어진 컬러값을 가져와서 mCanvas에 넘겨준다.
    this.receiveOnPaletteDown();

    /**HOWTO */
    const howTo = new HowTo();
    this.addChild(howTo);
    await howTo.howTo();
    this.removeChild(howTo);

    PigmentModule.setRecieved();
  }

  async onEnd() {
    PIXISound.stopAll();
    /**OUTRO */

    const outro = new Outro();
    this.addChild(outro);
    await outro.outro();
  }

  receiveOnPaletteDown() {
    this.mCanvas.color = this.mPallet.paletteColor;
  }

  receiveOnAllRemoverDown() {
    this.mCanvas.clearCanvas();
  }

  screenShotButton() {
    this.mScreenShotBtn.onScreenShot = () => {
      const renderTexture = PIXI.RenderTexture.create({
        width: 1060,
        height: 800,
      });
      this.mCanvas.x = 0;
      App.Handle.renderer.render(this.mCanvas, renderTexture);
      this.mCanvas.x = 220;
      const canvas = App.Handle.renderer.extract.canvas(renderTexture);
      canvas.toBlob((b) => {
        // console.warn(b)
        // PigmentModule.setPigmentScreenShot( b );
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(b, "mew_pigment.png");
        } else {
          navigator;
          const link = document.createElement("a");
          link.download = "mew_pigment.png";
          link.href = canvas.toDataURL("image/png");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, "image/png");

      const snd = ResourceManager.Handle.getViewerResource("snd_save.mp3")
        .sound;
      snd.play();
      gsap.delayedCall(snd.duration, () => {
        this.onEnd();
      });
    };
  }
}
