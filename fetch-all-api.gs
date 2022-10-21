/**
 * 全てのAPIをまとめて取得する関数
 * @param {String} inputMessage 入力された文章
 * @return { {[key: String]: List | String} } rtnAssociativeArray 形態素解析の結果(2次元配列),固有名詞抽出の結果(2次元配列),動詞を終止形に変換(String)
 */
async function fetchAllApi() {
  let inputMessage = "今日は晴れです。明日は走ります。";
  const appId = await PropertiesService.getScriptProperties().getProperty('APP_ID');
  console.log(appId);
  const apiUrlVerb = await PropertiesService.getScriptProperties().getProperty('HEROKU_API_URL') + inputMessage;

  let jsonForMorphologicalAnalysis = {  // 形態素解析用JSON
    'url': "https://labs.goo.ne.jp/api/morph",
    'method': 'post',
    'payload': {
      'app_id': appId,
      'sentence': inputMessage,
      'info_filter': 'form|pos'
    }
  }

  let jsonForProperNounExtraction = {   // 固有名詞抽出用JSON
    'url': "https://labs.goo.ne.jp/api/entity",
    'method': 'post',
    'payload': {
      'app_id': appId,
      'sentence': inputMessage,
    }
  }

  let jsonForVerbTerminalForm = {
    'url': apiUrlVerb
  }

  let req = [jsonForMorphologicalAnalysis, jsonForProperNounExtraction, jsonForVerbTerminalForm];
  let rtn = await UrlFetchApp.fetchAll(req);

  let rtnContentTextForTextAnalysis = rtn[0].getContentText();
  let rtnJsonForTextAnalysis = JSON.parse(rtnContentTextForTextAnalysis);
  let rtnListForTextAnalysis = rtnJsonForTextAnalysis["word_list"][0];

  let rtnContentTextForProperNounExtraction = rtn[1].getContentText();
  let rtnJsonForProperNounExtraction = JSON.parse(rtnContentTextForProperNounExtraction);
  let rtnListForProperNounExtraction = rtnJsonForProperNounExtraction["ne_list"];

  let rtnContentTextForVerbTerminalForm = rtn[2].getContentText();
  let rtnJsonForVerbTerminalForm = JSON.parse(rtnContentTextForVerbTerminalForm);
  let rtnListForVerbTerminalForm = rtnJsonForVerbTerminalForm["sentence"];

  let rtnAssociativeArray = {
    "text_anakysis": rtnListForTextAnalysis,
    "proper_noun_extraction": rtnListForProperNounExtraction,
    "verb_terminal_form": rtnListForVerbTerminalForm
  }
  console.log(rtnAssociativeArray);
}
