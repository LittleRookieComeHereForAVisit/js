// 引入模块
let http = require('http');
let path = require('path');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
const { resolve } = require('path');
// const { join, resolve } = require('path');

// 定义根目录
const root = process.cwd();
// 文档类型
let MINE_TYPES = {
  'html': 'text/html',
  'xml':  'text/xml',
  'txt':  'text/plain',
  'css':  'text/css',
  'js':   'text/javascript',
  'json': 'application/json',
  'pdf':  'application/pdf',
  'swf':  'application/x-shockwave-flash',
  'svg':  'image/svg+xml',
  'tiff': 'image/tiff',
  'png':  'image/png',
  'gif':  'image/gif',
  'ico':  'image/x-icon',
  'jpg':  'image/jpeg',
  'jpeg': 'image/jpeg',
  'wav':  'audio/x-wav',
  'wma':  'audio/x-ms-wma',
  'wmv':  'video/x-ms-wmv',
  'woff2':'application/font-woff2'
};
// 创建服务器
let app = async (req,res) =>  {
    // 处理动态资源
    let urlObj = url.parse(req.url,true);
    // 获取文件地址
    // 为了支持中文,将其转码
    let filePath = path.join(root,decodeURIComponent(urlObj.pathname));
    // 当没有扩展名时，设置默认文件 index.html
    if(!path.extname(filePath)) {
      // 设置默认的
      filePath = path.join(filePath,'./index.html');
    }
    // 解析文件地址
    let fileObj = path.parse(filePath);
    // 获取扩展名
    let extname = fileObj.ext.slice(1);
    // 2. 获取扩展名
    // console.log(path.extname(filePath));

    // 判断文件是否存在
    let isExist = await new Promise(resolve => {
      // 判断文件是否存在
      fs.exists(filePath,result => resolve(result))
    })    
    // 判断结果
    if (isExist) {
      // 读取文件, 返回结果
      let data = await new Promise(resolve => {
          // 读取文件
        fs.readFile(filePath, (err,data) => resolve(data))
      })
      // 是否读取成功
      if (data) {
        // 返回数据设置状态码
        res.writeHead(200, {
          'Content-Type': MINE_TYPES[extname || 'txt'] + ';charset=utf-8'
        })
        // 返回数据
        return res.end(data);
      } 
    }
    // 没有找到文件时
    res.writeHead(404, {
       'Content-Type': MINE_TYPES.txt + ';charset=utf-8'  
    });
    res.end(decodeURIComponent(req.url) + ' not found!')
}
// 监听端口号
http.createServer(app).listen(3000);
// app.listen(80);

