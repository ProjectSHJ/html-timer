// getHoliday().catch(error => {
//     console.error(error);
// })

// async function getHoliday() {
//     const response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2021/kr", { mode: "no-cors"})
//     console.log(response);
// }
function appendChild() {

}

function getApi() {
    let url = "https://freegeoip.app/json/"

    fetch(url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {
        var ul = document.createElement("ul");
            ul.setAttribute("id", "ul");
        var liKeyHeader = document.createElement("li");
            liKeyHeader.setAttribute("id", "key");
            liKeyHeader.innerHTML = "Key";
        var liValueHeader = document.createElement("li")
            liValueHeader.setAttribute("id", "value");
            liValueHeader.innerHTML = "Value";

        document.getElementById("apiResponse").appendChild(ul);
        document.getElementById("ul").appendChild(liKeyHeader);
        document.getElementById("ul").appendChild(liValueHeader);

        var x = Object.keys(json).length;
        console.log("Key가 " + x + "개");
        console.log(JSON.stringify(json));

        for (i = 0; i <= x; i++) {
            var key = Object.keys(json)[i];
            var value = Object.values(json)[i];
            console.log(key);
            console.log(value);

            var liKeyRow = document.createElement("li");
                liKeyRow.setAttribute("class", "key");
                liKeyRow.innerHTML = key;
            var liValueRow = document.createElement("li")
                liValueRow.setAttribute("class", "value");
                liValueRow.innerHTML = value;

            document.getElementById("ul").appendChild(liKeyRow);
            document.getElementById("ul").appendChild(liValueRow);
        }
    })
}