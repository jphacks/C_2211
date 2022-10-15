const CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN');

async function doPost(e) {
  // console.log(CHANNEL_ACCESS_TOKEN); // でばぐ用
  const replyToken= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof replyToken === 'undefined') {
    // debug("強制終了");
    return;
  }

  const input = JSON.parse(e.postData.contents).events[0].message;
  const userMessageType = input.type;
  // debug(userMessageType); // 問題なく取得できている
  const userMessageText = input.text;
  const url = 'https://api.line.me/v2/bot/message/reply';

  let queryList = await generateSearchQuery(userMessageText);
  let returnMessage = "調べてきたよ！\n調べた結果は👇から見てね！\n" + await generateSearchUrl(queryList);

  // let message = (userMessageType === "text") ? [{
  //         'type': 'text',
  //         'text': "今調べてるところだよ！\n少し待ってね🦉",
  //       }, {
  //         'type': 'text',
  //         'text': returnMessage,
  //       }] : [{
  //     'type': 'text',
  //     'text': "文字で知りたいことを送ってね！🦉",
  //   }];
  
  let message;
  if (userMessageType === 'text') {
    debug("テキストメッセージ");
    message = [{
          'type': 'text',
          'text': "今調べてるところだよ！\n少し待ってね🦉",
        }, {
          'type': 'text',
          'text': returnMessage,
        }];
  }else{
    debug("テキスト以外");
    message = [{
      'type': 'text',
      'text': "文字で知りたいことを送ってね！🦉",
    }];
  } 
  debug(message);

  console.log(returnMessage);
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': message,
    }),
  });

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function debug(value='デバッグテスト') {
  const sheet = SpreadsheetApp.openById('17Fd5bUIrAI3I73yuRffYPyCoZhuh9vPJmztzlp0rmXs');
  const ss = sheet.getSheetByName('logs');
  const date = new Date();
  const targetRow = ss.getLastRow() + 1;
  ss.getRange('A' + targetRow).setValue(date);
  ss.getRange('B' + targetRow).setValue(value);
}