import Encoding from "encoding-japanese";

export function readAnyEncoding(reader: FileReader): string {
  let array: Uint8Array | Uint16Array | Uint32Array = new Uint8Array(
    reader.result as any,
  );

  // 文字コードを取得
  switch (Encoding.detect(array)) {
    case "UTF16":
      // 16ビット符号なし整数値配列と見なす
      array = new Uint16Array(reader.result as any);
      break;
    case "UTF32":
      // 32ビット符号なし整数値配列と見なす
      array = new Uint32Array(reader.result as any);
      break;
  }

  // Unicodeの数値配列に変換
  var unicodeArray = Encoding.convert(array, "UNICODE");
  // Unicodeの数値配列を文字列に変換
  return Encoding.codeToString(unicodeArray);
}
