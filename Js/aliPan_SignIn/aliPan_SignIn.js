let UserAgent = "AliApp(AYSD/6.7.5) com.alicloud.smartdrive/6.7.5 Version/18.2 Channel/201200 Language/zh-Hans-CN /iOS Mobile/iPhone17,1"
let currentDate = null
let aliPanAccessToken = null
function refreshToken() {
    return new Promise((resolve) => {
        let tokenUrl = 'https://auth.alipan.com/v2/account/token';
        let refreshParams = {
            url: tokenUrl,
            timeout: 5000,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent":UserAgent
            },
            body: JSON.stringify({
                grant_type: "refresh_token",
                refresh_token: $persistentStore.read('aliPanRefreshToken')
            })
        };
        // 请求获取新的 token
        $httpClient.post(refreshParams, function (error, response, data) {
            if (error) {
                console.log("获取新的 token 失败", error);
                $notification.post('aliPanSignIn', '获取新的 token 时出错', '');
                $done();
                return;
            }
            console.log('开始获取token');
            try {
                let tokenData = JSON.parse(data);
                if (tokenData && tokenData.access_token) {
                    // 将新的 token 存储到持久化存储中
                    $persistentStore.write(tokenData.refresh_token, 'aliPanRefreshToken');
                    aliPanAccessToken = tokenData.access_token
                    $persistentStore.write(tokenData.access_token, 'aliPanAccessToken');
                    console.log(tokenData.access_token);
                    // $notification.post('aliPanSignIn', '获取token完成', '');
                    console.log('获取token成功');
                    resolve();
                } else {
                    $notification.post('aliPanSignIn', '获取新的 token 时出错', '');
                    console.log("获取新的 token 时出错");
                    $done();
                }
            } catch (e) {
                console.log(e);
                $notification.post('aliPanSignIn', '解析新 token 响应失败', '');
                $done();
            }
        });
    });
}


function aliPanSignIn() {
    return new Promise((resolve) => {
        const randomDelay = Math.floor(Math.random() * 30) + 1;
        const seconds = randomDelay * 1000;

        console.log('开始签到！！！');
        console.log(`延时：${randomDelay}秒`);
        setTimeout(() => {
            if (isTimeDate($persistentStore.read('checkSignDate'))) {
                $notification.post('aliPanSignIn','','今日已经签到，无法重复签到～')
                console.log('今日已签到，无需重复签到！');
                $done();
            }else {

                let params = {
                    url: 'https://member.alipan.com/v1/activity/sign_in_list',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer ' + aliPanAccessToken,
                        // Authorization: 'Bearer '+ $persistentStore.read('aliPanAccessToken'),
                        "User-Agent": UserAgent
                    },
                    body: JSON.stringify({})
                };
                $httpClient.post(params, function (error, response, data) {
                    if (error) {
                        console.log(error);
                        $notification.post('aliPanSignIn', '签到时出现错误！！！', '');
                        $done();
                    } else {
                        try {
                            let jsonData = JSON.parse(data)
                            if (jsonData.success) {
                                const signInLogs = jsonData?.result?.signInLogs || [];
                                let checkInDay = null;
                                let rewardDescription = null
                                let pendingRewardDays = 0
                                for (const resultDayData of signInLogs) {
                                    if (resultDayData.status === "miss") {
                                        break;
                                    }
                                    if (isEmpty(resultDayData.reward.description) && isEmpty(resultDayData.reward.name)){
                                        pendingRewardDays += 1

                                    }
                                    checkInDay = resultDayData.day;
                                    rewardDescription = resultDayData.reward.description
                                }
                                console.log(checkInDay)
                                console.log(rewardDescription)
                                $notification.post('aliPanSignIn', `第${checkInDay}天签到成功！`, `奖励：${rewardDescription} 请手动领取！`);
                                $persistentStore.write(currentDate, 'checkSignDate');
                                resolve();
                            }
                        } catch (e) {
                            console.log(e);
                            console.log(data)
                            $notification.post('aliPanSignIn', '解析新 token 响应失败', '');
                            $done();
                        }
                    }
                })
            }
        }, seconds);
    });

}

function isEmpty(cont) {
    if (cont == null) {
        return true;
    }
    return typeof cont === "string" && cont.trim().length === 0;
}

function isTimeDate(DateTime) {
    let nowDate = new Date();

    // let year = nowDate.getFullYear();
    // let month = nowDate.getMonth() + 1;
    // let day = nowDate.getDate();
    // let hours = nowDate.getHours();
    currentDate = nowDate.toLocaleDateString()
    // currentDate = `当前时间：${year}-${month}-${day}`
    console.log(currentDate)
    return DateTime === currentDate;
}


    async function startCheckSign() {
    if (isEmpty($persistentStore.read('aliPanRefreshToken'))) {
        $notification.post('aliPanSignIn', '', '请先手动打开阿里云盘获取refreshToken');
        $done();
    } else {
        await refreshToken()
        await aliPanSignIn()
        $done();
    }

}

startCheckSign()