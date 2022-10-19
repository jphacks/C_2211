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
  const userMessageText = input.text;
  const url = 'https://api.line.me/v2/bot/message/reply';
  const userId = JSON.parse(e.postData.contents).events[0].source.userId;

  let message;
  if (userMessageType != 'text'){
    debug("テキスト以外");
    message = [{
      'type': 'text',
      'text': "文字で知りたいことを送ってね！🦉",
    }];
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
  debug(message);

  //「ちょっとまってね」と送信
  await send_waitMessage(userId);

  let queryList = await generateSearchQuery(userMessageText);
  let returnMessage = "調べてきたよ！\n調べた結果は👇をタッチ！\n" + await generateSearchUrl(queryList);

  let message_2
  message_2 = [{
      'type': 'text',
      'text': returnMessage,
    }];
  
  console.log(returnMessage);
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': message_2,
    }),
  });
  debug(message_2);

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