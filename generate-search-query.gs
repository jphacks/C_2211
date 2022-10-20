function generateSearchQuery(sentence) {
  const postList = ['名詞', '動詞語幹', '形容詞語幹', '独立詞', 'Number', 'Alphabet', 'Katakana', 'Kanji', 'Roman', 'Undef'];  // 検索クエリに追加する品詞一覧
  // let testSentence = "今日は走った。明日の天気は？";  // でばぐ用
  // let sentence = testSentence; // でばぐ用
  let analysisResult = improveSeachQuery(sentence)["wordList"];  // 形態素解析の結果
  let properNounList = improveSeachQuery(sentence)["properNounList"];  // 形態素解析の結果
  debug("形態素解析の結果");
  debug(analysisResult[2][1]);
  debug(properNounList.length);
  
  let searchQueryList = [];
  let k = 0;
  for (let i = 0; i < analysisResult.length; i++){
    // console.log(analysisResult[i][1]);
    if (postList.includes(analysisResult[i][1])) {
      // console.log("語幹だよーん");
      if(analysisResult[i][0] == "日本"){
        searchQueryList.push(properNounList[k]);
        k++;
      }else{
        searchQueryList.push(analysisResult[i][0]);
      }
      
    }
  }
  k = 0;
  console.log(searchQueryList);
  return searchQueryList;
}

function generateSearchUrl(searchQueryList) {
  // let testSearchQueryList = [ '赤', 'ふくろう', 'ぬいぐるみ', '買' ]; // でばぐ用
  let searchUrl = "http://www.google.co.jp/search?hl=ja&source=hp&safe=high&q=";
  let houhouCheck = false;
  let firstOnly = true;
  for (const keyword of searchQueryList) {
    if(firstOnly){
      firstOnly = false;
    }else{
      searchUrl += ("+");
    }
    if (keyword === "方法"){
      houhouCheck = true;
      firstOnly = true;
    }else if (keyword !== "日本") {
      searchUrl += (keyword);
    }else{
      firstOnly = true;
    }
  }
  if(houhouCheck){
    searchUrl += ("+方法");
  }
  console.log(searchUrl);
  return searchUrl;
}
