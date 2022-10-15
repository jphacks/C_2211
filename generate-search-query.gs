function generateSearchQuery(sentence) {
  const postList = ['名詞', '動詞語幹', '形容詞語幹', '独立詞'];  // 検索クエリに追加する品詞一覧
  // let testSentence = "赤いふくろうのぬいぐるみを買いたい";  // でばぐ用
  let analysisResult = textAnalysis(sentence);  // 形態素解析の結果
  // console.log(analysisResult);
  
  let searchQueryList = [];
  for (let i = 0; i < analysisResult.length; i++){
    // console.log(analysisResult[i][1]);
    if (postList.includes(analysisResult[i][1])) {
      // console.log("語幹だよーん");
      searchQueryList.push(analysisResult[i][0]);
    }
  }
  console.log(searchQueryList);
  return searchQueryList;
}

function generateSearchUrl(searchQueryList) {
  // let testSearchQueryList = [ '赤', 'ふくろう', 'ぬいぐるみ', '買' ]; // でばぐ用
  let searchUrl = "http://www.google.co.jp/search?hl=ja&source=hp&safe=high&q=";
  for (const keyword of searchQueryList) {
    searchUrl += (keyword + "+");
  }
  console.log(searchUrl);
  return searchUrl;
}
