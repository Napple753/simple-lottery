import { LotteryBox } from "@/logic/LotteryBox";
import { Candidate } from "@/myTypes";

const prepareDummyData = (CANDIDATE_TOTAL: number) => {
  const dummyData = [...new Array(CANDIDATE_TOTAL)].map((_, i) => ["" + i]);
  const candidates = dummyData.map((d, i) => ({
    id: i,
    data: d,
  })) as Candidate[];
  const selectCountOfCandidates: number[] = [];
  candidates.forEach((candidate) => {
    selectCountOfCandidates[candidate.id] = 0;
  });
  return {
    dummyData,
    candidates,
    selectCountOfCandidates,
  };
};

const drawAndCount = (
  lotteryBox: LotteryBox,
  selectCountOfCandidates: number[],
  winnerNum: number,
) => {
  const winners = lotteryBox.draw(Date.now(), "", winnerNum);
  winners.forEach((winners) => {
    selectCountOfCandidates[winners.id]++;
  });
};

test("1度に1人ずつ当選させて当選結果に重複がないこと", () => {
  const CANDIDATE_TOTAL = 1000;
  const CANDIDATE_EACH = 1;

  const { selectCountOfCandidates, candidates } =
    prepareDummyData(CANDIDATE_TOTAL);
  const lotteryBox = new LotteryBox(candidates);

  for (let i = 0; i < CANDIDATE_TOTAL; i += CANDIDATE_EACH) {
    drawAndCount(lotteryBox, selectCountOfCandidates, CANDIDATE_EACH);
    expect(selectCountOfCandidates.every((count) => count <= 1)).toBe(true);
  }
});

test("1度に10人ずつ当選させて当選結果に重複がないこと", () => {
  const CANDIDATE_TOTAL = 1000;
  const CANDIDATE_EACH = 10;

  const { selectCountOfCandidates, candidates } =
    prepareDummyData(CANDIDATE_TOTAL);
  const lotteryBox = new LotteryBox(candidates);

  for (let i = 0; i < CANDIDATE_TOTAL; i += CANDIDATE_EACH) {
    drawAndCount(lotteryBox, selectCountOfCandidates, CANDIDATE_EACH);
    expect(selectCountOfCandidates.every((count) => count <= 1)).toBe(true);
  }
});

test("候補者より当選者が多いときに、全員１度当選するまで２回目の当選はないこと", () => {
  const CANDIDATE_TOTAL = 1000;
  const CANDIDATE_EACH = 1;

  const { selectCountOfCandidates, candidates } =
    prepareDummyData(CANDIDATE_TOTAL);
  const lotteryBox = new LotteryBox(candidates);

  for (let i = 0; i < CANDIDATE_TOTAL; i += CANDIDATE_EACH) {
    drawAndCount(lotteryBox, selectCountOfCandidates, CANDIDATE_EACH);
    expect(selectCountOfCandidates.every((count) => count <= 1)).toBe(true);
  }
  for (let i = 0; i < CANDIDATE_TOTAL; i += CANDIDATE_EACH) {
    drawAndCount(lotteryBox, selectCountOfCandidates, CANDIDATE_EACH);
    expect(selectCountOfCandidates.every((count) => count <= 2)).toBe(true);
  }
});

// test("当選確率が偏っていないこと", () => {
//   const CANDIDATE_TOTAL = 100;
//   const CANDIDATE_EACH = 10;
//   const EXPECT_WIN = 10;

//   const { selectCountOfCandidates, candidates } =
//     prepareDummyData(CANDIDATE_TOTAL);

//   for (let i = 0; i < CANDIDATE_TOTAL*EXPECT_WIN; i += CANDIDATE_EACH) {
//     const lotteryBox = new LotteryBox(candidates);

//     drawAndCount(lotteryBox,selectCountOfCandidates,CANDIDATE_EACH)
//     //expect(selectCountOfCandidates.every((count) => count <= 2)).toBe(true);
//   }
//   console.log(selectCountOfCandidates)
// });
