/*
=================== Common functoins ===================
*/
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
};
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
};

function getCurrentTime() {
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth();
    var d = time.getDate();
    var hh = time.getHours();
    if (hh < 10) {
        hh = "0" + hh;
    }
    var mm = time.getMinutes();
    if (mm < 10) {
        mm = "0" + mm;
    }
    var ss = time.getSeconds();
    if (ss < 10) {
        ss = "0" + ss;
    }
    
    var currentTime = y + "년 " + m + "월 " + d + "일 | " + hh + ":" + mm + ":" + ss
    document.getElementById("apiReqeustTime").innerHTML = "API 정보 갱신 일시: " + currentTime;
}

function CreateTableFromJSON(json) {
    json = [json];
    // EXTRACT VALUE FOR HTML HEADER.
    var col = [];
    for (i = 0; i < json.length; i++) {
        for (let key in json[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (i = 0; i < json.length; i++) {

        tr = table.insertRow(-1);

        for (j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            var value = json[i][col[j]];
            if (typeof(value) == "object") {
                value = JSON.stringify(value);
            }
            else{}
            tabCell.innerHTML = value;
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    const apiResponse = document.getElementById("apiResponse");
    apiResponse.innerHTML = "";
    apiResponse.appendChild(table);
}

function appendList(json) {
    const ul = document.createElement("ul");
    ul.setAttribute("id", "ul");
    const liKeyHeader = document.createElement("li");
        liKeyHeader.setAttribute("id", "key");
        liKeyHeader.innerHTML = "Key";
    const liValueHeader = document.createElement("li")
        liValueHeader.setAttribute("id", "value");
        liValueHeader.innerHTML = "Value";

    document.getElementById("apiRespons").innerHTML = "";
    document.getElementById("apiResponse").appendChild(ul);
    document.getElementById("ul").appendChild(liKeyHeader);
    document.getElementById("ul").appendChild(liValueHeader);

    const x = Object.keys(json).length;
    console.log("Key: 총 " + x + "개");
    console.log(JSON.stringify(json));

    for (i = 0; i < x; i++) {
        const key = Object.keys(json)[i];
        let value;
            if (typeof(Object.values(json)[i]) == "object") {
                const y = Object.values(json)[i];
                value = JSON.stringify(y);
            }
            else {
                const y = Object.values(json)[i];
                value = y;
            }

        const liKeyRow = document.createElement("li");
            liKeyRow.setAttribute("class", "key");
            liKeyRow.innerHTML = key;
        const liValueRow = document.createElement("li")
            liValueRow.setAttribute("class", "value");
            liValueRow.innerHTML = value;

        document.getElementById("ul").appendChild(liKeyRow);
        document.getElementById("ul").appendChild(liValueRow);
    }
}

/*
=================== API Fetch functoins ===================
*/


async function getApi_ipInfo() {
    let url = "https://freegeoip.app/json/"
    var response = await fetch(url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    response = await response.json();
    
    console.log(response);
    getCurrentTime();
    // appendList(response);
    CreateTableFromJSON(response);
}

async function getApi_currentWeather() {
    var response = await fetch('https://freegeoip.app/json/', {
        mode: "cors",
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    response = await response.json();

    const lat = Object.values(response)[8];
    const lon = Object.values(response)[9];
    let key = "18ad4f9360c88c9ebd053c46af11eb08";
    let url = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon=" +lon + "&appid=" + key;

    var weather = await fetch (url, {
        mode: "cors",
        mothod: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
    weather = await weather.json();
    console.log(weather);
    getCurrentTime();
    // appendList(weather);
    CreateTableFromJSON(weather);
}