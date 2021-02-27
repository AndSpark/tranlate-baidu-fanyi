import axios, { AxiosInstance } from 'axios'
import * as md5 from 'spark-md5'

declare interface BaiduOpitons {
  appid: string
  secret: string
}

declare interface TranslateOpitons {
  from: string,
  to:string
}

export default class Translate {
  instanceCount: number = 0 // 当前请求数量
  maxInstanceCount: number = 10 // 最大请求数量
  totalInstanceCount: number = 0 // 总共剩余的请求数量
  private url: string = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
  private appid: string
  private secret: string
  private instance: AxiosInstance
  
  constructor(baiduOptions?: BaiduOpitons) {
    this.appid = "20201215000647582"
    this.secret = "0IfZkeEAc8PkRIseU_7y"
    if (baiduOptions && baiduOptions.appid && baiduOptions.secret) {
      this.appid = baiduOptions.appid
      this.secret = baiduOptions.secret
    }
    this.instance = axios.create({ baseURL: this.url })
    this.interceptors()
  }

  async trans(words:string,translateOptions?: TranslateOpitons) {
    const salt = Date.now();
    const sign = md5.hash(`${this.appid}${words}${salt}${this.secret}`);
    const {data} = await this.instance({
      params: {
        q: words,
        from: translateOptions ? translateOptions.from : 'zh',
        to: translateOptions ? translateOptions.to : 'en',
        appid: this.appid,
        salt:salt,
        sign:sign
      }
    })
    if (data.error_code) {
      throw new Error('tranlate Error:' + data.error_msg)
    }
    return data.trans_result.map(v => v.src)
  }

  private interceptors(): void {
    this.instance.interceptors.request.use(async (config) => {
      this.totalInstanceCount++
      if (this.instanceCount >= this.maxInstanceCount) {
        let timer:any = null
        await new Promise((resolve) => {
          timer = setInterval(_ => {
            if(this.instanceCount < this.maxInstanceCount) resolve('')
          },1000)
        })
        this.instanceCount++
        clearInterval(timer)
        return config
      }
      this.instanceCount++
      return config
    }, err => err)
    
    this.instance.interceptors.response.use(res => {
      setTimeout(() => {
        this.instanceCount--
        this.totalInstanceCount--
      }, 1100);
      return res
    },err => err)
  }
}