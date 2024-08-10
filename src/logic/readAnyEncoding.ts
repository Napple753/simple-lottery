import Encoding from "encoding-japanese";

export function readAnyEncoding(reader: FileReader): string {
  if (reader.result === null) {
    throw new Error("ファイルが読み込まれていません");
  }
  if (typeof reader.result === "string") {
    return reader.result;
  }

  let array: Uint8Array | Uint16Array | Uint32Array = new Uint8Array(
    reader.result,
  );

  // 文字コードを取得
  switch (Encoding.detect(array)) {
    case "UTF16":
      // 16ビット符号なし整数値配列と見なす
      array = new Uint16Array(reader.result);
      break;
    case "UTF32":
      // 32ビット符号なし整数値配列と見なす
      array = new Uint32Array(reader.result);
      break;
  }

  // Unicodeの数値配列に変換
  const unicodeArray = Encoding.convert(array, "UNICODE");
  // Unicodeの数値配列を文字列に変換
  return Encoding.codeToString(unicodeArray);
}
