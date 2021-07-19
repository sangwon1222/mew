import { SceneBase } from "../Core/SceneBase";
import { Header } from "../GameObject/Common/Header";
import { HowTo } from "../GameObject/Common/HowTo";
import { Outro } from "../GameObject/Common/Outro";
import { ResourceManager } from "../Core/ResourceManager";
import Config from "../Config";
import { App } from "../Core/App";
import PIXISound from "pixi-sound";
import { NoteCharacter } from "../GameObject/PlayTheBeat/NoteCharacter";
import { TrackButton } from "../GameObject/PlayTheBeat/TrackButton";
import { TrackAsset } from "../GameObject/PlayTheBeat/TrackAsset";
import { PlayTheBeatViewerData } from "../Resource/ViewerResource/PlayTheBeat";
import * as PlayTheBeatProductData from "../Resource/ProductResource/PlayTheBeat";
import gsap from "gsap";
import { Home } from "./Home";

const noteData = {
  b1: {
    bpm: 120,
    playData: [
      { time: 5.7 },
      { time: 7 },
      { time: 8.3 },
      { time: 9.6 },
      { time: 10.9 },
      { time: 12.1 },
      { time: 14.2 },
      { time: 15.4 },
      { time: 16.8 },
      { time: 18.7 },
      { time: 20 },
      { time: 21.3 },
      { time: 22.6 },
      { time: 24.6 },
      { time: 25.9 },
      { time: 27.2 },
      {
        time: 29.2,
      },
      {
        time: 30.4,
      },
      {
        time: 31.7,
      },
      {
        time: 32.8,
      },
      {
        time: 35,
      },
      {
        time: 36.3,
      },
      {
        time: 37.5,
      },
      {
        time: 41.9,
      },
      {
        time: 44.2,
      },
      {
        time: 47.4,
      },
      {
        time: 52,
      },
      {
        time: 55.4,
      },
      {
        time: 59.8,
      },
      {
        time: 63.1,
      },
      {
        time: 65.7,
      },
      {
        time: 68.3,
      },
      {
        time: 69.6,
      },
      {
        time: 70.9,
      },
      {
        time: 72.2,
      },
      {
        time: 74.2,
      },
      {
        time: 75.4,
      },
      {
        time: 76.8,
      },
      {
        time: 78.7,
      },
      {
        time: 80,
      },
      {
        time: 81.3,
      },
      {
        time: 82.6,
      },
      {
        time: 84.6,
      },
      {
        time: 85.8,
      },
      {
        time: 87.1,
      },
      {
        time: 89.1,
      },
      {
        time: 90.4,
      },
      {
        time: 91.8,
      },
      {
        time: 93,
      },
      {
        time: 95,
      },
      {
        time: 96.3,
      },
      {
        time: 97.6,
      },
      {
        time: 99.6,
      },
      {
        time: 100.9,
      },
      {
        time: 102.2,
      },
      {
        time: 105.1,
      },
    ],
  },
  b2: {
    bpm: 120,
    playData: [
      { time: 4.4 },
      { time: 6.1 },
      { time: 7.5 },
      { time: 9.2 },
      { time: 10.2 },
      { time: 11.5 },
      { time: 12.6 },
      { time: 13.6 },
      { time: 14.6 },
      { time: 15.7 },
      { time: 17 },
      { time: 18.4 },
      { time: 19.7 },
      { time: 21.1 },
      { time: 22.5 },
      { time: 23.8 },
      { time: 24.9 },
      { time: 25.9 },
      { time: 26.9 },
      { time: 27.9 },
      { time: 29 },
      { time: 30 },
      { time: 31 },
      { time: 32 },
      { time: 33.1 },
      { time: 33.7 },
      { time: 34.8 },
      { time: 36.1 },
      { time: 37.1 },
      { time: 38.2 },
      { time: 39.2 },
      { time: 40.2 },
      { time: 41.6 },
      { time: 42.9 },
      { time: 44.2 },
      { time: 45.7 },
      { time: 47 },
      { time: 48.4 },
      { time: 49.4 },
      { time: 51.5 },
      { time: 53.6 },
    ],
  },
  b3: {
    bpm: 120,
    playData: [
      { time: 6.6 },
      { time: 7.8 },
      { time: 9.1 },
      { time: 10.3 },
      { time: 11.6 },
      { time: 13.2 },
      { time: 14.6 },
      { time: 16.5 },
      { time: 18.9 },
      { time: 21.4 },
      { time: 23.2 },
      { time: 24.4 },
      { time: 26.2 },
      { time: 27.9 },
      { time: 30.3 },
      { time: 32.8 },
      { time: 34.2 },
      { time: 37.3 },
      { time: 41 },
      { time: 42.6 },
      { time: 44 },
      { time: 45.9 },
      { time: 48.7 },
      { time: 51.2 },
      { time: 52.6 },
      { time: 53.8 },
      { time: 55 },
      { time: 56.8 },
      { time: 58.5 },
      { time: 59.3 },
      { time: 62.2 },
      { time: 63 },
      { time: 64.8 },
      { time: 66.1 },
      { time: 67.3 },
      { time: 68.5 },
      { time: 69.1 },
    ],
  },
  b4: {
    bpm: 120,
    playData: [
      { time: 4.7 },
      { time: 5.7 },
      { time: 6.7 },
      { time: 8.8 },
      { time: 10.2 },
      { time: 12.9 },
      { time: 13.9 },
      { time: 14.9 },
      { time: 15.9 },
      { time: 17 },
      { time: 18 },
      { time: 19 },
      { time: 21 },
      { time: 22 },
      { time: 23.1 },
      { time: 24.1 },
      { time: 25.1 },
      { time: 26.2 },
      { time: 27.2 },
      { time: 28.2 },
      { time: 30.2 },
      { time: 31.3 },
      { time: 32.9 },
      { time: 34 },
      { time: 35 },
      { time: 36 },
      { time: 37 },
      { time: 38 },
      { time: 39.1 },
      { time: 41.1 },
      { time: 42.5 },
      { time: 43.5 },
      { time: 45.2 },
      { time: 46.5 },
      { time: 47.6 },
      { time: 49.6 },
      { time: 50.6 },
      { time: 51.7 },
      { time: 52.7 },
      { time: 53.7 },
      { time: 54.7 },
      { time: 55.8 },
      { time: 57.8 },
      { time: 58.8 },
      { time: 59.8 },
      { time: 61.9 },
      { time: 62.9 },
      { time: 63.9 },
      { time: 64.9 },
      { time: 65.9 },
      { time: 67 },
      { time: 68 },
      { time: 69.7 },
      { time: 70.7 },
      { time: 71.8 },
      { time: 73.1 },
      { time: 74.1 },
      { time: 75.2 },
      { time: 76.2 },
      { time: 77.9 },
      { time: 78.9 },
      { time: 81.3 },
      { time: 82.3 },
      { time: 83.3 },
      { time: 84.4 },
      { time: 85.4 },
    ],
  },
  b5: {
    bpm: 120,
    playData: [
      { time: 5.1 },
      { time: 6.2 },
      { time: 7.4 },
      { time: 8.6 },
      { time: 9.7 },
      { time: 10.9 },
      { time: 12.3 },
      { time: 13.2 },
      { time: 14.3 },
      { time: 15.5 },
      { time: 16.6 },
      { time: 17.8 },
      { time: 19.5 },
      { time: 21.3 },
      { time: 22.4 },
      { time: 23.6 },
      { time: 24.1 },
      { time: 25.2 },
      { time: 26.5 },
      { time: 27.6 },
      { time: 28.7 },
      { time: 29.9 },
      { time: 31 },
      { time: 32.8 },
      { time: 33.9 },
      { time: 35.1 },
      { time: 36.2 },
      { time: 37.4 },
      { time: 38.6 },
      { time: 39.7 },
      { time: 40.9 },
      { time: 42 },
      { time: 43.2 },
      { time: 44.3 },
      { time: 46.1 },
      { time: 47.2 },
      { time: 48.4 },
      { time: 49.5 },
      { time: 51.3 },
      { time: 52.4 },
      { time: 53.6 },
      { time: 54.7 },
      { time: 55.9 },
      { time: 57 },
      { time: 58.2 },
      { time: 59.3 },
      { time: 60.5 },
      { time: 61.6 },
      { time: 62.8 },
      { time: 64 },
      { time: 65.1 },
      { time: 66.2 },
      { time: 67.4 },
      { time: 69 },
      { time: 70 },
      { time: 70.9 },
      { time: 72 },
      { time: 73.2 },
      { time: 74.3 },
      { time: 75.3 },
      { time: 76.6 },
      { time: 77.5 },
      { time: 78.3 },
      { time: 79.5 },
      { time: 80.7 },
      { time: 81.8 },
      { time: 82.7 },
      { time: 83.5 },
      { time: 84.7 },
      { time: 85.6 },
      { time: 86.7 },
      { time: 88.2 },
      { time: 89.3 },
      { time: 90.5 },
      { time: 91 },
      { time: 91.6 },
      { time: 92.2 },
      { time: 94 },
    ],
  },
  b6: {
    bpm: 120,
    playData: [
      { time: 4.7 },
      { time: 5.6 },
      { time: 6.5 },
      { time: 7.5 },
      { time: 8.5 },
      { time: 9.4 },
      { time: 10.3 },
      { time: 12.3 },
      { time: 13.2 },
      { time: 14.1 },
      { time: 15.1 },
      { time: 16 },
      { time: 17 },
      { time: 18 },
      { time: 18.9 },
      { time: 19.8 },
      { time: 20.8 },
      { time: 21.7 },
      { time: 22.7 },
      { time: 23.6 },
      { time: 24.5 },
      { time: 25.5 },
      { time: 26.4 },
      { time: 27.4 },
      { time: 28.3 },
      { time: 29.3 },
      { time: 30.2 },
      { time: 31.1 },
      { time: 32.1 },
      { time: 33 },
      { time: 34 },
      { time: 34.8 },
      { time: 35.9 },
      { time: 36.8 },
      { time: 37.8 },
      { time: 38.7 },
      { time: 39.7 },
      { time: 40.6 },
      { time: 41.5 },
      { time: 42.5 },
      { time: 43.4 },
      { time: 44.4 },
      { time: 45.3 },
      { time: 46.3 },
      { time: 47.2 },
      { time: 48.2 },
      { time: 49.1 },
      { time: 50.5 },
      { time: 51.3 },
      { time: 52.2 },
      { time: 52.7 },
      { time: 53.8 },
      { time: 55.2 },
      { time: 56.5 },
      { time: 58.1 },
      { time: 59.8 },
      { time: 61.4 },
      { time: 62.4 },
      { time: 63.3 },
      { time: 64.2 },
      { time: 65.2 },
      { time: 66.2 },
      { time: 67.1 },
      { time: 68 },
      { time: 69 },
      { time: 69.9 },
      { time: 70.8 },
      { time: 71.8 },
      { time: 72.7 },
      { time: 73.7 },
      { time: 74.6 },
      { time: 75.6 },
      { time: 76.5 },
      { time: 77.5 },
      { time: 78.4 },
      { time: 79.4 },
      { time: 80.3 },
      { time: 81.2 },
      { time: 82.2 },
      { time: 83.1 },
      { time: 83.9 },
      { time: 84.9 },
      { time: 86.1 },
      { time: 86.9 },
      { time: 87.8 },
      { time: 88.8 },
      { time: 89.8 },
      { time: 90.7 },
      { time: 91.6 },
      { time: 92.6 },
      { time: 93.5 },
      { time: 94.5 },
      { time: 95.4 },
      { time: 96.3 },
      { time: 97.3 },
      { time: 98.3 },
      { time: 100.2 },
      { time: 101.1 },
      { time: 102 },
      { time: 103 },
      { time: 103.9 },
      { time: 104.8 },
      { time: 105.8 },
      { time: 108.6 },
      { time: 109.6 },
      { time: 110.5 },
      { time: 111.5 },
      { time: 114.1 },
    ],
  },
  b7: {
    bpm: 120,
    playData: [
      { time: 4.6 },
      { time: 6 },
      { time: 7.7 },
      { time: 8.7 },
      { time: 10.6 },
      { time: 11.9 },
      { time: 12.4 },
      { time: 12.9 },
      { time: 14.8 },
      { time: 16 },
      { time: 16.5 },
      { time: 17 },
      { time: 18.9 },
      { time: 20.1 },
      { time: 21.2 },
      { time: 22.6 },
      { time: 23.2 },
      { time: 24.3 },
      { time: 24.8 },
      { time: 27.9 },
      { time: 29.4 },
      { time: 31.5 },
      { time: 32.5 },
      { time: 33.1 },
      { time: 33.6 },
      { time: 35.5 },
      { time: 36.7 },
      { time: 37.2 },
      { time: 37.7 },
      { time: 39.8 },
      { time: 40.8 },
      { time: 41.9 },
      { time: 43.8 },
      { time: 45 },
      { time: 45.5 },
      { time: 48.4 },
      { time: 50.1 },
      { time: 52.2 },
      { time: 53.2 },
      { time: 54.3 },
      { time: 56.2 },
      { time: 57.3 },
      { time: 58.4 },
      { time: 60.5 },
      { time: 61.4 },
      { time: 62.6 },
      { time: 64.5 },
      { time: 65.6 },
      { time: 69.3 },
      { time: 70.9 },
      { time: 72.9 },
      { time: 74.7 },
      { time: 75.1 },
      { time: 77.2 },
      { time: 78.3 },
      { time: 79.3 },
      { time: 81.5 },
      { time: 82.5 },
      { time: 83.6 },
      { time: 85.7 },
      { time: 87.3 },
      { time: 88.4 },
      { time: 90.4 },
      { time: 91.5 },
      { time: 92 },
      { time: 94.1 },
      { time: 95.1 },
      { time: 95.6 },
      { time: 96.1 },
      { time: 98.2 },
      { time: 99.3 },
      { time: 99.8 },
      { time: 100.3 },
      { time: 102.3 },
      { time: 103.4 },
      { time: 104.4 },
      { time: 106.5 },
      { time: 108.5 },
      { time: 110 },
      { time: 113.7 },
      { time: 114.3 },
      { time: 115.3 },
    ],
  },
  b8: {
    bpm: 120,
    playData: [
      { time: 1.4 },
      { time: 4.4 },
      { time: 5.6 },
      { time: 6.8 },
      { time: 9.2 },
      { time: 10.1 },
      { time: 11 },
      { time: 11.5 },
      { time: 12.2 },
      { time: 13.2 },
      { time: 14 },
      { time: 15 },
      { time: 16.4 },
      { time: 17.4 },
      { time: 18.8 },
      { time: 21.2 },
      { time: 21.8 },
      { time: 22.3 },
      { time: 22.9 },
      { time: 25.9 },
      { time: 26.5 },
      { time: 27.1 },
      { time: 29.6 },
      { time: 30.8 },
      { time: 32 },
      { time: 33.1 },
      { time: 34.2 },
      { time: 35.6 },
      { time: 36.8 },
      { time: 38 },
      { time: 39 },
      { time: 40.4 },
      { time: 41.6 },
      { time: 42.8 },
      { time: 44 },
      { time: 45.1 },
      { time: 45.8 },
      { time: 46.3 },
      { time: 46.9 },
      { time: 48.8 },
      { time: 49.9 },
      { time: 50.5 },
      { time: 51.2 },
      { time: 53.6 },
      { time: 54.8 },
      { time: 56 },
      { time: 57.2 },
      { time: 58.2 },
      { time: 59.6 },
      { time: 60.7 },
      { time: 62 },
      { time: 63.2 },
      { time: 64.4 },
      { time: 65.4 },
      { time: 66.8 },
      { time: 67.8 },
      { time: 69.1 },
      { time: 69.7 },
      { time: 70.4 },
      { time: 70.9 },
      { time: 72.5 },
      { time: 73.9 },
      { time: 74.6 },
      { time: 75.2 },
      { time: 78.8 },
      { time: 81.2 },
      { time: 82.2 },
      { time: 83.4 },
      { time: 84.8 },
      { time: 86 },
      { time: 87.2 },
      { time: 88.4 },
      { time: 89.6 },
      { time: 91.8 },
      { time: 93.2 },
      { time: 95 },
      { time: 96.6 },
      { time: 98 },
      { time: 100.4 },
      { time: 102.7 },
      { time: 105.1 },
      { time: 106.3 },
      { time: 107.5 },
      { time: 108.8 },
      { time: 110 },
      { time: 111 },
      { time: 112.4 },
      { time: 113.4 },
      { time: 114.8 },
      { time: 116 },
      { time: 117.2 },
      { time: 118.4 },
      { time: 119.6 },
    ],
  },
  b9: {
    bpm: 120,
    playData: [
      { time: 3.6 },
      { time: 6 },
      { time: 7.3 },
      { time: 8.5 },
      { time: 10.9 },
      { time: 12.2 },
      { time: 13.4 },
      { time: 15.9 },
      { time: 17.7 },
      { time: 18.9 },
      { time: 20.8 },
      { time: 22 },
      { time: 23.2 },
      { time: 25.7 },
      { time: 27.2 },
      { time: 28.7 },
      { time: 30.6 },
      { time: 31.8 },
      { time: 33 },
      { time: 35.3 },
      { time: 36.7 },
      { time: 37.9 },
      { time: 40.1 },
      { time: 41.5 },
      { time: 42.8 },
      { time: 44 },
      { time: 45.2 },
      { time: 46.5 },
      { time: 47.7 },
      { time: 50.2 },
      { time: 51.4 },
      { time: 52.6 },
      { time: 53.8 },
      { time: 55 },
      { time: 56.2 },
      { time: 57.5 },
      { time: 59.9 },
      { time: 61.2 },
      { time: 62.4 },
      { time: 64.5 },
      { time: 65.8 },
      { time: 67.3 },
      { time: 68.5 },
      { time: 69.7 },
      { time: 71 },
      { time: 72.2 },
      { time: 74.7 },
      { time: 76.2 },
      { time: 77.4 },
      { time: 79.6 },
      { time: 80.8 },
      { time: 82 },
      { time: 84.5 },
      { time: 85.7 },
      { time: 86.9 },
      { time: 89.3 },
      { time: 90.6 },
      { time: 91.8 },
      { time: 93 },
      { time: 94.2 },
      { time: 95.5 },
      { time: 96.7 },
      { time: 99.2 },
      { time: 100.3 },
      { time: 101.6 },
      { time: 102.8 },
      { time: 104 },
      { time: 105.3 },
      { time: 106.5 },
      { time: 108.9 },
      { time: 110.2 },
      { time: 111.4 },
      { time: 113.5 },
      { time: 114.9 },
      { time: 116.1 },
      { time: 117.5 },
      { time: 118.7 },
      { time: 119.9 },
      { time: 123.7 },
      { time: 125.2 },
      { time: 126.7 },
      { time: 128.5 },
      { time: 129.7 },
      { time: 131.1 },
      { time: 133.1 },
      { time: 134.7 },
      { time: 135.9 },
      { time: 138 },
      { time: 140.2 },
      { time: 142.1 },
      { time: 143.2 },
      { time: 144.4 },
      { time: 145.7 },
      { time: 148.1 },
      { time: 149.3 },
      { time: 150.5 },
      { time: 151.8 },
      { time: 153 },
      { time: 155.5 },
      { time: 157.3 },
    ],
  },
  b10: {
    bpm: 120,
    playData: [
      { time: 2.5 },
      { time: 5.4 },
      { time: 6.5 },
      { time: 7.6 },
      { time: 9.4 },
      { time: 10.5 },
      { time: 11.9 },
      { time: 13 },
      { time: 15.2 },
      { time: 16.6 },
      { time: 17.8 },
      { time: 18.9 },
      { time: 21 },
      { time: 23.6 },
      { time: 26.9 },
      { time: 29.4 },
      { time: 30.5 },
      { time: 32.6 },
      { time: 34.1 },
      { time: 35.2 },
      { time: 36.7 },
      { time: 38.5 },
      { time: 41.1 },
      { time: 42.3 },
      { time: 44.3 },
      { time: 46.5 },
      { time: 47.9 },
      { time: 49.9 },
      { time: 51.4 },
      { time: 52.7 },
      { time: 53.8 },
      { time: 55.8 },
      { time: 58.9 },
      { time: 61.4 },
      { time: 62.9 },
      { time: 64.3 },
      { time: 65.4 },
      { time: 67.6 },
      { time: 69 },
      { time: 70.1 },
      { time: 71.2 },
      { time: 73.4 },
      { time: 76.3 },
      { time: 78.1 },
      { time: 79.6 },
      { time: 81.8 },
      { time: 82.8 },
      { time: 85 },
      { time: 86.5 },
      { time: 87.6 },
      { time: 88.7 },
      { time: 90.8 },
      { time: 93.8 },
      { time: 96.3 },
      { time: 97.8 },
      { time: 99.2 },
      { time: 100.3 },
      { time: 102.5 },
      { time: 104 },
      { time: 105 },
      { time: 106 },
      { time: 108.3 },
      { time: 111.4 },
      { time: 114.6 },
      { time: 117.9 },
      { time: 119.3 },
      { time: 122.2 },
      { time: 124.1 },
      { time: 125.5 },
      { time: 126.9 },
      { time: 129.7 },
      { time: 130.7 },
      { time: 131.7 },
      { time: 133.5 },
    ],
  },
};

export class PlayTheBeat extends SceneBase {
  private mHeader: Header;

  private _song: PIXISound.Sound;
  private _currentSongTime: number; // 음악의 현재생 시간
  private _maxNoteData: number; // 현 ProductName 에서 사용하는 총 playData 개수 = 생성해야 하는 노트 개수
  private _bornNote: number; // 생성된 노트 개수

  private _buttonContainer: PIXI.Container;
  private _trackContainer: PIXI.Container;

  private _keyArray: Array<TrackButton>;
  private _trackArray: Array<TrackAsset>;
  private _noteArray: Array<NoteCharacter>;

  private _keyPress: Array<boolean>;

  private _isClick: boolean;

  constructor() {
    super(`PlayTheBeat`);
  }

  async onInit() {
    this.productName = Home.Handle.productName;
    PIXISound.stopAll();
    // const responseViewer = await this.getViewerJSON();
    await this.loadViewerResource(PlayTheBeatViewerData);
    // const responseProduct = await this.getProductJSON();
    await this.loadProductResource(PlayTheBeatProductData[this.productName]);
  }

  async onStart() {
    this._currentSongTime = 0;
    this._maxNoteData = Object.keys(
      noteData[this.productName]["playData"]
    ).length;
    this._bornNote = 0;

    this._keyArray = [];
    this._trackArray = [];
    this._noteArray = [];
    this._keyPress = [false, false, false, false];

    this._isClick = false;

    this.mHeader = new Header();

    this._buttonContainer = new PIXI.Container();
    this._trackContainer = new PIXI.Container();

    const bg = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource("bg.png").texture
    );
    bg.anchor.set(0.5, 0);
    bg.position.set(Config.app.width / 2, 0);
    this.addChild(bg);

    this.addChild(this._trackContainer);

    const tracLine = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource("track_line.png").texture
    );
    tracLine.anchor.set(0.5, 0);
    tracLine.position.set(Config.app.width / 2, 0);
    this.addChild(tracLine);

    this.addChild(this._buttonContainer);

    this.setButtonAndTrack();

    // document.addEventListener( "keydown", this.onKeyDown.bind(this), false);
    // document.addEventListener( "keyup", this.onKeyUp.bind(this), false);

    const title = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource("playthebeat_title.png").texture
    );
    title.position.set(0, 20);
    this.addChild(title);
    this.addChild(this.mHeader);

    /**HOWTO */
    const howTo = new HowTo();
    this.addChild(howTo);
    await howTo.howTo();
    this.removeChild(howTo);

    this.startSong();
  }

  async onEnd() {
    PIXISound.stopAll();
    /**OUTRO */
    const outro = new Outro();
    this.addChild(outro);
    await outro.outro();
  }

  // 호출이 되면 해당 productName의 음악이 재생된다. (게임 시작)
  // 음악이 재생되는 동안 Ticker 호출.
  startSong() {
    this._song = ResourceManager.Handle.getProductResource(
      this.productName,
      "song.mp3"
    ).sound;
    this._song.play({
      complete: () => {
        this.endGame();
        App.Handle.ticker.remove(this.onEnter, this);
      },
    });

    /*
        App.Handle.ticker.add((delta) => {
                this.onUpDate();
        })
        */
    this._isClick = true;
    App.Handle.ticker.add(this.onEnter, this);
  }

  // 음악이 끝나면 호출된다. (게임끝)
  endGame() {
    this._isClick = false;
    document.removeEventListener("keydown", this.onKeyDown.bind(this), false);
    document.removeEventListener("keyup", this.onKeyUp.bind(this), false);
    this.allKeyUp(); // 버튼 상태 모두 up으로.
    // console.log("sond end");
    this.onEnd();
  }

  // Ticker 로 호출되는 함수
  // 재생되는 음악의 progress와 노트 데이타의 time을 비교하여 노트캐릭터를 생성.
  // 동시 키 입력을 받기 위해서 키다운도 체크 (이벤트로만 키 감지시 동시 키 입력 불가능)
  onEnter() {
    if (this._song && this._song.isPlaying) {
      this._currentSongTime =
        this._song.instances[0].progress * this._song.duration;
      if (this._bornNote < this._maxNoteData) {
        const getNoteData =
          noteData[this.productName]["playData"][this._bornNote];
        const showTime = getNoteData.time - 3.77;

        if (this._currentSongTime >= showTime) {
          //노트 생성
          const rndTrack = Math.floor(Math.random() * 4);
          //const rndTrack = 0;
          const noteCharacter = new NoteCharacter(rndTrack);
          noteCharacter.noteInRange = () => {
            this.receiveNoteInRange(noteCharacter);
          };
          noteCharacter.noteOutRange = () => {
            this.receiveNoteOutRange(noteCharacter);
          };
          this.addChild(noteCharacter);
          this._bornNote++;
        }
      }

      if (this._keyPress[0]) this.setKeyDownAction(0);
      if (this._keyPress[1]) this.setKeyDownAction(1);
      if (this._keyPress[2]) this.setKeyDownAction(2);
      if (this._keyPress[3]) this.setKeyDownAction(3);
    }
  }

  // 버튼과 트랙을 생성한다.
  setButtonAndTrack() {
    for (let i = 0; i < 4; i++) {
      const track = new TrackAsset(i);
      this._trackArray.push(track);
      this._trackContainer.addChild(track);

      const btn = new TrackButton(i);
      this._keyArray.push(btn);
      this._buttonContainer.addChild(btn);

      //추가코드 수정자: 이상원
      // 키보드말고 터치했을때도 반응하게끔 수정
      btn.interactive = true;
      btn.buttonMode = true;
      btn.on("pointerdown", () => {
        this._keyPress[i] = true;
      });
      btn.on("pointerup", () => {
        this.setKeyUpAction(i);
      });
    }
  }

  // NoteCharacter.noteInRange()
  // 생성된 노트 캐릭터가 버튼 가까이 오면 배열에 넣어준다.
  // 범위 안에 있는 노트 캐릭터만 배열에 포함해서 for문 코스트 다운.
  receiveNoteInRange($note: NoteCharacter) {
    this._noteArray.push($note);
    //console.log(this._noteArray);
  }

  // NoteCharacter.noteOutRange()
  // 노트 캐릭터가 버튼 뒤로 지나가면 배열에서 제외.
  receiveNoteOutRange($note: NoteCharacter) {
    for (const noteCharacter of this._noteArray) {
      if (noteCharacter == $note) {
        // console.log("receiveNoteOutRange find");
        $note.removeNoteCharacter();
        this._noteArray.splice(this._noteArray.indexOf(noteCharacter), 1);
      }
    }
  }

  // 버튼을 눌렀을대 호출.
  // excellent / good / bad 를 판단.
  onPressGameKey($track: number) {
    //this.impossibleSameTimeKeyDown($track);
    for (const noteCharacter of this._noteArray) {
      if (noteCharacter.track == $track && noteCharacter.y < 700) {
        const dis = Math.abs(noteCharacter.y - 628); // 628은 버튼의 y값
        let imgStr: string;

        if (dis >= 0 && dis < 15) {
          imgStr = "excellent.png";
        } else if (dis >= 15 && dis < 50) {
          imgStr = "good.png";
        } else {
          imgStr = "bad.png";
        }

        this._noteArray.splice(this._noteArray.indexOf(noteCharacter), 1);

        const snd = ResourceManager.Handle.getViewerResource(
          (("marim0" + ($track + 1)) as string) + ".mp3"
        ).sound;
        snd.play();
        this._keyArray[$track].playEffect();
        this._trackArray[$track].onKeyCorrect();
        noteCharacter.removeNoteCharacter();

        this.drawTextEffect(imgStr, 160, 200);
        this.drawTextEffect(imgStr, 1120, 200);
        break;
      }
    }
  }

  //좌우에 나오는 Excellent, Good, Bad 효과
  drawTextEffect($imgStr: string, $x: number, $y: number) {
    const txtEf = new PIXI.Sprite(
      ResourceManager.Handle.getViewerResource($imgStr).texture
    );
    txtEf.anchor.set(0.5, 0.5);
    txtEf.scale.set(0.9, 0.9);
    txtEf.position.set($x, $y);
    this.addChild(txtEf);

    gsap.delayedCall(0.2, () => {
      gsap.to(txtEf.scale, {
        x: 1,
        y: 1,
        duration: 0.3,
      });

      gsap
        .to(txtEf, {
          y: txtEf.y - 30,
          alpha: 0,
          duration: 0.3,
        })
        .eventCallback("onComplete", () => {
          this.removeChild(txtEf);
          gsap.killTweensOf(txtEf);
        });
    });
  }

  // 해당 함수에서 onPressGameKey()를 바로 호출하면 동시 입력이 불가능함.
  // 키 flag를 가지는 배열 하나를 선언해서 flag 값으로 down, up을 판단.
  onKeyDown(evt: KeyboardEvent) {
    // console.log("keyDown = " + evt.code);
    if (this._isClick) {
      if (evt.code == "KeyF") this._keyPress[0] = true;
      if (evt.code == "KeyG") this._keyPress[1] = true;
      if (evt.code == "KeyH") this._keyPress[2] = true;
      if (evt.code == "KeyJ") this._keyPress[3] = true;
    }
  }

  onKeyUp(evt: KeyboardEvent) {
    // console.log("keyDown = " + evt.code);
    if (this._isClick) {
      if (evt.code == "KeyF") this.setKeyUpAction(0);
      if (evt.code == "KeyG") this.setKeyUpAction(1);
      if (evt.code == "KeyH") this.setKeyUpAction(2);
      if (evt.code == "KeyJ") this.setKeyUpAction(3);
    }
  }

  // 게임이 끝나면 down된 키 상태를 up으로 전환.
  allKeyUp() {
    for (let i = 0; i < 4; i++) {
      this.setKeyUpAction(i);
    }
  }

  setKeyDownAction($index: number) {
    this._keyArray[$index].onKeyDown();
    this._trackArray[$index].onKeyDown();
    this.onPressGameKey($index);
  }

  setKeyUpAction($index: number) {
    this._keyPress[$index] = false;
    this._keyArray[$index].onKeyUp();
    this._trackArray[$index].onKeyUp();
  }
}
