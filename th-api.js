var TH_BASE_URL = "https://codecyprus.org/th/api/";

function handleList(caller) {
    let listener = function() {
        if (this.readyState === 4 && this.status === 200) {
            // If response received (success).
            let reply = JSON.parse(this.responseText);
            console.info("status: " + reply.status);
            let treasureHuntsArray = reply.treasureHunts;
            console.info("treasureHunts: " + treasureHuntsArray.length);
            let listHtml = "";
            for(let i = 0; i < treasureHuntsArray.length; i++) {
                console.info(treasureHuntsArray[i].name);
                listHtml +=
                    "<div class='treasureHuntItem' onclick='selectTreasureHunt(\"" + treasureHuntsArray[i].name + "\", \"" + treasureHuntsArray[i].uuid + "\")'>" +
                    "<b>" + treasureHuntsArray[i].name + "</b><br/><i>" + treasureHuntsArray[i].description + "</i>" +
                    "</div>";
            }
            document.getElementById("treasureHunts").innerHTML = listHtml;
        } else if (this.readyState === 4 && this.status !== 200) {
            // If response not received (error).
            console.error("Error");
            document.getElementById("message").innerText = "State: " + this.readyState + ", Status: " + this.status;
            document.getElementById("message").className = "errorMessage";
        } else if (this.readyState === 4) {
            // If response not received (error).
            console.error("State: " + this.readyState + ", Status: " + this.status);
            document.getElementById("message").innerText = "State: " + this.readyState + ", Status: " + this.status;
            document.getElementById("message").className = "errorMessage";
        }
        caller.disabled = false; // either way, enable back the caller button...
        document.getElementById("loader").hidden = true; // ...and hide the spinner
    };
    console.log("disable: " + caller.id);
    caller.disabled = true; // temporarily disable the caller button
    document.getElementById("loader").hidden = false; // ...and show the spinner
    list(listener);
}

function list(listener) {
    callApi(TH_BASE_URL + "list", listener);
}

function selectTreasureHunt(thName, thUuid) {
    console.log("selectTreasureHunt: " + thName + ", " + thUuid);
    document.getElementById("message").innerText = "Selected treasure hunt with name: " + thName + ", and uuid ending in: ..." + thUuid.substring(thUuid.length - 10); // last 10 chars
    document.getElementById("message").className = "infoMessage";
}

function handleStart(player, app, treasureHuntId, caller) {
    let listener = function() {
        if (this.readyState === 4 && this.status === 200) {
            // If response received (success).
            let reply = JSON.parse(this.responseText);
            console.info("status: " + reply.status);
            let treasureHuntsArray = reply.treasureHunts;
            console.info("treasureHunts: " + treasureHuntsArray.length);
            let listHtml = "<ul>";
            for(let i = 0; i < treasureHuntsArray.length; i++) {
                console.info(treasureHuntsArray[i].name);
                listHtml += "<li>" + treasureHuntsArray[i].name + "</li>";
            }
            listHtml += "</ul>";
            document.getElementById("message").innerHTML = listHtml;
        } else if (this.readyState === 4 && this.status !== 200) {
            // If response not received (error).
            console.error("Error");
            document.getElementById("message").innerText = "State: " + this.readyState + ", Status: " + this.status;
            document.getElementById("message").className = "errorMessage";
        } else if (this.readyState === 4) {
            // If response not received (error).
            console.error("State: " + this.readyState + ", Status: " + this.status);
            document.getElementById("message").innerText = "State: " + this.readyState + ", Status: " + this.status;
            document.getElementById("message").className = "errorMessage";
        }
    };
    document.getElementById("loader").hidden = false; // temporarily show the spinner
    start(player, app, treasureHuntId, listener());
}

function start(player, app, treasureHuntId, listener) {
    callApi(TH_BASE_URL, + "start?player=" + player + "&app=" + app + "&treasureHuntId=" + treasureHuntId, listener);
}

function callApi(url, listener) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = listener;
    httpRequest.open("GET", url, true);
    httpRequest.send();
}