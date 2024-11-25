let url = "https://proapi.115.com/ios/2.0/user/points_sign";
let headers = $persistentStore.read('115PanCookie');
let body = $persistentStore.read('115PanBody');

if (headers === null && body === null){
    $notification.post("115CheckInScript","","未获取Cookie,请先手动签到获取!");
    $done();
}

let params = {
    url:url,
    timeout:5000,
    headers:headers,
    body:body,
};
// 生成 1 到 60 之间的随机秒数
let randomDelay = Math.floor(Math.random() * 60) + 1;

// 将秒转换为毫秒
let delayInMilliseconds = randomDelay * 1000;

// 延时执行代码,增加随机性
setTimeout(() => {
    console.log(`等待 ${randomDelay} 秒，执行代码！`);

    $httpClient.post(params, function(errorMsg,response,data) {
        if (errorMsg) {
            console.log(errormsg);
        } else {
            let dictData = JSON.parse(data);
            if (dictData.state) {
                $notification.post("115CheckInScript","",`每日签到成功，获得${dictData.data.points_num}枫叶\n已连续签到${dictData.data.continuous_day}天`);
            }else{
                $notification.post("115CheckInScript","","签到失败，请检查cookie是否有效!");
            }
            console.log("Response Status: " + response.status);
            console.log("Response Body: " + data);
        }
        $done();
    });
}, delayInMilliseconds);

