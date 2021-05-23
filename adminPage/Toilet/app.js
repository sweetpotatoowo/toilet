var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
var app = express();
app.listen(3000);
app.set("view engine", "ejs");

//解析json資料
app.use(bodyParser.json()); // 內容支援 JSON 格式
app.use(bodyParser.urlencoded({
    extended: false
})) // 解析表單內容

app.use(session({
    secret: "1234", //密碼
    resave: false,
    saveUninitialized: false,
    maxAge: 600 * 1000, //10分鐘到期

}))
// Web伺服器的靜態檔案置於 public 資料夾
app.use(express.static("public"));
// 建立資料庫連線
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'wc_db',
    multipleStatements: true
});
//    連線資料庫
connection.connect();

app.get("/", function (req, res) {
    errorMessage = "";
    res.render("index")
})

app.post("/", function (req, res) {
    let resSend = res;
    var Who = req.body.Username;
    var Ps = req.body.Password;
    // console.log(`who = ${Who} ; ps = ${Ps}`);
    // who && ps 須一致才登入
    var selectSQL = "select * from member where Username = Username and Password = Password"
    connection.query(selectSQL, function (req, res) {
        for (key in res) {
            if (Who == res[key].Username && Ps == res[key].Password) {
                resSend.render("login");
                break;
            } else {
                resSend.render("index");
                errorMessage = "帳號或密碼錯誤，請重新輸入！";
                break;
            }
        }
    })
})

app.get("/online", function (req, res) {
    connection.query('select * from customerservice where Replycontent ="";', function (error, rows) {
        if (error) {
            console.log(JSON.stringify(err));
            return;
        }
        data = rows;
        res.render("online", {
            data
        });
        // console.log(data);
    });
});

app.post("/online", function (req, res) {
    // 取得回覆內容與ID
    var replyContent = req.body.replyContent;
    var replyId = req.body.replyId;
    // console.log(replyId);
    // 設定日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var Minute = date.getMinutes();
    var second = date.getSeconds();
    var date = `${year}-${month}-${day} ${hour}:${Minute}:${second}`
    // console.log(date);
    //更新內容
    connection.query(`UPDATE customerservice SET Replycontent = '${replyContent}' WHERE Id='${replyId}'`)
    //更新日期
    connection.query(`UPDATE customerservice SET Replytime='${date}' WHERE Id='${replyId}'`)
})

app.get("/failureReport", function (req, res) {
    connection.query('select * from wc join reportstatus on wc.Id=reportstatus.Wcid where Status IN (2,3)', function (error, rows) {
        if (error) {
            console.log(JSON.stringify(err));
            return;
        }
        data = rows;
        res.render("failureReport", {
            data
        });
        // console.log(data);
    });
});

// select * from reportstatus join wc on wc.Id=reportstatus.Wcid where Status IN (2,3)