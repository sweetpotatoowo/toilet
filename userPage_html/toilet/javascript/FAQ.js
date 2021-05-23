// goTop
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 20) {
            $('#toTopBtn').fadeIn();
        } else {
            $('#toTopBtn').fadeOut();
        }
    });

    $('#toTopBtn').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
        return false;
    });
});
// 留言板
$("#Send_button").click(function () {
    //按鈕id

    if ($("textarea").val() == "") {
        alert("内容不能能为空");
    } else {
        var contentValue = $("#opinion").val(); //內容id
        var titleValue = $("#access").val(); //姓名id
        $(".disappear:hidden").css("display", "block"); //按下按鈕顯示圖片
        $("#Send_name").text(titleValue);
        $("#Send_content").text(contentValue);
        // alert(contentValue + ";" + titleValue); //彈窗測試用(疊加)

        //把白版設定清空
        $("#opinion").val("");
        $("#access").val("");
        //傳送時間的ID值
        $("#hottime").text(str);
    }


});

// <!--------------------- 分隔線 ------------------------> */

// 功能二。西元年、時間設定。單獨顯示ok

function getFormatDate() {
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month =
        nowDate.getMonth() + 1 < 10
            ? "0" + (nowDate.getMonth() + 1)
            : nowDate.getMonth() + 1;
    var date =
        nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour =
        nowDate.getHours() < 10
            ? "0" + nowDate.getHours()
            : nowDate.getHours();
    var minute =
        nowDate.getMinutes() < 10
            ? "0" + nowDate.getMinutes()
            : nowDate.getMinutes();
    var second =
        nowDate.getSeconds() < 10
            ? "0" + nowDate.getSeconds()
            : nowDate.getSeconds();
    return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
    );
}
