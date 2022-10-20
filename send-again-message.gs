/**
 * なにかしらのエラーが出た際に、再度時間を置いて試すように促すメッセージを送信する関数
 */
async function sendAgainMessage() {
  if (!isErrorHandling){
    return;
  }
  const url = 'https://api.line.me/v2/bot/message/push';

  const payload = {
    to: userId,　//ユーザーID
    messages: [
      { 
        'type': 'text',
        'text': "ごめんなさい… ちょっと今忙しいみたい\n少し待ってもう一度送ってね！🦉",  
      }
    ]
  };

  const params = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  };
  UrlFetchApp.fetch(url, params);
  isErrorHandling = false;
}
