/**
 * 検索ワード一覧を作成する関数
 * @param {String} sentence 入力された文章
 * @return {String[]} searchQueryList 検索ワードの入った1次元リスト
 */
async function generateSearchQuery(sentence) {
  debug(sentence);
  const postList = ['名詞', '動詞語幹', '形容詞語幹', '独立詞', 'Number', 'Alphabet', 'Katakana', 'Kanji', 'Roman', 'Undef'];  // 検索クエリに追加する品詞一覧
  // let testSentence = "今日は走った。明日の天気は？";  // でばぐ用
  // let sentence = testSentence; // でばぐ用
  let searchQuery_json = await improveSeachQuery(sentence);
  let analysisResult = searchQuery_json["wordList"];  // 形態素解析の結果
  let properNounList = searchQuery_json["properNounList"];  // 形態素解析の結果
  
  let searchQueryList = [];
  let k = 0;
  let houhouCheck = false;
  for (let i = 0; i < analysisResult.length; i++){
    if (postList.includes(analysisResult[i][1])) {
      if(analysisResult[i][0] == "日本"){
        searchQueryList.push(properNounList[k]);
        k++;
      }else if(analysisResult[i][0] == "方法"){
        houhouCheck = true;
      }else{
        searchQueryList.push(analysisResult[i][0]);
      }
      
    }
  }
  if(houhouCheck){
    searchQueryList.push("方法");
  }
  k = 0;
  return searchQueryList;
}


/**
 * 検索ワード一覧から、検索クエリを含むURLを作成する関数
 * @param {string[]} searchQueryList 検索ワードの入った1次元リスト
 * @return {searchUrl} string 検索クエリを含んだURL
 */
function generateSearchUrl(searchQueryList) {

  const set = new Set(searchQueryList);
  const _searchQueryList = [...set];

  // let testSearchQueryList = [ '赤', 'ふくろう', 'ぬいぐるみ', '買' ]; // でばぐ用
  let searchUrl = "http://www.google.co.jp/search?hl=ja&source=hp&safe=high&q=";
  let houhouCheck = false;
  let firstOnly = true;
  for (const keyword of _searchQueryList) {
    if(firstOnly){
      firstOnly = false;
    }else{
      searchUrl += ("+");
    }
    searchUrl += (keyword);
  }
  return searchUrl;
}
