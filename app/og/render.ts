import { render } from "takumi-js";
import { cardHtml } from "./card.ts";
import type { OgSnapshot } from "./params.ts";

// Noto Sans JP のサブセット。カードの文言、数字、day / hour だけを含む。
// 文言を増やすときは Google Fonts の css2 text= で同じ字面を取り直す。

const WIDTH = 1200;
const HEIGHT = 630;

export const renderOgPng = (
  snapshot: OgSnapshot,
  fontData: Uint8Array
): Promise<Uint8Array> => {
  return render(cardHtml(snapshot), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "Noto Sans JP",
        data: fontData,
        weight: 400,
        style: "normal"
      }
    ]
  });
};
