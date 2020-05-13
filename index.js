var http =require('http');
var fs =require('fs');

var curentPage=1; //当前图片页数
var maxcurentPage=5;//最大页数
//获取图片地址
function getData(){
    let url = 'http://www.nipic.com/photo/xiandai/jiaotong/index.html?page='+curentPage
    http.get(url,(res)=>{
        var data = '';
        res.on('data',(a)=>{
            data+=a.toString();
        })
        res.on('end',()=>{
            let reg = /<img src="(.+?)" data-src="(.*?)"  alt="(.*?)" \/>/g
            let arr=[];
            while (reg.exec(data)){
                arr.push(reg.exec(data)[2]);
            }
            for(i in arr){
                (function(i){
                    setTimeout(()=>{
                        getImg(arr[i])
                    },500*i)
                })(i)
            }
            if (curentPage < maxcurentPage){
                curentPage++;
                arguments.callee();
            }
        })
    })
}
//图片写入img文件夹
function getImg(url){
    let u = url.replace(/\/pic\//,'/file/')
        .replace(/_4.jpg/,'_2.jpg');
    http.get(u,(res)=>{
        let name = new Date().getTime();
        let stream = fs.createWriteStream('./img/' + name + '.png');
        res.pipe(stream);
    })
}
getData();