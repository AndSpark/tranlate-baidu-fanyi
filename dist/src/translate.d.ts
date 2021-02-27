declare interface BaiduOpitons {
    appid: string;
    secret: string;
}
declare interface TranslateOpitons {
    from: string;
    to: string;
}
export default class Translate {
    instanceCount: number;
    maxInstanceCount: number;
    totalInstanceCount: number;
    private url;
    private appid;
    private secret;
    private instance;
    constructor(baiduOptions?: BaiduOpitons);
    trans(words: string, translateOptions?: TranslateOpitons): Promise<string[]>;
    private interceptors;
}
export {};
