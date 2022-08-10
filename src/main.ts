import {IncomingMessage} from "http";
import * as querystring from "querystring";
import md5 = require("md5");
import {appid, appSecret} from "./private";

const errorMap: { [key: string]: string } = {
  52003: "用户认证失败",
  52004: "error2",
  52005: "error3",
  unknown: "服务器繁忙"
};

export const translate = (word: string) => {
  const https = require("https");
  const q = word;
  const salt = Math.random();
  const sign = md5(appid + q + salt + appSecret);

  let flag = /[a-zA-Z]/.test(word[0]);

  const query = querystring.stringify({
    q: q,
    from: flag ? "en" : "zh",
    to: flag ? "zh" : "en",
    appid: appid,
    salt: salt,
    sign: sign,
  });

  const options = {
    hostname: "api.fanyi.baidu.com",
    port: 443,
    path: "/api/trans/vip/translate?" + query,
    method: "GET"
  };

  type BaiduResult = {
    form: string,
    to: string,
    trans_result: {
      src: string,
      dst: string
    }[],
    error_code?: string,
    error_msg?: string
  }

  const req = https.request(options, (res: IncomingMessage) => {
    let chunks: Buffer[] = [];
    res.on("data", (chunk) => {
      chunks.push(chunk);
    });

    res.on("end", () => {
      const string = Buffer.concat(chunks).toString();
      const object: BaiduResult = JSON.parse(string);
      if (object.error_code) {
        console.error(errorMap[object.error_code] || object.error_msg);
        process.exit(2);
      } else {
        object.trans_result.map(w => {
          console.log(`-----${w.src}-----`);
          console.log(w.dst);
        });
        process.exit(0);
      }
    });
  });

  req.on("error", (e: Error) => {
    console.error(e);
  });

  req.end();
};
