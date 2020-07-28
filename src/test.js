// import Kuroshiro from "kuroshiro";
const Kuroshiro = require("kuroshiro");

const kuroshiro = new Kuroshiro();

// For this example, you should npm install and import the kuromoji analyzer first
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
// Initialize
async function main() {
   await kuroshiro.init(new KuromojiAnalyzer());
   text = "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！";

   const result = await kuroshiro.convert(text, {
      to: "romaji",
      mode: "spaced",
      romajiSystem: "hepburn"
   });

   console.log(text);
   console.log(result);
}



main();