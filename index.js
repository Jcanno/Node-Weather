const express = require('express')
const app = express()
const cheerio = require('cheerio')
const superagent= require('superagent')
const xlsx = require('node-xlsx')

// 获取excel sheet1表格
let sheet = xlsx.parse('./id-city.xlsx')[0].data;
let res = sheet.filter(item => {
  if(item[2].includes("宁波")){
    return item
  }
});
console.log(res)

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});

let getHotNews = (resb) => {
  let hotNews = [];
  let $ = cheerio.load(resb.text);
  // 找到目标数据所在的页面元素，获取数据
  $('.job-primary .info-primary .name a .job-title').each((index, ele) => {
    // console.log($(ele).text());
    //   let news = {
  //     title: $(ele).text(),        // 获取新闻标题
  //     // href: $(ele).attr('href')    // 获取新闻网页链接
  //   };
  })
  return hotNews
};

superagent.get('https://www.zhipin.com/c101210100-p100101/').end((err, resb) => {
  if (err) {
    // 如果访问失败或者出错，会这行这里
    console.log(`热点新闻抓取失败 - ${err}`)
  } else {
   hotNews = getHotNews(resb)
  
  }
});


app.get('/', (req, res) => {
  
});