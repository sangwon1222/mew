import Vue from "vue";
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";
import Axios from "axios";
import Util from "../Util";
import { completeBookID as CompleteData, API } from "./Define";
import Alert from "sweetalert2";
import DefaultData from "./DefaultData";

@Module({
  namespaced: true,
  name: "activity",
  dynamic: true,
  store,
})
class Activity extends VuexModule {
  private mCurrentBookID: string;
  // get finishData(): CompleteData.FinishBookID {return this.mFinishID}

  get currentBookID(): string {
    if (this.mCurrentBookID == null) {
      return "b1";
    }
  }
  @Mutation private SET_FINISH_DATA(data: string) {
    this.mCurrentBookID = data;
  }
  @Action async getFinishIDdata(data: string) {
    this.SET_FINISH_DATA(data);
  }
}

export const ActivityModule = getModule(Activity);
