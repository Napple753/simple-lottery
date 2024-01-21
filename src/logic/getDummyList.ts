import { shuffleArray } from "./shuffleArray";
import { Candidate } from "../myTypes";
/**
  ダミー配列作成関数
   * @param source ダミー配列のもとになる配列。当選者を含んでもよい
   * @param  count ダミー配列の長さ
   * @param winner 当選者
   * @return ダミー配列。最後の(count-1)個には当選者は含まれない
   */
export function getDummyList(
  source: Candidate[],
  count: number,
  winner: Candidate,
) {
  const dummyList: Candidate[] = [];
  const candidateNumber = source.length;
  for (let i = 0; i < Math.floor(count / candidateNumber); i++) {
    dummyList.push(...shuffleArray<Candidate>(source));
  }
  dummyList.push(
    ...shuffleArray<Candidate>(source).filter((p) => p.id !== winner.id),
  );

  return dummyList.slice(-count);
}
