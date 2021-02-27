"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var md5 = require("spark-md5");
var Translate = /** @class */ (function () {
    function Translate(baiduOptions) {
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
        this.instance = axios_1["default"].create({ baseURL: this.url });
        this.interceptors();
    }
    Translate.prototype.trans = function (words, translateOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, sign, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        salt = Date.now();
                        sign = md5.hash("" + this.appid + words + salt + this.secret);
                        return [4 /*yield*/, this.instance({
                                params: {
                                    q: words,
                                    from: translateOptions ? translateOptions.from : 'zh',
                                    to: translateOptions ? translateOptions.to : 'en',
                                    appid: this.appid,
                                    salt: salt,
                                    sign: sign
                                }
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        if (data.error_code) {
                            throw new Error('tranlate Error:' + data.error_msg);
                        }
                        return [2 /*return*/, data.trans_result.map(function (v) { return v.src; })];
                }
            });
        });
    };
    Translate.prototype.interceptors = function () {
        var _this = this;
        this.instance.interceptors.request.use(function (config) { return __awaiter(_this, void 0, void 0, function () {
            var timer_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.totalInstanceCount++;
                        if (!(this.instanceCount >= this.maxInstanceCount)) return [3 /*break*/, 2];
                        timer_1 = null;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                timer_1 = setInterval(function (_) {
                                    if (_this.instanceCount < _this.maxInstanceCount)
                                        resolve('');
                                }, 1000);
                            })];
                    case 1:
                        _a.sent();
                        this.instanceCount++;
                        clearInterval(timer_1);
                        return [2 /*return*/, config];
                    case 2:
                        this.instanceCount++;
                        return [2 /*return*/, config];
                }
            });
        }); }, function (err) { return err; });
        this.instance.interceptors.response.use(function (res) {
            setTimeout(function () {
                _this.instanceCount--;
                _this.totalInstanceCount--;
            }, 1100);
            return res;
        }, function (err) { return err; });
    };
    return Translate;
}());
exports["default"] = Translate;
