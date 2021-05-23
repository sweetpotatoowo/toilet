// 預設台中火車站
// var userPostion = { lat: 24.13730614208061, lng: 120.68694615086643 };
var userPostion = { lat: 24.150851758093815, lng: 120.65511318658612 };
// 地圖Icon
var mapMarkers = [];
// 地圖
var map;
// 資料庫讀取
var features;
// 使用者自己改位置
var userChangePosition;
// uesrMarker
var uesrMarker;
// 定位後開起圖示移動
var flagMarkerDrag;
// 定位後開起圖示移動
var flagRefreshShortDis;

// 定位按鈕
$('#getPos').on('click', function () {
    // 關閉ModalBox
    $('#myDescription').css('display', 'none');
    // 先確認使用者裝置能不能抓地點
    if (navigator.geolocation) {
        // 跟使用者拿所在位置的權限
        navigator.geolocation.getCurrentPosition(showPos);
        // 使用者允許抓目前位置，回傳經緯度
        function showPos(position) {
            // 顯示最短距離
            $('#showNearbyToilet').css('z-index', '1')
            // 點擊後傳送值去開啟使用者點位移動
            flagMarkerDrag = 1
            // 將所在地設成比較的點
            let userPostion = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            // userPostion = new google.maps.LatLng(24.150752401355643, 120.65130438448386);   // test
            // // 點擊後傳送值去啟動更新最短距離
            flagRefreshShortDis = 1
            // 刷新地圖
            initMap();
        }
        // 使用者不提供權限，或是發生其它錯誤
        function error() {
            alert('無法取得你的位置');
        }
    }
    else {
        alert('Sorry, 你的裝置不支援地理位置功能。');
    }
})

// 匯入地圖
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        // 匯入地圖中心點位置
        center: userPostion,
        // 地圖預設顯示大小
        zoom: 16,
        // 地圖上顯示的最大縮放級別
        maxZoom: 20,
        // 地圖上顯示的最小縮放級別
        minZoom: 16,
        // 地圖顯示方式
        mapTypeId: 'roadmap',
        // 載入地圖樣式
        mapId: '2a8694f1e2bf0a85',
        // zoom in / out 控制
        zoomControl: true,
        // 地圖種類控制
        mapTypeControl: false,
        // 顯示比例尺
        scaleControl: true,
        // 街景控制
        streetViewControl: false,
        // 旋轉
        rotateControl: false,
        // 全螢幕控制 | IPhone沒有支援
        fullscreenControl: false,
    });
    // 載入路線服務與路線顯示圖層
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({
        // 隱藏預設的 A、B 點 marker
        suppressMarkers: true
    });
    directionsDisplay.setMap(map);
    // 載入圖示
    const iconBase = "https://maps.google.com/mapfiles/kml/shapes/";

    // 設定圖案路徑
    const icons = {
        parking: {
            name: "parking",
            icon: {
                url: './img/map_icons/parking.svg',
                scaledSize: new google.maps.Size(20, 20),
            },
        },
        library: {
            name: "library",
            icon: iconBase + "library_maps.png",
        },
        info: {
            name: "info",
            icon: iconBase + "info-i_maps.png",
        },
        III: {
            name: 'III',
            icon: {
                url: './img/map_icons/mapIcon.svg',
                scaledSize: new google.maps.Size(50, 50),
            },
        }
    };
    // 預設點
    features = [
        {
            id: '1',
            position: new google.maps.LatLng(
                24.150656711776193,
                120.65011554220239
            ),
            type: "info",
            storeName: '大新韓式烤肉',
            toiletType: '男女廁所',
        },
        {
            id: '2',
            position: new google.maps.LatLng(
                24.149312245731902, 120.6470380729678
            ),
            type: "info",
            storeName: '魚中魚貓狗水族大賣場-文心店',
            toiletType: '男女廁所',
        },
        {
            id: '3',
            position: new google.maps.LatLng(
                24.149905171710227,
                120.65271228088245
            ),
            type: "parking",
            storeName: '大新停車場',
            toiletType: '男女廁所',
        },
        {
            id: '4',
            position: new google.maps.LatLng(
                24.148712986656246, 120.6488188212761
            ),
            type: "parking",
            storeName: '大墩停車場',
            toiletType: '男女廁所',
        },
        {
            id: '5',
            position: new google.maps.LatLng(
                24.14956584399241,
                120.6550038824122
            ),
            type: "library",
            storeName: '市立圖書館西區分館',
            toiletType: '男女廁所',
        },
        {
            id: '6',
            position: new google.maps.LatLng(
                24.149978084456123, 120.64560457159337
            ),
            type: "library",
            storeName: '市立圖書館南屯分館',
            toiletType: '男女廁所',
        },
        {
            id: '7',
            position: new google.maps.LatLng(
                24.153904853119904, 120.65020144550226
            ),
            type: "III",
            storeName: '香港金寶茶餐廳(大業店)',
            toiletType: '男女廁所、親子廁所、無障礙廁所',
        },
        {
            id: '8',
            position: new google.maps.LatLng(
                24.14971051596317, 120.64962243961948
            ),
            type: "III",
            storeName: '家樂福大墩店',
            toiletType: '男女廁所、親子廁所、無障礙廁所',
        },
    ];
    // 暫存infowindow數量的變數
    var infoWindowsOpenCurrently;
    // 點擊ICON呼叫infoWindow
    let infoFunction = function (info, marker, request) {
        google.maps.event.addListener(marker, 'click', function () {
            //if variable is defined close
            typeof infoWindowsOpenCurrently !== 'undefined' && infoWindowsOpenCurrently.close();
            info.open(map, marker);
            //set current info window to temporary variable
            infoWindowsOpenCurrently = info;
            console.log(infoWindowsOpenCurrently);
            // 路線導航相關設定
            directionsService.route(request, function (result, status) {
                if (status == 'OK') {
                    // 回傳路線上每個步驟的細節
                    directionsDisplay.setDirections(result);
                    // 抓到要顯示距離的元素ID，取代其內容
                    let dura = document.getElementById('dura');
                    dura.innerText = result.routes[0].legs[0].duration.text;
                    // 抓到要顯示時間的元素ID，取代其內容
                    let dist = document.getElementById('dist');
                    dist.innerText = result.routes[0].legs[0].distance.text;
                    // 將元素寫在標籤內，然後在取代內容，重複生成的修正
                }
            });
        });
    };

    // 輸出陣列圖示ICON
    features.forEach((feature) => {
        // 圖示設定
        let mapMarker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map,
            type: [feature.type],
        });
        // 把圖標值輸出陣列
        mapMarkers.push(mapMarker);
        // infoWindow
        let infowindow = new google.maps.InfoWindow({
            content: `<div class="infoWindowStyle text-center">
                    <h3 class="mt-2 text-truncate">${feature.type}${feature.storeName}</h3>
                    <div class="text-justify">
                        <i class="m-2 text-primary fa-2x far fa-toilet-paper-alt">
                            <span class="h4 text-dark">${feature.toiletType}</span>
                        </i><br />
                        <i class="m-2 text-primary fa-2x fal fa-walking">
                            <span class="h4 text-dark" id="dist"></span>
                        </i><br />
                        <i class="m-2 text-primary fa-2x fal fa-hourglass">
                            <span class="h4 text-dark" id="dura"></span>
                        </i>
                    </div>
                    <button class="btn btn-warning btn-lg m-2" data-toggle="modal" data-target="#newsModal">問題回報</button>
                    </div>`,
            position: feature.position,
        });
        // 路線相關設定
        var request = {
            // 起始點
            origin: userPostion,
            // 目的地
            destination: feature.position,
            // 移動方式
            travelMode: 'WALKING',
        };
        infoFunction(infowindow, mapMarker, request);
    });

    // 使用者圖案
    const userPositionIcon = {
        url: './img/map_icons/userPositionIcon_Purple.gif',
        scaledSize: new google.maps.Size(40, 40),
    }

    // 製作預設/使用者圖標
    uesrMarker = new google.maps.Marker({
        // 匯入地圖中心點位置
        position: userPostion,
        // 繪製地圖
        map: map,
        // 換圖片
        icon: userPositionIcon,
        // 掉入動畫
        animation: google.maps.Animation.DROP,
        // Icon拖移效果
        draggable: false,
    });

    // flagMarkerDrag 在按下定位後，使用者點位移動，路徑細節設定
    if (flagMarkerDrag) {
        // 定位後使用者可自行移點
        uesrMarker.setDraggable(true);
        // 只顯示一個路徑細節
        if ($("#directionsPanel").val()) {
            $("#directionsPanel").html('')
        }
        // 移動點位 更新座標
        uesrMarker.addListener("dragend", (mapsMouseEvent) => {
            userChangePosition = mapsMouseEvent.latLng.toString()
            lngIndex = userChangePosition.search(" ") + 1
            userPostion = new google.maps.LatLng(userChangePosition.substr(1, 12), userChangePosition.substr(lngIndex, 12));
            console.log(userPostion);
            initMap()
        });
    }

    // flagRefreshShortDis 在按下定位後，顯示離使用者最短距離的地點
    if (flagRefreshShortDis) {
        // 把要計算的點存成陣列
        let destinations = [];
        Array.prototype.forEach.call(features, f => {
            destinations.push(f.position);
        });
        // 所在位置跟各點的距離
        const service = new google.maps.DistanceMatrixService();
        // 路徑設定
        service.getDistanceMatrix({
            origins: [userPostion],
            destinations: destinations,
            travelMode: 'WALKING', // 交通方式：BICYCLING(自行車)、DRIVING(開車，預設)、TRANSIT(大眾運輸)、WALKING(走路)
            unitSystem: google.maps.UnitSystem.METRIC, // 單位 METRIC(公里，預設)、IMPERIAL(哩)
            avoidHighways: true, // 是否避開高速公路
            avoidTolls: true // 是否避開收費路線
        }, callback);
        function callback(response, status) {
            let listName = '';
            // 把距離寫進json裡
            for (let i = 0; i < features.length; i++) {
                features[i].distance = response.rows[0].elements[i].distance.value;
                features[i].distance_text = response.rows[0].elements[i].distance.text;
                features[i].distance_time = response.rows[0].elements[i].duration.text;
            }
            // 按距離重排
            features = features.sort((a, b) => {
                return a.distance > b.distance ? 1 : -1;
            });
            // 在陣列依照距離重排後，顯示最近距離的1比資料
            for (let i = 0; i < 1; i++) {
                listName += `<div v-for="f in features" class="list-group-item text-center">
                                <h3 class="d-inline-block">距離最近的廁所</h3>
                                    <button class="btn btn-outline-danger float-right h1" id="closeShortDistance"><b>X</b></button>
                                    <hr class="bg-dark">
                                    <p class="h4">${features[i].storeName}</p>
                                    <p class="h4">
                                        ${features[i].distance}(m)
                                        <span class="ml-3">${features[i].distance_time}</span>
                                    </p>
                                    <button class="SHOW btn btn-outline-primary" id="shortDistance${i}" value="${features[i].id}" datd-distant="${features[i].position}">立即前往</button>
                                    <button class="btn btn-outline-warning d-none ml-3" id="hideShortDistance">收合路徑</button>
                                    <!-- 顯示路徑細節 -->
                                    <div id="directionsPanel"></div>
                                </div>`;
            }
            // 輸出HTML
            $('#showLocation').html(listName);
            // 按下最近距離地點的導航
            $(".SHOW").on("click", function () {
                $('#hideShortDistance').removeClass('d-none');
                if ($("#directionsPanel").val()) {
                    $("#directionsPanel").html('')
                }
                // 讀取ID
                let btnIdx = $(this).val();
                if (btnIdx) {
                    // 將ID-1=index
                    btnIdx -= 1;
                    // 載入路線服務與路線顯示圖層
                    var directionsService = new google.maps.DirectionsService();
                    var directionsDisplay = new google.maps.DirectionsRenderer({
                        // 隱藏預設的 A、B 點 marker
                        suppressMarkers: true,
                    });
                    // 導航開始
                    function show(idx) {
                        // 路線相關設定
                        var request = {
                            // 起始點
                            origin: userPostion,
                            // 目的地 要輸入地址才會是精準結果，經緯度會有大誤差
                            destination: response.destinationAddresses[idx],
                            // 移動方式
                            travelMode: 'WALKING',
                        };
                        // 路線導航
                        directionsService.route(request, function (result, status) {
                            console.log(result);
                            if (status == 'OK') {
                                // 更新地圖
                                directionsDisplay.setMap(map);
                                // 導航細節
                                directionsDisplay.setPanel(document.getElementById("directionsPanel"));
                                // 設定地圖值
                                $("#directionsPanel").prop("value", "true")
                                // 回傳路線上每個步驟的細節
                                directionsDisplay.setDirections(result);
                                $('')
                            }
                        });
                    }
                    // 執行導航
                    show(btnIdx)
                }
            })
            // 收合按鈕
            $('#hideShortDistance').on('click', function () {
                $('#directionsPanel').toggle();
            })
            // 關閉最短路徑
            $('#closeShortDistance').on('click',function () {
                $('#showNearbyToilet').css('z-index', '0').addClass('d-none')
                $('#showNearbyToiletAgain').css({
                    'top':'10px',
                    'right':'10%',
                    'z-index':'1',
                }).removeClass('d-none')
            })
            $('#showNearbyToiletAgain').on('click',function () {
                $('#showNearbyToilet').css('z-index','1',).removeClass('d-none')
                $('#showNearbyToiletAgain').css('z-index', '0').addClass('d-none')
            })
        }
    }
}

// 重新讀取
function setMapOnAll(map, type) {
    for (let i = 0; i < mapMarkers.length; i++) {
        if (mapMarkers[i].type == type) {
            mapMarkers[i].setMap(map);
        }
        if (type == 'allShowHide') {
            mapMarkers[i].setMap(map);
        }
    }
}
// 一鍵隱藏
function clearMarkers() {
    $("input[name='toiletType']").prop({ checked: false });
    $("input[name='toiletType']").removeAttr("checked");
    setMapOnAll(null, 'allShowHide');
}
// 一鍵顯示
function showMarkers() {
    $("input[name='toiletType']").attr({ checked: "" });
    $("input[name='toiletType']").prop({ checked: "checked" });
    setMapOnAll(map, 'allShowHide');
}
// 點擊選項 隱藏 / 顯示
$("input[name='toiletType']").on("click", function () {
    // console.log();
    let checkValue = $(`#toiletType_${$(this).val()}`);
    let checkType = $(this).val();
    let checkAttr = $(`#toiletType_${$(this).val()}`).attr("checked");
    // 點擊時checked屬性值為checked就隱藏，undefined就顯示
    if (checkAttr == 'checked') {  // 隱藏
        checkValue.removeAttr("checked");
        setMapOnAll(null, checkType)
    }
    if (checkAttr == undefined) {  // 顯示
        checkValue.attr({ checked: "checked" });
        setMapOnAll(map, checkType);
    }
})
// 送出回報
document.getElementById("okButton").addEventListener("click", function () {
    swal("感謝回報!", "", "success");
});