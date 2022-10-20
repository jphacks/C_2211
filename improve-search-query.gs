const hiragana = [["あ", "い", "う", "え", "お"], ["か", "き", "く", "け", "こ"], ["さ", "し", "す", "せ", "そ"], ["た", "ち", "つ", "て", "と"], ["な", "に", "ぬ", "ね", "の"], ["は", "ひ", "ふ", "へ", "ほ"], ["ま", "み", "む", "め", "も"], ["や", "ゆ", "よ"], ["ら", "り", "る", "れ", "ろ"]];
const uDan = ["う", "く", "す", "つ", "ぬ", "ふ", "む", "ゆ", "る"];
const minusWords = ["何", "教え", "知"] // 何, 教えて, 知りたい, 

function improveSeachQuery(input){
	// let _testInputMessage = "今日は走った。明日の天気は？";
  // let sentence = _testInputMessage;
  let properNounList = [];

  // 「。」を「、」に置き換え
  inputMessage = input.replace("。", "、");

  
  
  debug("imporoveSerchQueryに渡された引数");
  debug(inputMessage);
  let json = extractProperNoun(inputMessage);

  // 「どう」が含まれていたら、「方法」に置換
  inputMessage = inputMessage.replace("どう", "方法");

  // console.log(json['ne_list'].length);

  // 抽出した固有名詞を検索クエリに追加、固有名詞を特定のキーワードで置き換え
  for (let i=0 ; i < json['ne_list'].length; i++) {
    properNounList.push(json['ne_list'][i][0]);
    inputMessage = inputMessage.replace(json['ne_list'][i][0], "日本");
  }
  // console.log(properNounList);
  // console.log(_testInputMessage);

  // 動詞を終止形にする
  const apiUrlVerb = PropertiesService.getScriptProperties().getProperty('HEROKU_API_URL') + inputMessage;
  let responseVerb = UrlFetchApp.fetch(apiUrlVerb).getContentText();
  let jsonVerb = JSON.parse(responseVerb);
  console.log(jsonVerb["sentence"]);


  // 形態素解析を行う
  const wordList = textAnalysis(jsonVerb["sentence"]);
  console.log(wordList);
  console.log("-------------形態素解析終了-------------");

  // 不要なワードの削除
  for (let i = 0; i < minusWords.length; i++) {
    for (let j = 0; j < wordList.length; j++) {
      if (wordList[j][0] == minusWords[i]) {
        wordList[j][0] = "";
        wordList[j][1] = "";
      }
    }
  }
  console.log(wordList);
  console.log("-------------不要なワード削除済み-------------");

  // もろもろの場合分けを無限に
  for (let i=0; i < wordList.length; i++) {
    // 形容詞語幹に"い"を追加
    if (wordList[i][1] == "形容詞語幹") { 
      wordList[i][0] += "い";
    }
    // 名詞接尾辞がある場合、その前の名詞とくっつける
    if (wordList[i][1] == "名詞接尾辞") {
      wordList[i-1][0] += wordList[i][0];
    }
    // 動詞活用語尾を終止形に変換、動詞とくっつける
    if (wordList[i][1] == "動詞活用語尾" || wordList[i][1] == "動詞接尾辞") {
      for (let j = 0; j < hiragana.length; j++) {
        for (let k = 0; k < hiragana[j].length; k++) {
          if (wordList[i][0] == hiragana[j][k]) {
            wordList[i-1][0] += uDan[j];
          }
        }
      }
    }
    // 助数詞、助助数詞、冠数詞がある場合、Numberにくっつける
    if (wordList[i][1] == "冠数詞") {
      wordList[i+1][0] = wordList[i][0] + wordList[i+1][0];
    }
    if (wordList[i][1] == "助数詞" && wordList[i+1][1] == "助助数詞") {
      wordList[i-1][0] += wordList[i][0] + wordList[i+1][0];
    } else if (wordList[i][1] == "助数詞") {
      wordList[i-1][0] += wordList[i][0];
    }
  }
  console.log("-----------検索クエリ------------");
  console.log(wordList);
  // Array.prototype.push.apply(wordList, properNounList);
  // return wordList;
  return {
    "wordList": wordList,
    "properNounList": properNounList
  };  // -> generateSearchQuesyに渡す
}
