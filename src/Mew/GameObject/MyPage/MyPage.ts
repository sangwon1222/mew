import { ResourceManager } from "@/Mew/Core/ResourceManager";
import { Button } from "../Common/Button";
import { PigmentGallery } from "./Gallery/Pigment";
import { MyCardsGallery } from "./Gallery/MyCards";
import { MyOwnStageGallery } from "./Gallery/MyOwnStage";
import { SingAlongGallery } from "./Gallery/SingAlong";

export class MyPage extends PIXI.Sprite {
  private mLight: PIXI.Sprite;
  private mPigmentGallery: PigmentGallery;
  private mMyOwnStageGallery: MyOwnStageGallery;
  private mSingAlongGallery: SingAlongGallery;
  private mMyCardsGallery: MyCardsGallery;

  constructor() {
    super();
    this.visible = false;
  }
  start() {
    this.visible = true;
    this.interactive = true;
    const bg = ResourceManager.Handle.getViewerResource(`bg.png`).texture;
    this.texture = bg;

    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`mygallery_title.png`).texture
    );
    title.anchor.set(0.5);
    title.position.set(1280 / 2, 720 * 0.15);
    this.addChild(title);

    const close = new Button(
      ResourceManager.Handle.getViewerResource(
        `myownstage_popclosebtn_normal.png`
      ).texture,
      ResourceManager.Handle.getViewerResource(
        `myownstage_popclosebtn_down.png`
      ).texture,
      ResourceManager.Handle.getViewerResource(
        `myownstage_popclosebtn_over.png`
      ).texture
    );
    close.position.set(1280 - close.width, close.height);
    this.addChild(close);
    close.onClick = () => {
      this.destroy();
    };

    this.createList();
    this.pushGallery();
  }

  pushGallery() {
    this.mPigmentGallery = new PigmentGallery();
    this.mMyCardsGallery = new MyCardsGallery();
    this.mMyOwnStageGallery = new MyOwnStageGallery();
    this.mSingAlongGallery = new SingAlongGallery();
    this.addChild(
      this.mPigmentGallery,
      this.mMyCardsGallery,
      this.mMyOwnStageGallery,
      this.mSingAlongGallery
    );
  }

  createList() {
    this.mLight = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`light.png`).texture
    );
    this.mLight.anchor.x = 0.5;
    this.mLight.alpha = 0;
    this.addChild(this.mLight);

    const pigment = new Button(
      ResourceManager.Handle.getViewerResource(
        "pigment_btn_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource("pigment_btn_down.png").texture,
      ResourceManager.Handle.getViewerResource("pigment_btn_over.png").texture
    );
    pigment.position.set(210, 450);
    pigment.onClick = () => {
      this.mPigmentGallery.start();
    };

    const myownstage = new Button(
      ResourceManager.Handle.getViewerResource(
        "myownstage_btn_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "myownstage_btn_down.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "myownstage_btn_over.png"
      ).texture
    );
    myownstage.position.set(520, 380);
    myownstage.onClick = () => {
      this.mMyOwnStageGallery.start();
    };

    const singalong = new Button(
      ResourceManager.Handle.getViewerResource(
        "singalong_btn_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "singalong_btn_down.png"
      ).texture,
      ResourceManager.Handle.getViewerResource("singalong_btn_over.png").texture
    );
    singalong.position.set(796, 450);
    singalong.onClick = () => {
      this.mSingAlongGallery.start();
    };

    const mycard = new Button(
      ResourceManager.Handle.getViewerResource("mycard_btn_normal.png").texture,
      ResourceManager.Handle.getViewerResource("mycard_btn_down.png").texture,
      ResourceManager.Handle.getViewerResource("mycard_btn_over.png").texture
    );
    mycard.position.set(1070, 400);
    mycard.onClick = () => {
      this.mMyCardsGallery.start();
    };

    this.addChild(pigment, myownstage, singalong, mycard);

    const light = [pigment, myownstage, singalong, mycard];
    for (let i = 0; i < light.length; i++) {
      light[i]
        .on("pointerover", () => {
          this.mLight.position.set(light[i].x, 0);
          this.mLight.alpha = 1;
        })
        .on("pointerout", () => {
          this.mLight.alpha = 0;
        });
    }
  }

  destroy() {
    this.removeChildren();
    this.visible = false;
  }
}
