import { SceneBase } from "../Core/SceneBase";
import PIXISound from "pixi-sound";
import { ResourceManager } from "../Core/ResourceManager";
import gsap from "gsap";
import Config from "../Config";
import { Header } from "../GameObject/Common/Header";
import { Progress } from "../GameObject/Common/Progress";
import { Splash } from "../GameObject/Common/Splash";
import { HowTo } from "../GameObject/Common/HowTo";
import { Mew, MewState } from "../GameObject/ListeningGame/Mew";
import { QuizBox } from "../GameObject/ListeningGame/QuizBox";
import { StoneGroup, Stone } from "../GameObject/ListeningGame/StoneGroup";
import * as Util from "../Core/Util";
import { Outro } from "../GameObject/Common/Outro";
import { Home } from "./Home";
import { ListeningViewerData } from "../Resource/ViewerResource/ListeningGame";
import * as ListeningProductData from "../Resource/ProductResource/ListeningGame";

const quizData = {
  b1: [
    {
      text: "Twinkle, _, little star",
      idx: "1",
      answer: "twinkle",
      wrong1: "high",
      wrong2: "above",
    },
    {
      text: "Like a _ in the sky",
      idx: "2",
      answer: "diamond",
      wrong1: "star",
      wrong2: "moon",
    },
    {
      text: "Up above the _ so high",
      idx: "3",
      answer: "world",
      wrong1: "star",
      wrong2: "diamond",
    },
    {
      text: "Like a diamond in the _",
      idx: "4",
      answer: "sky",
      wrong1: "little",
      wrong2: "world",
    },
    {
      text: "Twinkle, twinkle, little _",
      idx: "5",
      answer: "star",
      wrong1: "world",
      wrong2: "sky",
    },
    {
      text: "There's a _ in the sky",
      idx: "6",
      answer: "star",
      wrong1: "moon",
      wrong2: "cloud",
    },
    {
      text: "There's a _ in the sky",
      idx: "7",
      answer: "moon",
      wrong1: "cloud",
      wrong2: "bird",
    },
    {
      text: "There's a _ in the sky",
      idx: "8",
      answer: "cloud",
      wrong1: "star",
      wrong2: "bird",
    },
    {
      text: "There's a _ in the sky",
      idx: "9",
      answer: "bird",
      wrong1: "moon",
      wrong2: "cloud",
    },
  ],
  b2: [
    {
      text: "Sat in the _",
      idx: "1",
      answer: "corner",
      wrong1: "pie",
      wrong2: "plum",
    },
    {
      text: "Eating his Christmas _",
      idx: "2",
      answer: "pie",
      wrong1: "thumb",
      wrong2: "corner",
    },
    {
      text: "He put in his _",
      idx: "3",
      answer: "thumb",
      wrong1: "put",
      wrong2: "out",
    },
    {
      text: "And pulled out a _",
      idx: "4",
      answer: "plum",
      wrong1: "thumb",
      wrong2: "pie",
    },
    {
      text: `And said, "What a good _ am I!"`,
      idx: "5",
      answer: "boy",
      wrong1: "pie",
      wrong2: "corner",
    },
    {
      text: "I pull out the _",
      idx: "6",
      answer: "plum",
      wrong1: "apple",
      wrong2: "banana",
    },
    {
      text: "I pull out the _",
      idx: "7",
      answer: "apple",
      wrong1: "banana",
      wrong2: "orange",
    },
    {
      text: "I pull out the _",
      idx: "8",
      answer: "banana",
      wrong1: "orange",
      wrong2: "plum",
    },
    {
      text: "I pull out the _",
      idx: "9",
      answer: "orange",
      wrong1: "plum",
      wrong2: "apple",
    },
  ],
  b3: [
    {
      text: "_, dickory, dock",
      idx: "1",
      answer: "Hickory",
      wrong1: "Dickory",
      wrong2: "Dock",
    },
    {
      text: "The _ ran up the clock",
      idx: "2",
      answer: "mouse",
      wrong1: "clock",
      wrong2: "down",
    },
    {
      text: "The _ struck one",
      idx: "3",
      answer: "clock",
      wrong1: "mouse",
      wrong2: "one",
    },
    {
      text: "The mouse ran _",
      idx: "4",
      answer: "down",
      wrong1: "up",
      wrong2: "one",
    },
    {
      text: "Hickory, dickory, _",
      idx: "5",
      answer: "dock",
      wrong1: "hickory",
      wrong2: "dickory",
    },
    {
      text: "The clock struck _",
      idx: "6",
      answer: "two",
      wrong1: "three",
      wrong2: "four",
    },
    {
      text: "The clock struck _",
      idx: "7",
      answer: "three",
      wrong1: "four",
      wrong2: "five",
    },
    {
      text: "The clock struck _",
      idx: "8",
      answer: "four",
      wrong1: "five",
      wrong2: "one",
    },
    {
      text: "The clock struck _",
      idx: "9",
      answer: "five",
      wrong1: "one",
      wrong2: "two",
    },
    {
      text: "The mouse ran _ the clock",
      idx: "10",
      answer: "up",
      wrong1: "down",
      wrong2: "mouse",
    },
  ],
  b4: [
    {
      text: "The cat and the _",
      idx: "1",
      answer: "fiddle",
      wrong1: "dog",
      wrong2: "cow",
    },
    {
      text: "the cow jumped over the _",
      idx: "2",
      answer: "moon",
      wrong1: "dish",
      wrong2: "spoon",
    },
    {
      text: "The little _ laughed",
      idx: "3",
      answer: "dog",
      wrong1: "cat",
      wrong2: "cow",
    },
    {
      text: "to see such _",
      idx: "4",
      answer: "sport",
      wrong1: "dish",
      wrong2: "jump",
    },
    {
      text: "and the _ ran a way with the spoon",
      idx: "5",
      answer: "dish",
      wrong1: "sprot",
      wrong2: "moon",
    },
    {
      text: "The _ jumped over the moon",
      idx: "6",
      answer: "cat",
      wrong1: "dog",
      wrong2: "lion",
    },
    {
      text: "The _ jumped over the moon",
      idx: "7",
      answer: "dog",
      wrong1: "cat",
      wrong2: "pig",
    },
    {
      text: "The _ jumped over the moon",
      idx: "8",
      answer: "lion",
      wrong1: "dog",
      wrong2: "pig",
    },
    {
      text: "The _ jumped over the moon",
      idx: "9",
      answer: "pig",
      wrong1: "cat",
      wrong2: "lion",
    },
    {
      text: "and the dish ran a way with the _",
      idx: "10",
      answer: "spoon",
      wrong1: "dish",
      wrong2: "moon",
    },
  ],
  b5: [
    {
      text: "Dashing through the _",
      idx: "1",
      answer: "snow",
      wrong1: "horse",
      wrong2: "fields",
    },
    {
      text: "Bells on bob _ ring",
      idx: "2",
      answer: "tails",
      wrong1: "song",
      wrong2: "snow",
    },
    {
      text: "Over _ we go",
      idx: "3",
      answer: "fields",
      wrong1: "ring",
      wrong2: "snow",
    },
    {
      text: "A sleighing _ tonight",
      idx: "4",
      answer: "song",
      wrong1: "ring",
      wrong2: "snow",
    },
    {
      text: "_ all the way",
      idx: "5",
      answer: "Jingle",
      wrong1: "Tail",
      wrong2: "Song",
    },
    {
      text: "It is fun to ride a _",
      idx: "6",
      answer: "sleigh",
      wrong1: "snow",
      wrong2: "bell",
    },
    {
      text: "It is fun to see the _",
      idx: "7",
      answer: "snow",
      wrong1: "bell",
      wrong2: "song",
    },
    {
      text: "It is fun to ring a _",
      idx: "8",
      answer: "bell",
      wrong1: "song",
      wrong2: "sleigh",
    },
    {
      text: "It is fun to sing a _",
      idx: "9",
      answer: "song",
      wrong1: "sleigh",
      wrong2: "snow",
    },
  ],
  b6: [
    {
      text: "_ finger Daddy finger",
      idx: "1",
      answer: "Daddy",
      wrong1: "Mommy",
      wrong2: "Brother",
    },
    {
      text: "_ finger Mommy finger ",
      idx: "2",
      answer: "Mommy",
      wrong1: "Brother",
      wrong2: "Sister",
    },
    {
      text: "_ finger Brother finger",
      idx: "3",
      answer: "Brother",
      wrong1: "Sister",
      wrong2: "Baby",
    },
    {
      text: "_ finger Sister finger ",
      idx: "4",
      answer: "Sister",
      wrong1: "Daddy",
      wrong2: "Mommy",
    },
    {
      text: "_ finger Baby finger",
      idx: "5",
      answer: "Baby",
      wrong1: "Brother",
      wrong2: "Sister",
    },
    {
      text: "Daddy _ Daddy finger",
      idx: "6",
      answer: "finger",
      wrong1: "Brother",
      wrong2: "Baby",
    },
  ],
  b7: [
    {
      text: "If you're _",
      idx: "1",
      answer: "happy",
      wrong1: "angry",
      wrong2: "scared",
    },
    {
      text: "If you're _",
      idx: "2",
      answer: "angry",
      wrong1: "scared",
      wrong2: "happy",
    },
    {
      text: "_ your hands",
      idx: "3",
      answer: "Clap",
      wrong1: "Stomp",
      wrong2: "Say",
    },
    {
      text: "_ your feet",
      idx: "4",
      answer: "Stomp",
      wrong1: "Clap",
      wrong2: "Say",
    },
    {
      text: "If you're _",
      idx: "5",
      answer: "scared",
      wrong1: "angry",
      wrong2: "happy",
    },
    {
      text: `_, "Oh no!" `,
      idx: "6",
      answer: "Say",
      wrong1: "Stomp",
      wrong2: "Clap",
    },
    {
      text: "If you're _",
      idx: "7",
      answer: "sleepy",
      wrong1: "scared",
      wrong2: "happy",
    },
    {
      text: "_ a nap",
      idx: "8",
      answer: "Take",
      wrong1: "Say",
      wrong2: "Clap",
    },
    {
      text: "If you're _",
      idx: "9",
      answer: "sad",
      wrong1: "sleepy",
      wrong2: "scared",
    },
    {
      text: "_ with me",
      idx: "10",
      answer: "Dance",
      wrong1: "Clap",
      wrong2: "Stomp",
    },
  ],
  b8: [
    {
      text: "This is the _",
      idx: "1",
      answer: "way",
      wrong1: "mornig",
      wrong2: "wash",
    },
    {
      text: "We _ our face",
      idx: "2",
      answer: "wash",
      wrong1: "dressed",
      wrong2: "school",
    },
    {
      text: "Early in the _",
      idx: "3",
      answer: "morning",
      wrong1: "hair",
      wrong2: "teeth",
    },
    {
      text: "We comb our _",
      idx: "4",
      answer: "hair",
      wrong1: "teeth",
      wrong2: "dressed",
    },
    {
      text: "We brush our _",
      idx: "5",
      answer: "teeth",
      wrong1: "hair",
      wrong2: "face",
    },
    {
      text: "We get _",
      idx: "6",
      answer: "dressed",
      wrong1: "school",
      wrong2: "teeth",
    },
    {
      text: "We go to _",
      idx: "7",
      answer: "school",
      wrong1: "teeth",
      wrong2: "dressed",
    },
    {
      text: "We wash our _",
      idx: "8",
      answer: "face",
      wrong1: "hair",
      wrong2: "teeth",
    },
    {
      text: "_ in the morning",
      idx: "9",
      answer: "Early",
      wrong1: "Wash",
      wrong2: "Comb",
    },
  ],
  b9: [
    {
      text: "Old Macdonald had a _",
      idx: "1",
      answer: "farm",
      wrong1: "horse",
      wrong2: "sheep",
    },
    {
      text: "And on that farm he had a _",
      idx: "2",
      answer: "pig",
      wrong1: "cow",
      wrong2: "farm",
    },
    {
      text: "With an oink oink _",
      idx: "3",
      answer: "here",
      wrong1: "there",
      wrong2: "everywhere",
    },
    {
      text: "And an oink oink _",
      idx: "4",
      answer: "there",
      wrong1: "here",
      wrong2: "everywhere",
    },
    {
      text: "_ an oink oink",
      idx: "5",
      answer: "Everywhere",
      wrong1: "There",
      wrong2: "Here",
    },
    {
      text: "Old MacDonald had a _",
      idx: "6",
      answer: "horse",
      wrong1: "cow",
      wrong2: "farm",
    },
    {
      text: "Old MacDonald had a _",
      idx: "7",
      answer: "sheep",
      wrong1: "duck",
      wrong2: "cow",
    },
    {
      text: "Old MacDonald had a _",
      idx: "8",
      answer: "duck",
      wrong1: "sheep",
      wrong2: "cow",
    },
    {
      text: "Old MacDonald had a _",
      idx: "9",
      answer: "cow",
      wrong1: "horse",
      wrong2: "sheep",
    },
  ],
  b10: [
    {
      text: "The _ on the bus ",
      idx: "1",
      answer: "wheels",
      wrong1: "door",
      wrong2: "wipers",
    },
    {
      text: "The _ on the bus ",
      idx: "2",
      answer: "door",
      wrong1: "wipers",
      wrong2: "wheels",
    },
    {
      text: "The _ on the bus ",
      idx: "3",
      answer: "wipers",
      wrong1: "door",
      wrong2: "wheels",
    },
    {
      text: "The horn on the _ ",
      idx: "4",
      answer: "bus",
      wrong1: "door",
      wrong2: "wipers",
    },
    {
      text: " Round and _",
      idx: "5",
      answer: "round",
      wrong1: "open",
      wrong2: "shut",
    },
    {
      text: "_ and shut",
      idx: "6",
      answer: "Open",
      wrong1: "Round",
      wrong2: "Wheels",
    },
  ],
};

export class ListeningGame extends SceneBase {
  private mCurrentStep: number;
  private mProgress: Progress;

  private mMew: Mew;
  private mQuizBox: QuizBox;
  private mStone: StoneGroup;
  private mQuizData: any;

  get currentStep(): number {
    return this.mCurrentStep;
  }
  get quizData(): any {
    return this.mQuizData;
  }

  get answer(): string {
    return quizData[this.productName][0].answer;
  }

  get mew(): Mew {
    return this.mMew;
  }
  get quizbox(): QuizBox {
    return this.mQuizBox;
  }
  get stone(): StoneGroup {
    return this.mStone;
  }

  static _handle: ListeningGame;
  static get Handle(): ListeningGame {
    return ListeningGame._handle;
  }

  constructor() {
    super(`ListeningGame`);
  }
  async onInit() {
    this.productName = Home.Handle.productName;
    // this.productName = 'b1'

    ListeningGame._handle = this;

    await this.loadViewerResource(ListeningViewerData);
    await this.loadProductResource(ListeningProductData[this.productName]);
  }

  async onStart() {
    PIXISound.stopAll();
    this.mCurrentStep = 0;
    this.mQuizData = Util.shuffleArray(quizData[this.productName]);

    const BGM = ResourceManager.Handle.getViewerResource(`snd_bgm.mp3`).sound;
    BGM.play({ loop: true });

    const BG = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`img_bg.png`).texture
    );
    this.addChild(BG);

    const river = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`img_bg_river.png`).texture
    );
    river.position.set(Config.app.width, Config.app.height * 0.5);
    gsap.to(river, { x: -river.width, duration: 50 }).repeat(-1);
    BG.addChild(river);

    const animal1 = new Splash(
      ResourceManager.Handle.getViewerResource(`common_otter.json`).spineData,
      `otter_swim`,
      true
    );
    animal1.position.set(Config.app.width * 0.1, Config.app.height * 0.55);
    animal1.start();

    const animal2 = new Splash(
      ResourceManager.Handle.getViewerResource(`common_turtle.json`).spineData,
      `tutle_swim`,
      true
    );
    animal2.position.set(Config.app.width * 0.8, Config.app.height * 0.75);
    animal2.start();

    const charactor1 = new Splash(
      ResourceManager.Handle.getViewerResource(`bob.json`).spineData,
      `bob_de`,
      true
    );
    charactor1.position.set(
      Config.app.width * 0.6 + charactor1.width,
      Config.app.height * 0.35
    );
    charactor1.start();

    const charactor2 = new Splash(
      ResourceManager.Handle.getViewerResource(`pho.json`).spineData,
      `defalt`,
      true
    );
    charactor2.position.set(
      Config.app.width * 0.6 + charactor2.width * 2,
      Config.app.height * 0.35
    );
    charactor2.start();

    BG.addChild(animal1, animal2, charactor1, charactor2);

    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource(`img_title.png`).texture
    );
    title.y = 10;
    this.addChild(title);

    this.mProgress = new Progress(5);
    this.mProgress.position.set(
      Config.app.width / 2,
      Config.app.height - this.mProgress.height
    );
    this.addChild(this.mProgress);

    this.mQuizBox = new QuizBox();
    this.mQuizBox.position.set(Config.app.width / 2, this.mQuizBox.height / 2);
    this.addChild(this.mQuizBox);

    this.mStone = new StoneGroup();
    this.mStone.position.set(Config.app.width / 2, Config.app.height * 0.65);
    this.addChild(this.mStone);

    this.mMew = new Mew();
    this.addChild(this.mMew);

    const header = new Header();
    this.addChild(header);

    /**HOWTO */
    const howTo = new HowTo();
    this.addChild(howTo);
    await howTo.howTo();
    this.removeChild(howTo);

    await this.mQuizBox.onSound();
    this.mStone.stoneFlag(true);
  }

  async onNextQuiz() {
    await this.mQuizBox.correct();
    await this.mMew.Pass();

    this.mMew.mewState = MewState.success;
    this.mProgress.nextStar();

    if (this.mCurrentStep == 4) {
      this.onEnd();
    } else {
      gsap.delayedCall(2, async () => {
        this.mQuizData.splice(0, 1);
        Util.shuffleArray(this.mQuizData);
        this.mCurrentStep += 1;
        this.mQuizBox.resetQuiz();
        this.mMew.resetMew();
        this.mStone.resetStone();
        await this.mQuizBox.onSound();
        this.mStone.stoneFlag(true);
      });
    }

    // console.log(this.mCurrentStep);
  }

  async onEnd() {
    PIXISound.stopAll();
    /**OUTRO */
    const outro = new Outro();
    this.addChild(outro);
    await outro.outro();
  }
}
