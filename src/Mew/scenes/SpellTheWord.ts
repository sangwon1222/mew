import { SceneBase } from "../Core/SceneBase";
import { Header } from "../GameObject/Common/Header";
import { ResourceManager } from "../Core/ResourceManager";
import Config from "../Config";
import { Button } from "../GameObject/Common/Button";
import { HowTo } from "../GameObject/Common/HowTo";
import { Outro } from "../GameObject/Common/Outro";
import { Splash } from "../GameObject/Common/Splash";
import { AlphabetAsset } from "../GameObject/SpellTheWord/AlphabetAsset";
import { WordBoard } from "../GameObject/SpellTheWord/WordBoard";
import { WordImgBoard } from "../GameObject/SpellTheWord/WordImgBoard";
// import {WordImgBoard} from '@/Mew/GameObject/SpellTheWord/WordImgBoard';
import { PickPuzzleBoard } from "../GameObject/SpellTheWord/PickPuzzleBoard";
import { Progress } from "../GameObject/Common/Progress";
import { SpellTheWordViewerData } from "../Resource/ViewerResource/SpellTheWord";
import * as SpellTheWordProductData from "../Resource/ProductResource/SpellTheWord";
import * as Util from "../Core/Util";
import gsap from "gsap";
import PIXISound from "pixi-sound";
import { Home } from "./Home";

const quizInfo = {
  b1: [
    {
      word: "star",
      image: "img_star.png",
      sound: "wd_2_1.mp3",
    },
    {
      word: "world",
      image: "img_world.png",
      sound: "wd_2_2.mp3",
    },
    {
      word: "little",
      image: "img_little.png",
      sound: "wd_2_3.mp3",
    },
    {
      word: "sky",
      image: "img_sky.png",
      sound: "wd_2_4.mp3",
    },
    {
      word: "diamond",
      image: "img_diamond.png",
      sound: "wd_2_5.mp3",
    },
    {
      word: "leaf",
      image: "img_leaf.png",
      sound: "wd_2_6.mp3",
    },
    {
      word: "girl",
      image: "img_girl.png",
      sound: "wd_2_7.mp3",
    },
    {
      word: "car",
      image: "img_car.png",
      sound: "wd_2_8.mp3",
    },
    {
      word: "owl",
      image: "img_owl.png",
      sound: "wd_2_9.mp3",
    },
    {
      word: "tree",
      image: "img_tree.png",
      sound: "wd_2_10.mp3",
    },
  ],
  b2: [
    {
      word: "corner",
      image: "img_corner.png",
      sound: "wd_5_1.mp3",
    },
    {
      word: "pie",
      image: "img_pie.png",
      sound: "wd_5_2.mp3",
    },
    {
      word: "thumb",
      image: "img_thumb.png",
      sound: "wd_5_3.mp3",
    },
    {
      word: "plum",
      image: "img_plum.png",
      sound: "wd_5_4.mp3",
    },
    {
      word: "boy",
      image: "img_boy.png",
      sound: "wd_5_5.mp3",
    },
    {
      word: "bear",
      image: "img_bear.png",
      sound: "wd_5_6.mp3",
    },
    {
      word: "sock",
      image: "img_sock.png",
      sound: "wd_5_7.mp3",
    },
    {
      word: "box",
      image: "img_box.png",
      sound: "wd_5_8.mp3",
    },
    {
      word: "gift",
      image: "img_gift.png",
      sound: "wd_5_9.mp3",
    },
    {
      word: "candle",
      image: "img_candle.png",
      sound: "wd_5_10.mp3",
    },
  ],
  b3: [
    {
      word: "mouse",
      image: "img_mouse.png",
      sound: "wd_3_1.mp3",
    },
    {
      word: "clock",
      image: "img_clock.png",
      sound: "wd_3_2.mp3",
    },
    {
      word: "up",
      image: "img_up.png",
      sound: "wd_3_3.mp3",
    },
    {
      word: "down",
      image: "img_down.png",
      sound: "wd_3_4.mp3",
    },
    {
      word: "one",
      image: "img_one.png",
      sound: "wd_3_5.mp3",
    },
    {
      word: "ball",
      image: "img_ball.png",
      sound: "wd_3_6.mp3",
    },
    {
      word: "chair",
      image: "img_chair.png",
      sound: "wd_3_7.mp3",
    },
    {
      word: "drawer",
      image: "img_drawer.png",
      sound: "wd_3_8.mp3",
    },
    {
      word: "frame",
      image: "img_frame.png",
      sound: "wd_3_9.mp3",
    },
    {
      word: "light",
      image: "img_light.png",
      sound: "wd_3_10.mp3",
    },
  ],
  b4: [
    {
      word: "cat",
      image: "img_cat.png",
      sound: "wd_1_1.mp3",
    },
    {
      word: "cow",
      image: "img_cow.png",
      sound: "wd_1_2.mp3",
    },
    {
      word: "dog",
      image: "img_dog.png",
      sound: "wd_1_3.mp3",
    },
    {
      word: "moon",
      image: "img_moon.png",
      sound: "wd_1_4.mp3",
    },
    {
      word: "dish",
      image: "img_dish.png",
      sound: "wd_1_5.mp3",
    },
    {
      word: "spoon",
      image: "img_spoon.png",
      sound: "wd_1_6.mp3",
    },
    {
      word: "bag",
      image: "img_bag.png",
      sound: "wd_1_7.mp3",
    },
    {
      word: "jump",
      image: "img_jump.png",
      sound: "wd_1_8.mp3",
    },
    {
      word: "violin",
      image: "img_violin.png",
      sound: "wd_1_9.mp3",
    },
    {
      word: "house",
      image: "img_house.png",
      sound: "wd_1_10.mp3",
    },
  ],
  b5: [
    {
      word: "snow",
      image: "img_snow.png",
      sound: "wd_4_1.mp3",
    },
    {
      word: "horse",
      image: "img_horse.png",
      sound: "wd_4_2.mp3",
    },
    {
      word: "song",
      image: "img_song.png",
      sound: "wd_4_3.mp3",
    },
    {
      word: "field",
      image: "img_field.png",
      sound: "wd_4_4.mp3",
    },
    {
      word: "tail",
      image: "img_tail.png",
      sound: "wd_4_5.mp3",
    },
    {
      word: "cloud",
      image: "img_cloud.png",
      sound: "wd_4_6.mp3",
    },
    {
      word: "elf",
      image: "img_elf.png",
      sound: "wd_4_7.mp3",
    },
    {
      word: "sled",
      image: "img_sled.png",
      sound: "wd_4_8.mp3",
    },
    {
      word: "snowman",
      image: "img_snowman.png",
      sound: "wd_4_9.mp3",
    },
    {
      word: "santa",
      image: "img_santa.png",
      sound: "wd_4_10.mp3",
    },
  ],
  b6: [
    {
      word: "daddy",
      image: "img_daddy.png",
      sound: "wd_6_1.mp3",
    },
    {
      word: "finger",
      image: "img_finger.png",
      sound: "wd_6_2.mp3",
    },
    {
      word: "mommy",
      image: "img_mommy.png",
      sound: "wd_6_3.mp3",
    },
    {
      word: "brother",
      image: "img_brother.png",
      sound: "wd_6_4.mp3",
    },
    {
      word: "sister",
      image: "img_sister.png",
      sound: "wd_6_5.mp3",
    },
    {
      word: "baby",
      image: "img_baby.png",
      sound: "wd_6_6.mp3",
    },
    {
      word: "family",
      image: "img_family.png",
      sound: "wd_6_7.mp3",
    },
    {
      word: "cap",
      image: "img_cap.png",
      sound: "wd_6_8.mp3",
    },
    {
      word: "stage",
      image: "img_stage.png",
      sound: "wd_6_9.mp3",
    },
    {
      word: "puppet",
      image: "img_puppet.png",
      sound: "wd_6_10.mp3",
    },
  ],
  b7: [
    {
      word: "happy",
      image: "img_happy.png",
      sound: "wd_7_1.mp3",
    },
    {
      word: "hand",
      image: "img_hand.png",
      sound: "wd_7_2.mp3",
    },
    {
      word: "clap",
      image: "img_clap.png",
      sound: "wd_7_3.mp3",
    },
    {
      word: "angry",
      image: "img_angry.png",
      sound: "wd_7_4.mp3",
    },
    {
      word: "stomp",
      image: "img_stomp.png",
      sound: "wd_7_5.mp3",
    },
    {
      word: "feet",
      image: "img_feet.png",
      sound: "wd_7_6.mp3",
    },
    {
      word: "scare",
      image: "img_scare.png",
      sound: "wd_7_7.mp3",
    },
    {
      word: "say",
      image: "img_say.png",
      sound: "wd_7_8.mp3",
    },
    {
      word: "sleep",
      image: "img_sleep.png",
      sound: "wd_7_9.mp3",
    },
    {
      word: "nap",
      image: "img_nap.png",
      sound: "wd_7_10.mp3",
    },
  ],
  b8: [
    {
      word: "comb",
      image: "img_comb.png",
      sound: "wd_8_1.mp3",
    },
    {
      word: "hair",
      image: "img_hair.png",
      sound: "wd_8_2.mp3",
    },
    {
      word: "bed",
      image: "img_bed.png",
      sound: "wd_8_3.mp3",
    },
    {
      word: "early",
      image: "img_early.png",
      sound: "wd_8_4.mp3",
    },
    {
      word: "morning",
      image: "img_morning.png",
      sound: "wd_8_5.mp3",
    },
    {
      word: "wash",
      image: "img_wash.png",
      sound: "wd_8_6.mp3",
    },
    {
      word: "face",
      image: "img_face.png",
      sound: "wd_8_7.mp3",
    },
    {
      word: "brush",
      image: "img_brush.png",
      sound: "wd_8_8.mp3",
    },
    {
      word: "teeth",
      image: "img_teeth.png",
      sound: "wd_8_9.mp3",
    },
    {
      word: "dress",
      image: "img_dress.png",
      sound: "wd_8_10.mp3",
    },
  ],
  b9: [
    {
      word: "farm",
      image: "img_farm.png",
      sound: "wd_9_1.mp3",
    },
    {
      word: "guitar",
      image: "img_guitar.png",
      sound: "wd_9_2.mp3",
    },
    {
      word: "pond",
      image: "img_pond.png",
      sound: "wd_9_3.mp3",
    },
    {
      word: "grandfather",
      image: "img_grandfather.png",
      sound: "wd_9_4.mp3",
    },
    {
      word: "pig",
      image: "img_pig.png",
      sound: "wd_9_5.mp3",
    },
    {
      word: "duck",
      image: "img_duck.png",
      sound: "wd_9_6.mp3",
    },
    {
      word: "horse",
      image: "img_horse.png",
      sound: "wd_9_7.mp3",
    },
    {
      word: "sheep",
      image: "img_sheep.png",
      sound: "wd_9_8.mp3",
    },
    {
      word: "dog",
      image: "img_dog.png",
      sound: "wd_9_9.mp3",
    },
    {
      word: "old",
      image: "img_old.png",
      sound: "wd_9_10.mp3",
    },
  ],
  b10: [
    {
      word: "wheels",
      image: "img_wheel.png",
      sound: "wd_10_1.mp3",
    },
    {
      word: "bus",
      image: "img_bus.png",
      sound: "wd_10_2.mp3",
    },
    {
      word: "town",
      image: "img_town.png",
      sound: "wd_10_3.mp3",
    },
    {
      word: "wiper",
      image: "img_wiper.png",
      sound: "wd_10_4.mp3",
    },
    {
      word: "door",
      image: "img_door.png",
      sound: "wd_10_5.mp3",
    },
    {
      word: "road",
      image: "img_road.png",
      sound: "wd_10_6.mp3",
    },
    {
      word: "window",
      image: "img_window.png",
      sound: "wd_10_7.mp3",
    },
    {
      word: "rain",
      image: "img_rain.png",
      sound: "wd_10_8.mp3",
    },
    {
      word: "round",
      image: "img_round.png",
      sound: "wd_10_9.mp3",
    },
    {
      word: "rainbow",
      image: "img_rainbow.png",
      sound: "wd_10_10.mp3",
    },
  ],
};

export class SpellTheWord extends SceneBase {
  private mHeader: Header;

  private mProgress: Progress;

  private wordContainer: PIXI.Container;
  private wordBundleContainer: PIXI.Container;

  private speakerBtn: Button;
  private wordSnd: PIXISound.Sound;

  private imgaBorad: WordImgBoard;
  private wordBoard: WordBoard;
  private pickPuzzleBoard: PickPuzzleBoard;

  private maxQuiz: number;
  private currentQuiz: number;

  private currentPhase: number;
  private maxPhase: number;

  private rndWordList: Array<number>;

  constructor() {
    super(`SpellTheWord`);
  }

  async onInit() {
    this.productName = Home.Handle.productName;
    PIXISound.stopAll();

    //const responseViewer = await this.getViewerJSON();
    await this.loadViewerResource(SpellTheWordViewerData);

    // const responseProduct = await this.getProductJSON();
    await this.loadProductResource(SpellTheWordProductData[this.productName]);

    // const responseCommon = await ResourceManager.Handle.getCommonJSON("common");
    // await this.loadCommonResource(responseCommon.data);
  }

  async onStart() {
    this.maxQuiz = 5;
    this.currentQuiz = 0;

    this.currentPhase = 0;
    this.maxPhase = 2;
    this.rndWordList = [];

    this.mHeader = new Header();

    this.mProgress = new Progress(this.maxQuiz);
    this.mProgress.position.set(Config.app.width / 2, 770);

    this.wordContainer = new PIXI.Container();
    this.wordBundleContainer = new PIXI.Container();

    this.imgaBorad = new WordImgBoard();

    this.wordBoard = new WordBoard();
    this.wordBoard.animationFinish = () => this.allButtonIsReady();

    // spine 사용으로 배경 이미지가 필요가 없음.
    // const bgSky = new PIXI.Sprite(ResourceManager.Handle.getViewerResource('bg_sky.png').texture);
    // bgSky.anchor.set(0.5, 0);
    // bgSky.position.set(Config.app.width / 2, 0);
    // this.addChild(bgSky);
    //

    const bgSky = new Splash(
      ResourceManager.Handle.getViewerResource(`spell_sky.json`).spineData,
      `particle`,
      true
    );
    bgSky.position.set(640, 102);
    this.addChild(bgSky);
    bgSky.start();

    // const bgSky = new PIXI.spine.Spine(ResourceManager.Handle.getViewerResource("spell_sky.json").spineData);
    // bgSky.state.setAnimation(0, "particle", true);
    // bgSky.width = 1280;
    // bgSky.scale.y = bgSky.scale.x;
    // bgSky.x = 1280/2;
    // bgSky.y = 102;
    // this.addChild(bgSky);

    const bgWall = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource("bg_wall.png").texture
    );
    bgWall.position.set(0, Config.app.height - bgWall.height);
    this.addChild(bgWall);
    this.addChild(this.imgaBorad);

    /*
        const bob = new PIXI.spine.Spine(ResourceManager.Handle.getViewerResource("bob.json").spineData);
        bob.state.setAnimation(0, "bob_de", true);
        bob.scale.set(0.62,0.62);
        bob.position.set(1130,190);
        this.addChild(bob);

        const pho = new PIXI.spine.Spine(ResourceManager.Handle.getViewerResource("pho.json").spineData);
        pho.state.setAnimation(0, "defalt", true);
        pho.scale.set(0.62,0.62);
        pho.position.set(1170,190);
        this.addChild(pho);
        */

    const bob = new Splash(
      ResourceManager.Handle.getViewerResource(`bob.json`).spineData,
      `bob_de`,
      true
    );
    bob.position.set(1130, 190);
    this.addChild(bob);
    bob.start();

    const pho = new Splash(
      ResourceManager.Handle.getViewerResource(`pho.json`).spineData,
      `defalt`,
      true
    );
    pho.position.set(1170, 190);
    this.addChild(pho);
    pho.start();

    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource("spelltheword_title.png").texture
    );
    title.position.set(0, 20);
    this.addChild(title);

    this.addChild(this.wordContainer);
    this.wordBundleContainer.addChild(this.wordBoard);
    this.wordContainer.addChild(this.wordBundleContainer);

    this.pickPuzzleBoard = new PickPuzzleBoard();
    this.addChild(this.pickPuzzleBoard);

    this.speakerBtn = new Button(
      ResourceManager.Handle.getCommonResource(
        "common_btn_speaker_normal.png"
      ).texture,
      ResourceManager.Handle.getCommonResource(
        "common_btn_speaker_over.png"
      ).texture,
      ResourceManager.Handle.getCommonResource(
        "common_btn_speaker_down.png"
      ).texture
    );
    this.speakerBtn.hitArea = new PIXI.Circle(0, 0, 40);
    this.speakerBtn.position.set(790, 54);
    this.speakerBtn.interactive = false;
    this.speakerBtn.onClick = () => {
      this.onPlayWordSound();
    };
    this.addChild(this.speakerBtn);
    this.addChild(this.mProgress);

    this.addChild(this.mHeader);
    this.addEventOnPuzzleClick();
    this.getQuizWords();
    this.takeQuiz(false);
    /**HOWTO */
    const howTo = new HowTo();
    this.addChild(howTo);
    await howTo.howTo();
    this.removeChild(howTo);

    const bgSnd = ResourceManager.Handle.getViewerResource("snd_bgm.mp3").sound;
    bgSnd.play({ loop: true });

    this.wordBoard.playBrokenPuzzle();
    this.wordBoard.firstStart = false;
    //this.pickPuzzleBoard.isClick = true;
  }

  async onEnd() {
    PIXISound.stopAll();
    /**OUTRO */
    const outro = new Outro();
    this.addChild(outro);
    await outro.outro();
  }

  //해당 productName의 정보를 가져와서 순서를 셔플한다.
  getQuizWords() {
    const length = Object.keys(quizInfo[this.productName]).length;
    for (let i = 0; i < length; i++) {
      this.rndWordList.push(i);
    }
    this.rndWordList = Util.shuffleArray(this.rndWordList);
  }

  // 맞춰야 할 문제를 생성한다.
  takeQuiz(click = true) {
    const quizStr =
      quizInfo[this.productName][this.rndWordList[this.currentQuiz]].word;
    const quizImg =
      quizInfo[this.productName][this.rndWordList[this.currentQuiz]].image;
    this.imgaBorad.makeWordImg(this.productName, quizImg);
    this.wordBoard.makeWord(quizStr, this.maxPhase);
    this.pickPuzzleBoard.makePickPuzzle(
      this.wordBoard.getPuzzle(
        this.wordBoard.getBrokenPuzzleIndex(this.currentPhase)
      ).alphabet
    );
    //this.mProgress.createStar();
    this.pickPuzzleBoard.isClick = click;
  }

  // 아래 퍼즐을 클릭하면 정답, 오답을 판단해서 분기를 태운다.
  addEventOnPuzzleClick() {
    this.pickPuzzleBoard.onPuzzleClick = (pz: AlphabetAsset) => {
      this.pickPuzzleBoard.isClick = false;
      this.speakerBtn.interactive = false;
      const brokenPzIndex = this.wordBoard.getBrokenPuzzleIndex(
        this.currentPhase
      );
      const posX =
        this.wordBoard.getPuzzleXpos(brokenPzIndex) + this.wordContainer.x;
      const posY = this.wordBoard.getPuzzleYpos() + this.wordContainer.y;
      //console.log(pz.x);
      gsap
        .to(pz, {
          x: posX,
          y: posY,
          ease: "expo.out",
          duration: 1,
        })
        .eventCallback("onComplete", () => {
          const borderAlphabet = this.wordBoard.getPuzzle(brokenPzIndex)
            .alphabet;
          const pickAlphabet = pz.alphabet;

          if (borderAlphabet === pickAlphabet) {
            // console.log("정답");
            this.currentPhase++;
            this.wordBoard.pickAnswer(this.currentPhase);
            this.pickPuzzleBoard.pickAnswer(pz);
            this.checkNextQuiz();
          } else {
            // console.log("오답");
            this.pickPuzzleBoard.pickWrongAnswer(pz);
            this.pickPuzzleBoard.isClick = true;
            this.speakerBtn.interactive = true;
          }
        });
    };
  }

  // 정답인 경우 다음 문제로 넘어가야 할지, 단어를 더 맞춰야 할지 판단해서 분기를 태운다.
  checkNextQuiz() {
    if (this.currentPhase == this.maxPhase) {
      this.onPlayWordSound();
      this.wordBoard.playEmphasizeAnimation();
      this.currentQuiz++;
      this.mProgress.nextStar();
      if (this.currentQuiz != this.maxQuiz) {
        //console.log("다음 문제로");
        // 다음 퀴즈로 넘어가기 전에 공부한 단어 강조효과가 있으면 더 좋을듯.
        gsap.delayedCall(2, () => {
          //  딜레이 후 다음 퀴즈 진행
          this.currentPhase = 0;
          this.takeQuiz();
        });
      } else {
        // console.log("모든 문제 완료");
        gsap.delayedCall(2, () => {
          this.onEnd();
        });
      }
    } else {
      // 아직 문제 남음.
      this.pickPuzzleBoard.makePickPuzzle(
        this.wordBoard.getPuzzle(
          this.wordBoard.getBrokenPuzzleIndex(this.currentPhase)
        ).alphabet
      );
      this.pickPuzzleBoard.isClick = true;
      this.speakerBtn.interactive = true;
    }
  }

  // 해당 함수가 호출되면 상단 스피커 버튼과 아래 퍼즐의 클릭이 가능해 진다.
  // wordBoard의 맞춰야 하는 퍼즐 조각이 떨어지는 애니메이션이 끝나면 호출된다.
  allButtonIsReady() {
    this.speakerBtn.interactive = true;
    this.pickPuzzleBoard.isClick = true;
    this.onPlayWordSound();
  }

  // 단어를 읽어주는 사운드
  onPlayWordSound(index: number = this.currentQuiz) {
    //console.log ("onPlayWordSound");
    const word = quizInfo[this.productName][this.rndWordList[index]].sound;
    this.wordSnd = ResourceManager.Handle.getProductResource(
      this.productName,
      word
    ).sound;
    this.wordSnd.stop();
    this.wordSnd.play();
  }
}
