import { render } from "takumi-js";
import { cardHtml } from "./card";
import fontDataUrl from "./fonts/NotoSansJP-subset.woff2?inline";
import type { OgSnapshot } from "./params";

// Noto Sans JP のサブセット。カードの文言、数字、day / hour / min だけを含む。
// 文言を増やすときは Google Fonts の css2 text= で同じ字面を取り直す。

const WIDTH = 1200;
const HEIGHT = 630;

let fontBytes: Uint8Array | undefined;

const dataUrlToBytes = (dataUrl: string): Uint8Array => {
  const comma = dataUrl.indexOf(",");
  const meta = dataUrl.slice(0, comma);
  const data = dataUrl.slice(comma + 1);
  if (!meta.includes(";base64")) {
    return new TextEncoder().encode(decodeURIComponent(data));
  }

  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const loadFont = (): Uint8Array => {
  fontBytes ??= dataUrlToBytes(fontDataUrl);
  return fontBytes;
};

export const renderOgPng = (snapshot: OgSnapshot): Promise<Uint8Array> => {
  return render(cardHtml(snapshot), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "Noto Sans JP",
        data: loadFont(),
        weight: 400,
        style: "normal"
      }
    ]
  });
};
