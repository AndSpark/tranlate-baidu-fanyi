import axios from 'axios';
import * as md5 from 'spark-md5';
export default class Translate {
    constructor(baiduOptions) {
        this.instanceCount = 0; // 当前请求数量
        this.maxInstanceCount = 10; // 最大请求数量
        this.totalInstanceCount = 0; // 总共剩余的请求数量
        this.url = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
        this.appid = "20201215000647582";
        this.secret = "0IfZkeEAc8PkRIseU_7y";
        if (baiduOptions && baiduOptions.appid && baiduOptions.secret) {
            this.appid = baiduOptions.appid;
            this.secret = baiduOptions.secret;
        }
        this.instance = axios.create({ baseURL: this.url });
        this.interceptors();
    }
    async trans(words, translateOptions) {
        const salt = Date.now();
        const sign = md5.hash(`${this.appid}${words}${salt}${this.secret}`);
        const { data } = await this.instance({
            params: {
                q: words,
                from: translateOptions ? translateOptions.from : 'zh',
                to: translateOptions ? translateOptions.to : 'en',
                appid: this.appid,
                salt: salt,
                sign: sign
            }
        });
        if (data.error_code) {
            throw new Error('tranlate Error:' + data.error_msg);
        }
        return data.trans_result.map(v => v.src);
    }
    interceptors() {
        this.instance.interceptors.request.use(async (config) => {
            this.totalInstanceCount++;
            if (this.instanceCount >= this.maxInstanceCount) {
                let timer = null;
                await new Promise((resolve) => {
                    timer = setInterval(_ => {
                        if (this.instanceCount < this.maxInstanceCount)
                            resolve('');
                    }, 1000);
                });
                this.instanceCount++;
                clearInterval(timer);
                return config;
            }
            this.instanceCount++;
            return config;
        }, err => err);
        this.instance.interceptors.response.use(res => {
            setTimeout(() => {
                this.instanceCount--;
                this.totalInstanceCount--;
            }, 1100);
            return res;
        }, err => err);
    }
}
