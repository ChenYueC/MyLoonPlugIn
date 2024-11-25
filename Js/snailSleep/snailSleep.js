const newDate = new Date('2099-12-31T23:59:59Z');
const newExpireDateTime = newDate.getTime()

let snailSleep = {
  "status" : 200,
  "message" : "OK",
  "result" : {
    "updated" : Date.now(),
    "expired" : false,
    "expiresRAD" : newExpireDateTime,
    "offerPeriod" : false,
    "expires" : newExpireDateTime,
    "type" : "SNAIL",
    "dreamsTotal" : 10,
    "level" : 1,
    "lifelong" : true,
  },
};

$done({body : JSON.stringify(snailSleep)});