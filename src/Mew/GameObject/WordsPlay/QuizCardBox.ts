import { ResourceManager } from "@/Mew/Core/ResourceManager";
import { Button } from "../Common/Button";
import { Card } from "./Card";
import { WordsPlay } from "@/Mew/scenes/WordsPlay";
import * as Util from "../../Core/Util";
import gsap from "gsap";

export class QuizCardBox extends PIXI.Container {
  private mCardArray: Array<Card>;

  constructor() {
    super();

    this.mCardArray = [];
    const a = [0, 1, 2];
    const random = Util.shuffleArray(a);
    let offSetX = 0;
    for (let i = 0; i < 3; i++) {
      const quizCard = new Card(
        ResourceManager.Handle.getViewerResource(
          `wordsplay_card_normal.png`
        ).texture,
        ResourceManager.Handle.getViewerResource(
          `wordsplay_card_down.png`
        ).texture,
        ResourceManager.Handle.getViewerResource(
          `wordsplay_card_over.png`
        ).texture,
        i / 2,
        random[i]
      );
      this.mCardArray.push(quizCard);
      quizCard.x = offSetX;
      offSetX += quizCard.width * 1.01;
      this.addChild(quizCard);
    }

    for (let i = 0; i < 3; i++) {
      this.mCardArray[i].onClick = async () => {

        if (WordsPlay.Handle.correctOrWrong(this.mCardArray[i].idx)) {
          WordsPlay.Handle.correct();
          await this.mCardArray[i].correctMotion();
        } else {
          WordsPlay.Handle.wrong();
          await this.mCardArray[i].wrongMotion();
        }
      };
    }

    this.pivot.set(
      this.width / 2 - this.mCardArray[0].width / 2,
      this.height / 2
    );
    // Util.lineGuide(this)
  }

  nextQuiz() {
    for (let i = 0; i < 3; i++) {
      gsap.delayedCall(i / 3, () => {
        this.mCardArray[i].nextQuiz();
      });
    }
  }

  waitInterActive(): Promise<void> {
    return new Promise<void>(reoslve => {
      
      for (let i = 0; i < 3; i++) {
        this.mCardArray[i].interactive = false;
      }
      reoslve()
    })
  }

  startInterActive(): Promise<void> {
    return new Promise<void>(reoslve => {
    for (let i = 0; i < 3; i++) {
      this.mCardArray[i].interactive = true;
      this.mCardArray[i].buttonMode = true;
      }
      reoslve()
    })
  }
}
