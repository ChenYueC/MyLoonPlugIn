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

        $httpClient.post(refreshParams, function (error, response, data) {
            if (error) {
                console.log("获取新的 token 失败", error);
                $notification.post('aliPanSignIn', '获取新的 token 时出错', '');
                $done();
                return;
            }

            try {
                let tokenData = JSON.parse(data);
                if (tokenData && tokenData.access_token) {
                    // 将新的 token 存储到持久化存储中
                    $persistentStore.write(tokenData.refresh_token, 'aliPanRefreshToken');
                    aliPanAccessToken = tokenData.access_token
                    // $persistentStore.write(tokenData.access_token, 'aliPanAccessToken');
                    console.log(tokenData.access_token);
                    $notification.post('aliPanSignIn', '获取新token完成', '');
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
    // 请求获取新的 token

}


function aliPanSignIn() {
    return new Promise((resolve) => {
        const randomSeconds = Math.floor(Math.random() * 30) + 1;
        const seconds = randomDelay * 1000;

        setTimeout(() => {
            if (isTimeDate($persistentStore.read('checkSignDate'))) {
                $notification.post('aliPanSignIn','','今日已经签到，无法重复签到～')
                $done();
            }else {
                refreshToken()
                let params = {
                    url: 'https://member.alipan.com/v1/activity/sign_in_list',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Bearer ' + aliPanAccessToken,
                        "User-Agent": UserAgent
                    },
                    body: JSON.stringify({})
                };
                $httpClient.post(params, function (error, response, data) {
                    if (error) {
                        console.log("获取新的 token 失败", error);
                        $notification.post('aliPanSignIn', '签到时出现错误！！！', '');
                        $done();
                    } else {
                        try {
                            let jsonData = JSON.parse(data)
                            if (jsonData.success) {
                                const signInLogs = jsonData?.result?.signInLogs || [];
                                let checkInDay = null;
                                for (const statusDay of signInLogs) {
                                    if (statusDay.status === "miss") {
                                        break;
                                    }
                                    checkInDay = statusDay.day;
                                }
                                $notification.post('aliPanSignIn', `第${checkInDay}签到成功`, '');
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
    const now = new Date(DateTime);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    currentDate = `${year}-${month}-${day}`;
    return currentDate === DateTime;
}


async function startCheckSign() {
    if (isEmpty($persistentStore.read('aliPanRefreshToken'))) {
        $notification.post('aliPanSignIn', '', '请先手动打开阿里云盘获取refreshToken');
        $done();
    } else {
        await refreshToken()
        await aliPanSignIn()
    }

}