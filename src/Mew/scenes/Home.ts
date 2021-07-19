import { SceneBase } from "../Core/SceneBase";
import { ListButton } from "../GameObject/Home/listButton";
import { Button } from "../GameObject/Common/Button";
import { ResourceManager } from "../Core/ResourceManager";
import Config from "../Config";
import { Common } from "../Resource/CommonResource/Common";
import { HomeViewerData } from "../Resource/ViewerResource/Home";
import PIXISound from "pixi-sound";
import { ActivityModule } from "@/store/Activity";
import { MyPage } from "@/Mew/GameObject/MyPage/MyPage";
import { MotionPathPlugin, TweenMax } from "gsap/all";
import gsap, { Linear } from "gsap";

const thema = [
  "Twinkle Twinkle Little Star", //2
  "Little Jack Horner", //5
  "Hickory Dickory Dock", //3
  "Hey! Diddle, Diddle", //1
  "Jingle Bells", //4
  "Finger Family", //6
  "If you`re Happy", //7
  "This Is The Way", //8
  "Old MacDonald Had A Farm", //9
  "The Wheels On The Bus", //10
];
/** 아래부분 높이값 Config.app.height*0.4569 */
export class Home extends SceneBase {
  private mBG: PIXI.Sprite;

  private mListBox: PIXI.Container;
  private mThemaBox: PIXI.Container;
  private mGameThemaMask: PIXI.Container;
  private mNaviBox: PIXI.Container;

  private mThemaList: PIXI.Container;

  private mGameThema: PIXI.Sprite;
  private mStore: PIXI.Sprite;
  private mLabel: PIXI.Sprite;

  private mListArray: Array<ListButton>;

  private mMyStage: MyPage;

  private mInfo: Button;
  private mMyPage: Button;
  private mExit: Button;
  private mLeftButton: Button;
  private mRightButton: Button;

  private mButtonFlag = true;

  private mThemaIDX: number;
  private mThemaText: PIXI.Text;

  static _handle: Home;
  static get Handle(): Home {
    return Home._handle;
  }

  constructor() {
    super("Home");
    // console.log("Home Page");

    Home._handle = this;
  }

  // 리소스 로딩
  async onInit() {
    this.removeChildren();
    PIXISound.stopAll();
    if (this.productName == "") {
      this.productName = "b1";
      this.mThemaIDX = 0;
    }
    await this.loadViewerResource(HomeViewerData);
    await this.loadCommonResource(Common);
  }

  // 기본적인 UI 생성
  async onStart() {
    this.mListArray = [];
    this.mGameThemaMask = new PIXI.Container();
    this.mStore = new PIXI.Sprite();

    this.mBG = new PIXI.Sprite(this.getViewerResource(`main_bg.png`).texture);
    this.mBG.anchor.set(0.5);
    this.mBG.position.set(Config.app.width / 2, Config.app.height / 2);
    this.addChild(this.mBG);

    this.mThemaBox = new PIXI.Container();
    await this.createThema();
    this.createArrowBtn();
    this.addChild(this.mThemaBox);
    this.mThemaBox.position.set(
      Config.app.width / 2 - this.mThemaBox.width / 2,
      8
    );

    await this.createList();

    this.mNaviBox = new PIXI.Container();
    await this.createNavi();
    this.mNaviBox.position.set(
      this.mBG.width / 2 - this.mNaviBox.width,
      -this.mBG.height * 0.48
    );
    this.mBG.addChild(this.mNaviBox);

    this.gameThemaMask();
    this.changeThema(true);
    this.checkButtonIDX();

    this.clickInfo();
    // this.clickMyPage();
    this.clickExit();

    const BGM = ResourceManager.Handle.getViewerResource(`snd_bgm.mp3`).sound;
    BGM.play({ loop: true });

    this.mLeftButton.onClick = () => {
      if (this.mButtonFlag) {
        this.mThemaIDX -= 1;
        this.productName = `b${this.mThemaIDX + 1}`;
        this.checkButtonIDX();
        this.changeThema(false);

        // console.log(
        //   `Thema= %c  [${thema[this.mThemaIDX]}]`,
        //   "background-color:black;color:pink;"
        // );
        // console.log(
        //   `%c [${this.mThemaIDX + 1}]번째 테마 : ${this.productName}`,
        //   "background-color:black;color:white;"
        // );
      } else {
        // console.log(`0.4초 후에 클릭해주세요`);
      }
    };

    this.mRightButton.onClick = () => {
      if (this.mButtonFlag) {
        this.mThemaIDX += 1;
        this.productName = `b${this.mThemaIDX + 1}`;
        this.checkButtonIDX();
        this.changeThema(true);

        // console.log(
        //   `Thema= %c  [${thema[this.mThemaIDX]}]`,
        //   "background-color:black;color:pink;"
        // );
        // console.log(
        //   `%c [${this.mThemaIDX + 1}]번째 테마 : ${this.productName}`,
        //   "background-color:black;color:white;"
        // );
      } else {
        // console.log(`0.4초 후에 클릭해주세요`);
      }
    };

    this.mMyStage = new MyPage();
    this.addChild(this.mMyStage);
  }

  // 아래 액티비티 모듈버튼
  createList(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mListBox = new PIXI.Container();
      let offSetX = 0;
      let offSetY = 0;
      for (let i = 0; i < 12; i++) {
        const btn = new ListButton(i + 1);
        if (i % 6 == 0 && i > 0) {
          offSetX = 0;
          offSetY += btn.height / 2 + 64;
        }
        btn.position.set(btn.width / 2 + offSetX, btn.height / 2 + offSetY);
        offSetX += btn.width * 0.8;
        this.mListBox.addChild(btn);
        this.mListArray.push(btn);
      }

      this.addChild(this.mListBox);
      this.mListBox.position.set(
        Config.app.width / 2 - this.mListBox.width / 2,
        Config.app.height * 0.45
      );
      resolve();
    });
  }

  offInteractive(): Promise<void>{
    return new Promise<void>(resolve => {
      for (const btn of this.mListArray){
        btn.interactive = false;
        btn.buttonMode = false;
      }
      resolve()
    })
  }

  disableListBtn() {
    for (const list of this.mListArray) {
      list.interactive = false;
    }
  }

  createNavi(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mInfo = new Button(
        ResourceManager.Handle.getCommonResource(
          `main_character_btn_normal.png`
        ).texture,
        ResourceManager.Handle.getCommonResource(
          `main_character_btn_down.png`
        ).texture,
        ResourceManager.Handle.getCommonResource(
          `main_character_btn_over.png`
        ).texture
      );
      // this.mMyPage = new Button(
      //   ResourceManager.Handle.getCommonResource(
      //     `main_mypage_btn_normal.png`
      //   ).texture,
      //   ResourceManager.Handle.getCommonResource(
      //     `main_mypage_btn_down.png`
      //   ).texture,
      //   ResourceManager.Handle.getCommonResource(
      //     `main_mypage_btn_over.png`
      //   ).texture
      // );
      this.mExit = new Button(
        ResourceManager.Handle.getCommonResource(
          `main_exit_btn_normal.png`
        ).texture,
        ResourceManager.Handle.getCommonResource(
          `main_exit_btn_down.png`
        ).texture,
        ResourceManager.Handle.getCommonResource(
          `main_exit_btn_over.png`
        ).texture
      );

      this.mInfo.hitArea = new PIXI.Ellipse(
        0,
        0,
        this.mInfo.width / 2,
        this.mInfo.height / 2
      );
      // this.mMyPage.hitArea = new PIXI.Ellipse(
      //   0,
      //   0,
      //   this.mMyPage.width / 2,
      //   this.mMyPage.height / 2
      // );
      this.mExit.hitArea = new PIXI.Ellipse(
        0,
        0,
        this.mExit.width / 2,
        this.mExit.height / 2
      );

      this.mInfo.x = 0;
      // this.mMyPage.x = this.mMyPage.width * 0.9;
      // this.mExit.x = this.mMyPage.x * 2;

      this.mExit.x = this.mInfo.width ;

      // this.mNaviBox.addChild(this.mInfo, this.mMyPage, this.mExit);
      this.mNaviBox.addChild(this.mInfo,  this.mExit);
      resolve();
    });
  }

  createThema(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.mLabel = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`title_box.png`).texture
      );
      this.mLabel.anchor.set(0.5);
      this.mThemaBox.addChild(this.mLabel);

      /**테마 글자 */
      const style = new PIXI.TextStyle({
        fontFamily: "BPreplayBold",
        fontSize: 48 * 0.67,
        // fontStyle: 'italic',
        fontWeight: "bold",
        fill: "0x0000",
        dropShadow: true,
      });

      /**테마 뒷배경 (비어있는 사진) */
      const themaShadow = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`main_title_sub.png`).texture
      );
      themaShadow.anchor.set(0.5);
      this.mThemaBox.addChild(themaShadow);

      /**테마 타이틀 */
      this.mThemaText = new PIXI.Text(thema[this.mThemaIDX], style);
      this.mThemaText.anchor.set(0.5);

      /**테마사진 클릭하면 나오는 테마리스트 */
      this.sortableChildren = true;
      this.mThemaList = new PIXI.Container();
      const bg = new PIXI.Graphics();
      bg.beginFill(0x000000, 1);
      bg.drawRect(0, 0, Config.app.width, Config.app.height);
      bg.endFill();
      bg.interactive = true;
      bg.alpha = 0.6;
      bg.on("pointertap", () => {
        this.mThemaList.visible = false;
      });
      this.mThemaList.addChild(bg);
      this.mThemaList.zIndex = 2;
      this.addChild(this.mThemaList);
      this.mThemaList.visible = false;

      let offsetX = 200;
      let offsetY = 300;
      for (let i = 1; i <= 10; i++) {
        const thema = new PIXI.Sprite(
          ResourceManager.Handle.getViewerResource(
            `main_title_${i}.png`
          ).texture
        );
        thema.anchor.set(0.5);
        thema.position.set(Config.app.width / 2, Config.app.height / 2);
        gsap
          .to(thema, { x: offsetX, y: offsetY, duration: 0.5 })
          .delay(0.1 * i);
        offsetX += thema.width;
        if (i % 5 == 0) {
          offsetX = 200;
          offsetY += 240;
        }

        thema.interactive = true;
        thema.on("pointertap", () => {
          this.mThemaIDX = i - 1;
          this.productName = `b${this.mThemaIDX + 1}`;
          this.changeThema(true);
       
          this.mThemaList.visible = false;
        });
        this.mThemaList.addChild(thema);
      }

      /**테마 사진 */
      this.mGameThema = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(
          `main_title_${this.mThemaIDX + 1}.png`
        ).texture
      );
      this.mGameThema.anchor.set(0.5);
      this.mGameThema.interactive = true;
      this.mGameThema.on("pointertap", () => {
        this.mThemaList.visible = true;
      });

      /**테마 마스크 */
      this.mGameThemaMask.addChild(this.mGameThema);
      this.mThemaBox.addChild(this.mGameThemaMask);
      this.mLabel.addChild(this.mThemaText);

      /**위치값 */
      this.mGameThemaMask.position.set(
        this.mThemaBox.width / 2,
        this.mGameThema.height * 0.66
      );
      this.mLabel.position.set(
        this.mLabel.width / 2,
        this.mThemaBox.height - this.mLabel.height * 1.2
      );
      themaShadow.position.set(this.mGameThemaMask.x, this.mGameThemaMask.y);

      /**테마박스 위치 가운데 정렬 */
      this.mThemaBox.x = this.mThemaBox.x - this.mThemaBox.width / 2;

      // const debug = new PIXI.Graphics();
      // debug.lineStyle(2,0xff000,1)
      // debug.drawRect(0,0,this.mThemaBox.width,this.mThemaBox.height)
      // this.mThemaBox.addChild(debug)
      resolve();
    });
  }

  gameThemaMask() {
    const mask = new PIXI.Graphics();
    mask.beginFill(0xaa4f08, 0.5);
    mask.drawEllipse(-5, -5, this.mGameThema.width, this.mGameThema.height);
    mask.endFill();
    this.mGameThemaMask.addChild(mask);
    this.mGameThema.mask = mask;
    mask.scale.set(0.5);
  }

  createArrowBtn() {
    this.mLeftButton = new Button(
      ResourceManager.Handle.getCommonResource(`l_arrow_normal.png`).texture,
      ResourceManager.Handle.getCommonResource(`l_arrow_down.png`).texture,
      ResourceManager.Handle.getCommonResource(`l_arrow_over.png`).texture,
      ResourceManager.Handle.getCommonResource(`l_arrow_dis.png`).texture
    );
    this.mLeftButton.anchor.set(0.5);
    this.mLeftButton.position.set(
      this.mGameThemaMask.x -
        (this.mGameThemaMask.width + this.mLeftButton.width) / 2,
      this.mGameThemaMask.y
    );
    this.mThemaBox.addChild(this.mLeftButton);
    this.mLeftButton.disable = true;

    this.mRightButton = new Button(
      ResourceManager.Handle.getCommonResource(`r_arrow_normal.png`).texture,
      ResourceManager.Handle.getCommonResource(`r_arrow_down.png`).texture,
      ResourceManager.Handle.getCommonResource(`r_arrow_over.png`).texture,
      ResourceManager.Handle.getCommonResource(`r_arrow_dis.png`).texture
    );
    this.mRightButton.anchor.set(0.5);
    this.mRightButton.position.set(
      this.mGameThemaMask.x +
        (this.mGameThemaMask.width + this.mRightButton.width) / 2,
      this.mGameThemaMask.y
    );
    this.mThemaBox.addChild(this.mRightButton);
  }

  checkButtonIDX() {
    //좌클릭
    if (this.mThemaIDX < 1) {
      this.mLeftButton.disable = true;
      this.mThemaIDX = 0;
    } else {
      this.mLeftButton.disable = false;
    }
    //우클릭
    if (this.mThemaIDX > 8) {
      /**구매페이지 10 */
      this.mRightButton.disable = true;
      this.mThemaIDX = 9;
    } else {
      this.mRightButton.disable = false;
    }
  }

  changeThema(right: boolean) {
    this.mButtonFlag = false;

    let offSetX1 = -200;
    let offSetX2 = 200;

    if (!right) {
      offSetX1 = 200;
      offSetX2 = -200;
      this.startMotion(false);
    } else {
      this.startMotion(true);
    }

    /**텍스트 모션 */
    gsap
      .to(this.mThemaText, { alpha: 0, duration: 0.1 })
      .eventCallback("onComplete", () => {
        this.mThemaText.text = thema[this.mThemaIDX];
        gsap.to(this.mThemaText, { alpha: 1, duration: 0.1 });
      });
    /**테마 모션 */
    gsap
      .to(this.mGameThema, { x: offSetX1, duration: 0.1 })
      .eventCallback("onComplete", () => {
        this.mGameThema.x = offSetX2;
        this.titleLock();
        if (this.mThemaIDX != 10) {
          this.mGameThema.texture = Home.Handle.getViewerResource(
            `main_title_${this.mThemaIDX + 1}.png`
          ).texture;
        } else {
          this.mGameThema.texture = Home.Handle.getViewerResource(
            `main_title_lock.png`
          ).texture;
        }

        gsap
          .to(this.mGameThema, { x: 0, duration: 0.5, ease: "bounce" })
          .eventCallback("onComplete", () => {
            this.mButtonFlag = true;
          });
      });
  }

  titleLock() {
    if (this.mThemaIDX != 10) {
      gsap.to(this.mListBox, { alpha: 1, duration: 1 });

      gsap.to(this.mStore, { alpha: 0, duration: 1 });
      this.removeChild(this.mStore);
      this.mLabel.alpha = 1;
    } else {
      /**라벨 없애고 */
      this.mLabel.alpha = 0;

      /**리스트박스 없애고 */
      gsap.to(this.mListBox, { alpha: 0, duration: 0.5 });

      /**팝업창 나오고 */
      this.mStore = new PIXI.Sprite(
        ResourceManager.Handle.getViewerResource(`main_buypage_bg.png`).texture
      );
      this.mStore.interactive = true;
      this.mStore.position.set(Config.app.width / 2, Config.app.height * 0.45);
      this.mStore.anchor.set(0.5, 0);
      this.mStore.alpha = 0;
      gsap.to(this.mStore, { alpha: 1, duration: 1 });

      /**팝업창 버튼 나오고 */
      // const debug = new PIXI.Graphics();
      // debug.lineStyle(2,0xff00,1)
      // debug.drawRect(0,0,this.mStore.width,this.mStore.height)
      // debug.endFill();
      // this.mStore.addChild(debug)

      this.addChild(this.mStore);

      const storeButton = new Button(
        ResourceManager.Handle.getCommonResource(
          `main_move_btn_normal.png`
        ).texture,
        ResourceManager.Handle.getCommonResource(
          `main_move_btn_down.png`
        ).texture,
        ResourceManager.Handle.getCommonResource(
          `main_move_btn_over.png`
        ).texture
      );

      this.mStore.addChild(storeButton);

      storeButton.interactive = true;
      storeButton.buttonMode = true;

      storeButton.on("pointertap", () => {
        // console.log(`구매!!!`);
      });
    }
  }

  clickInfo() {
    this.mInfo.onClick = () => {
      this.mBG.removeChild(this.mNaviBox);

      const infoModal = new PIXI.Sprite(
        this.getViewerResource(`cha_room_bg.png`).texture
      );
      this.addChild(infoModal);
      infoModal.interactive = true;

      const exit = new Button(
        ResourceManager.Handle.getCommonResource(
          "btn_close_normal.png"
        ).texture,
        ResourceManager.Handle.getCommonResource("btn_close_down.png").texture,
        ResourceManager.Handle.getCommonResource("btn_close_over.png").texture
      );
      infoModal.addChild(exit);
      exit.position.set(infoModal.width - exit.width, exit.height);

      exit.onClick = () => {
        this.removeChild(infoModal);
        gsap.delayedCall(0.1, () => {
          this.mBG.addChild(this.mNaviBox);
        });
      };
    };
  }

  // clickMyPage() {
  //   this.mMyPage.onClick = () => {
  //     this.mMyStage.start();
  //   };
  // }

  clickExit() {
    this.mExit.onClick = () => {
      const dimmed = new PIXI.Graphics();
      dimmed.beginFill(0x0000, 0.6);
      dimmed.drawRect(0, 0, 1280, 800);
      dimmed.endFill();
      this.addChild(dimmed);
      dimmed.interactive = true;
      dimmed.on("pointermove", (evt: PIXI.InteractionEvent) => {
        return evt.stopPropagation();
      });

      const exitModal = new PIXI.Sprite(
        ResourceManager.Handle.getCommonResource(
          `main_popup_quit_bg.png`
        ).texture
      );
      dimmed.addChild(exitModal);
      exitModal.anchor.set(0.5);
      exitModal.position.set(Config.app.width / 2, Config.app.height / 2);

      const yes = new Button(
        ResourceManager.Handle.getCommonResource(
          `main_popup_quit_btn_yes_normal.png`
        ).texture,
        ResourceManager.Handle.getCommonResource(
          `main_popup_quit_btn_yes_down.png`
        ).texture
      );
      const no = new Button(
        ResourceManager.Handle.getCommonResource(
          `main_popup_quit_btn_no_normal.png`
        ).texture,
        ResourceManager.Handle.getCommonResource(
          `main_popup_quit_btn_no_down.png`
        ).texture
      );
      exitModal.addChild(yes);
      exitModal.addChild(no);
      yes.position.set(-yes.width / 2, yes.height * 0.67);
      no.position.set(yes.width / 2, yes.height * 0.67);

      yes.onClick = () => {
        this.removeChildren();
        screen.orientation.unlock();
        document.exitFullscreen();

        // window.top.close();
        // parent.close();
        parent.window.close();
        // self.close();
      };
      no.onClick = () => {
        this.removeChild(dimmed);
      };
    };
  }

  startMotion(right: boolean) {
    let offsetX = Config.app.width;
    if (!right) {
      offsetX = -Config.app.width;
    }
    for (let i = 0; i < this.mListArray.length; i++) {
      gsap.from(this.mListArray[i], { alpha: 0, x: offsetX, duration: 0.4 });
    }
  }

  async onEnd() {
    //
  }
}
