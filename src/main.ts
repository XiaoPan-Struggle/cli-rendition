import {IncomingMessage} from "http";
import * as querystring from "querystring";

export const translate = (word: string) => {
  const https = require("https");
  console.log(word);
  //http://api.fanyi.baidu.com/api/trans/vip/translate?q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4
  const query = querystring.stringify({
    q: word,
    from: "en",
    to: "zh",
    appid: "2015063000000001",
    salt: "1435660288",
    sign: "f89f9594663708c1605f3d736d01d2d4",
  });
  console.log(query);

  const options = {
    hostname: "api.fanyi.baidu.com",
    port: 443,
    path: "/api/trans/vip/translate?" + query,
    method: "GET"
  };

  const req = https.request(options, (res: IncomingMessage) => {
    console.log("statusCode:", res.statusCode);
    console.log("headers:", res.headers);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (e: Error) => {
    console.error(e);
  });
  req.end();

};
