const express = require('express')
const app = express()
const cheerio = require('cheerio')
const superagent= require('superagent')
const xlsx = require('node-xlsx')

// 获取excel sheet1表格
let sheet = xlsx.parse('./id-city.xlsx')[0].data;


app.listen(3000, () => {
  console.log('App listening on port 3000!');
});


// 跨域
app.all("*", function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
  next()
})

// 模糊搜索区域
app.get('/search', (req, res) => {
  const { area } = req.query;
  // 过滤筛选条件
  let arr = sheet.filter(item => {
    if(item[2].includes(area)){
      return item
    }
  });
  // 将结果返回
  let result = [];
  if(arr.length){
    for(let i in arr){
      let obj = {
        value: arr[i][2],
        label: arr[i][2]
      }
      result.push(obj);
    }
  }
  res.status(200).json(result);
});

// 获取天气数据
app.get('/weather', (req, res) => {
  // 获取查询参数
  const { cityname } = req.query;
  // 找到该城市的那条记录
  let cityarr = sheet.find(item => item[2] == cityname);
  
  // 如果用户输入的城市名在excel中存在，就抓取数据，不存在则返回404
  if(cityarr){
    let cityid = cityarr[0];
    // 访问中国天气网抓取数据
    superagent.get(`http://www.weather.com.cn/weather/${cityid}.shtml`).end((err, response) => {
      if (err) {
        // 如果访问失败或者出错，会这行这里
        console.log(`天气抓取失败 - ${err}`);
        res.status(404).json();
      } else {
        let $ = cheerio.load(response.text);
        // 最高温度
        let max = [];
        // 找到目标数据所在的页面元素，获取数据
        $('ul li .tem span').each((index, ele) => {
          max.push(parseInt($(ele).text()))
        })
        // 最低温度
        let min = [];
        $('ul li .tem i').each((index, ele) => {
          min.push(parseInt($(ele).text()))
        })
        // 日期
        let date = [];
        $('.t .sky h1').each((index, ele) => {
          date.push($(ele).text())
        });

        res.status(200).json({
          min,
          date,
          max
        })
        // $('.job-primary .info-primary .name a .job-title').each((index, ele) => {
          // console.log($(ele).text());
          //   let news = {
        //     title: $(ele).text(),        // 获取新闻标题
        //     // href: $(ele).attr('href')    // 获取新闻网页链接
        //   };
        // })
      
      }
    });

  }else{
    res.status(404).json();
  }
  
  
  
  
});