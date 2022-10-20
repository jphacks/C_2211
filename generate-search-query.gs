/** ============初期準備============== */
// function fetchSearchQuery(sentence) {
//   let _searchQueryList = await generateSearchQuery(sentence);
//   return generateSearchUrl(_searchQueryList);
// }


function generateSearchQuery(sentence) {
  /** ============初期準備============== */
  const postList = ['名詞', '動詞語幹', '形容詞語幹', '独立詞', 'Number', 'Alphabet', 'Kana', 'Katakana', 'Kanji', 'Roman', 'Undef'];  // 検索クエリに追加する品詞一覧
  // let testSentence = "今日は走った。明日の天気は？";  // でばぐ用
  // let sentence = testSentence; // でばぐ用


  /** ============形態素解析を実行============== */
  let analysisResult = improveSeachQuery(sentence);  // 形態素解析の結果
  console.log(analysisResult);
  
  let _searchQueryList = [];
  for (let i = 0; i < analysisResult.length; i++){
    // console.log(analysisResult[i][1]);
    if (postList.includes(analysisResult[i][1])) {
      // console.log("語幹だよーん");
      _searchQueryList.push(analysisResult[i][0]);
    }
  }
  console.log(_searchQueryList);
  return _searchQueryList;
}

function generateSearchUrl(searchQueryList) {
  debug(searchQueryList);
  // let testSearchQueryList = [ '赤', 'ふくろう', 'ぬいぐるみ', '買' ]; // でばぐ用
  let searchUrl = "http://www.google.co.jp/search?hl=ja&source=hp&safe=high&q=";
  for (const keyword of searchQueryList) {
    debug(keyword);
    if (keyword != "日本") {
      searchUrl += (keyword + "+");
    }
  }
  console.log(searchUrl);
  return searchUrl;
}
