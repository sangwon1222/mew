import Config from "@/Mew/Config";
import { ResourceManager } from "@/Mew/Core/ResourceManager";
import { Splash } from "./Splash";
import gsap from "gsap";
import { App } from "@/Mew/Core/App";
import { SceneBase } from "@/Mew/Core/SceneBase";

const readyPOP = {
  ReadTheLyrics: "가사를 따라 읽어 보아요",
  WordsToKnow: "가사의 단어를 알아 보아요",
  SpellTheWord: "단어에 맞는 철자를 찾아 보아요",
  WordsPlay: "단어의 뜻에 알맞은 그림을 고르세요",
  MyOwnStage: "스티커를 사용하여 나만의 그림을 꾸며 보아요",
  WordsGame: "철자를 맞춰서 단어를 완성해 보아요",
  ListeningGame: "알맞은 단어를 모두 골라서 문장을 완성해 보아요.",
  PlayTheBeat: "비트에 맞춰서 버튼을 눌러주세요",
  Pigment: "예쁘게 색칠해서 그림을 완성해 보아요",
};
// for( const[k,v] of Object.entries(re) ){}

const style = new PIXI.TextStyle({
  fontFamily: "BPreplay",
  fontSize: 48,
  // fontStyle: 'italic',
  fontWeight: "bold",
  fill: "0x0000",
  dropShadow: true,
  wordWrap: true,
  wordWrapWidth: 600,
});

export class HowTo extends PIXI.Container {
  private mDimmed: PIXI.Graphics;
  private mHowToSplash: Splash;

  constructor() {
    super();
    // console.warn(`APP 현재 스텝 ${App.Handle.currentSceneIDX}`)
    this.mDimmed = new PIXI.Graphics();
    this.mDimmed.beginFill(0x0000, 0.6);
    this.mDimmed.drawRect(0, 0, Config.app.width, Config.app.height);
    this.mDimmed.endFill();
    this.addChild(this.mDimmed);
    this.mDimmed.interactive = true;
    this.mDimmed.on("pointertap", () => {
      /**하우투 시간에 클릭을 막아준다 */
    });

    this.mHowToSplash = new Splash(
      ResourceManager.Handle.getCommonResource(`common_ready.json`).spineData,
      `ready`
    );
    if (this.mHowToSplash != undefined) {
      // this.mHowToSplash.scale.set( Config.app.videoScale )
      this.mHowToSplash.position.set(
        Config.app.width / 2,
        Config.app.height * 0.55
      );
      this.addChild(this.mHowToSplash);
    }
  }

  async howTo() {
    const textBox = new PIXI.spine.Spine(
      ResourceManager.Handle.getCommonResource(`common_textbox.json`).spineData
    );
    textBox.scale.set(0.67);
    textBox.position.set(Config.app.width / 2, Config.app.height * 0.65);

    const sound = ResourceManager.Handle.getViewerResource(`snd_ready.mp3`)
      .sound;
    gsap.delayedCall(1, () => {
      this.addChild(textBox);

      let guideText = "";
      for (const [k, v] of Object.entries(readyPOP)) {
        if ((this.parent as SceneBase).gamename == k) {
          guideText = v;
          break;
        }
      }
      // console.log(`${(this.parent as SceneBase).gamename}=>%c ${guideText}` ,"font-weight:bold; color:blue;")
      const text = new PIXI.Text(
        /*readyPOP[App.Handle.currentSceneIDX]*/ guideText,
        style
      );
      text.scale.y = -1;
      text.anchor.set(0.5, 0.5);
      text.position.set(0, -180);
      text.zIndex = 100;

      textBox.state.setAnimation(0, `in`, false);
      textBox.slotContainers[
        textBox.skeleton.findSlotIndex("t_hello")
      ].removeChildren();
      textBox.slotContainers[
        textBox.skeleton.findSlotIndex("t_hello")
      ].addChild(text);
      textBox.slotContainers[
        textBox.skeleton.findSlotIndex("t_hello")
      ].sortableChildren = true;

      sound.play();

      gsap.delayedCall(sound.duration, () => {
        textBox.state.setAnimation(0, `out`, false);
      });
    });
    await this.mHowToSplash.start(sound.duration + 1.2);
  }
}
