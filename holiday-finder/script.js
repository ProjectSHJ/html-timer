// getHoliday().catch(error => {
//     console.error(error);
// })

// async function getHoliday() {
//     const response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2021/kr", { mode: "no-cors"})
//     console.log(response);
// }

function getHoliday() {
    let year = new Date().getYear() + 1900;
    let country = "kr";
    let url = "https://date.nager.at/api/v3/PublicHolidays/" + year + "/" + country;

    fetch(url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {
        document.getElementById("holidayResult").innerHTML = json;
        console.log(json);
    })
    .catch(error => {
        console.error(error);
    })
}