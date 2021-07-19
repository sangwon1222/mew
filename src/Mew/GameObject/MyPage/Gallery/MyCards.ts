import Config from "@/Mew/Config";
import { ResourceManager } from "@/Mew/Core/ResourceManager";
import { MyCardsModule } from "@/store/MyCards";
import gsap from "gsap";
import { Button } from "../../Common/Button";

const cardList1 = [
  "twinkle_lock.png",
  "littlejack_lock.png",
  "hickory_lock.png",
];

const cardList2 = [
  "heydiddle_lock.png",
  "jinglebell_lock.png",
  "family_lock.png",
];

const cardList3 = [
  "ifyourehappy_lock.png",
  "thisistheway_lock.png",
  "old_macdonald_lock.png",
];

const cardList4 = ["wheelonthebus_lock.png"];

export class MyCardsGallery extends PIXI.Sprite {
  private mGallery: PIXI.Container;
  private mGalleryId = 1;
  private mCurrentCardList: Array<string>;
  private mPagination: PIXI.Text;

  constructor() {
    super();
    this.visible = false;
  }
  start() {
    this.visible = true;
    this.interactive = true;
    this.mCurrentCardList = [];

    const BG = ResourceManager.Handle.getViewerResource("popup_mycard_bg.png")
      .texture;
    this.texture = BG;

    const close = new Button(
      ResourceManager.Handle.getViewerResource(
        "mycard_closebtn_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "mycard_closebtn_down.png"
      ).texture,
      ResourceManager.Handle.getViewerResource(
        "mycard_closebtn_over.png"
      ).texture
    );
    close.position.set(1280 - close.width, 40);
    this.addChild(close);
    close.onClick = () => {
      this.destroy();
    };

    this.mGallery = new PIXI.Container();
    this.addChild(this.mGallery);

    const left = new Button(
      ResourceManager.Handle.getViewerResource(
        "card_arrow_l_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource("card_arrow_l_down.png").texture,
      ResourceManager.Handle.getViewerResource("card_arrow_l_over.png").texture
    );
    left.position.set(left.width / 2, 800 / 2);
    this.addChild(left);
    left.onClick = () => {
      if (this.mGalleryId !== 1) {
        this.mGallery.position.x = 1280;
        this.mGalleryId -= 1;
        this.changeList();
      }
    };

    const right = new Button(
      ResourceManager.Handle.getViewerResource(
        "card_arrow_r_normal.png"
      ).texture,
      ResourceManager.Handle.getViewerResource("card_arrow_r_down.png").texture,
      ResourceManager.Handle.getViewerResource("card_arrow_r_over.png").texture
    );
    right.position.set(
      Config.app.width - right.width / 2,
      Config.app.height / 2
    );
    this.addChild(right);
    right.onClick = () => {
      if (this.mGalleryId !== 4) {
        this.mGallery.position.x = -1280 / 2;
        this.mGalleryId += 1;
        this.changeList();
      }
    };

    this.createGalleryStage();

    this.changeList();
  }

  createGalleryStage() {
    const guide = new PIXI.Graphics();
    guide.lineStyle(5, 0x000000, 1);
    guide.drawRect(0, 0, Config.app.width * 0.9, Config.app.height * 0.8);
    guide.endFill();
    // this.mGallery.addChild(guide);

    const style = new PIXI.TextStyle({
      fontFamily: "Bpreplay",
      fontSize: 48 * 0.67,
      fontWeight: "bold",
      fill: "0x0000",
      dropShadow: true,
    });

    this.mPagination = new PIXI.Text(`${this.mGalleryId}/4`, style);
    this.mPagination.position.set(
      this.width / 2 - this.mPagination.width / 2,
      100
    );
    this.addChild(this.mPagination);
  }

  changeList() {
    gsap.killTweensOf(this.mGallery);
    this.mPagination.text = `${this.mGalleryId}/4`;
    this.mGallery.removeChildren();
    let x = 80;
    if (this.mGalleryId == 1) {
      this.mCurrentCardList = cardList1;
    }
    if (this.mGalleryId == 2) {
      this.mCurrentCardList = cardList2;
    }
    if (this.mGalleryId == 3) {
      this.mCurrentCardList = cardList3;
    }
    if (this.mGalleryId == 4) {
      this.mCurrentCardList = cardList4;
    }

    for (let i = 0; i < this.mCurrentCardList.length; i++) {
      const respo = new PIXI.Sprite();

      if (MyCardsModule.setRecieved.length !== 0) {
        respo.texture = ResourceManager.Handle.getViewerResource(
          MyCardsModule.setRecieved.arguments
        ).texture;
      } else {
        respo.texture = ResourceManager.Handle.getViewerResource(
          this.mCurrentCardList[i]
        ).texture;
      }

      respo.position.set(x, 80);
      this.mGallery.addChild(respo);

      if (x > 700) {
        x = 80;
      } else {
        x += respo.width + 20;
      }
    }

    const aa = Math.random() * 40;
    const random = Math.ceil(aa);
    console.log(`aa=>[${aa}]`);
    console.log(`random=>[${random}]`);
    if (random <= 10) {
      this.mGallery.x = Config.app.width;
      this.mGallery.y = Config.app.height * 0.2;
      gsap.to(this.mGallery, {
        alpha: 1,
        x: Config.app.width * 0.05,
        duration: 0.25,
      });
    } else if (random > 10 && random <= 20) {
      this.mGallery.x = -Config.app.width;
      this.mGallery.y = Config.app.height * 0.2;
      gsap.to(this.mGallery, {
        alpha: 1,
        x: Config.app.width * 0.05,
        duration: 0.25,
      });
    } else if (random > 20 && random <= 30) {
      this.mGallery.x = Config.app.width * 0.05;
      this.mGallery.y = 720;
      gsap.to(this.mGallery, {
        alpha: 1,
        y: Config.app.height * 0.2,
        duration: 0.25,
      });
    } else if (random > 30 && random <= 40) {
      this.mGallery.x = Config.app.width * 0.05;
      this.mGallery.y = -720;
      gsap.to(this.mGallery, {
        alpha: 1,
        y: Config.app.height * 0.2,
        duration: 0.25,
      });
    }
  }

  destroy() {
    this.removeChildren();
    this.visible = false;
  }
}
