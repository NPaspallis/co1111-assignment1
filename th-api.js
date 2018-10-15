const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
const TH_TEST_URL = "https://codecyprus.org/th/test-api/"; // the test API base url

/**
 * This is a function to handle the "/list" command of the API. The reply is retrieved and used to update the HTML page.
 *
 * @param caller if defined, it is disabled while the server request is in progress
 * @param test if defined (e.g. 'true') then the Test API is called instead of the actual API
 */
function handleList(caller, test) {

    let spinner = document.getElementById("loader"); // identify the spinner, if available

    if(caller !== undefined) caller.disabled = true; // temporarily disable the caller button
    if(spinner !== undefined) spinner.hidden = false; // ...and show the spinner

    let url = (test === undefined ? TH_BASE_URL : TH_TEST_URL) + "list"; // form the url
    console.log("the formed url is: " + url);

    let listener = function() {
        if (this.readyState === 4) {
            if(this.status === 200) {
                // If response received (success).
                let reply = JSON.parse(this.responseText);
                console.info("status: " + reply.status);
                let treasureHuntsArray = reply.treasureHunts; // access the "treasureHunts" array on the reply message
                console.info("treasureHunts: " + treasureHuntsArray.length);
                let listHtml = ""; // dynamically form the HTML code to display the list of treasure hunts
                for(let i = 0; i < treasureHuntsArray.length; i++) {
                    console.info(treasureHuntsArray[i].name);
                    listHtml += // each treasure hunt item is shown with an individual DIV element
                        "<div class='treasureHuntItem'" + // the DIV is styled in CSS
                        // below is the code to handle the click -- essentially call the 'selectTreasureHunt' JavaScript function
                        " onclick='selectTreasureHunt(\"" + treasureHuntsArray[i].name + "\", \"" + treasureHuntsArray[i].uuid + "\")'>" +
                        "<b>" + treasureHuntsArray[i].name + "</b><br/>" + // the treasure hunt name is shown in bold...
                        "<i>" + treasureHuntsArray[i].description + "</i>" + // and the description in italics in the next line
                        "</div>";
                }
                document.getElementById("treasureHunts").innerHTML = listHtml;
            } else { // assert status != 200
                // If response received but not OK, show the error...
                console.error("error: state: " + this.readyState + ", status: " + this.status);
                document.getElementById("message").innerText = "state: " + this.readyState + ", status: " + this.status;
                document.getElementById("message").className = "errorMessage"; // set element's class (handled by CSS)
            }
            if(caller !== undefined) caller.disabled = false; // either way, enable back the caller button...
            if(spinner !== undefined) spinner.hidden = true; // ...and hide the spinner
        }
    };

    // create and invoke the http request
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = listener;
    httpRequest.open("GET", url, true);
    httpRequest.send();
}

/**
 * A function specified to handle the selection of one of the listed treasure hunts. At this point, it simply updates
 * a 'message' element to display the name and the UUID of the selected treasure hunt.
 *
 * @param thName is the name of the selected treasure hunt
 * @param thUuid is the UUID of the selected treasure hunt
 */
function selectTreasureHunt(thName, thUuid) {
    console.log("selectTreasureHunt: " + thName + ", " + thUuid);
    document.getElementById("message").innerText = "Selected treasure hunt with name: " + thName +
        ", and uuid ending in: ..." + thUuid.substring(thUuid.length - 10); // last 10 chars
    document.getElementById("message").className = "infoMessage"; // set element's class (handled by CSS)
}

/**
 * This is a sample function to handle the "/start" command of the API. The reply is retrieved and converted to a JSON
 * object.
 *
 * @param params contains the required parameters as JavaScript object, i.e. { "player": ..., "app": ...,
 * "treasureHuntId": ....}.
 * @param caller is the object (e.g. button) that triggered the call - the reason it is needed is so that the
 * corresponding object is disabled while the call is active (i.e. while the client contacts the server)
 * @param test defines whether this should call the Test API ort the actual API
 */
function handleStart(params, caller, test) {

    let spinner = document.getElementById("loader"); // identify the spinner, if available

    if(caller !== undefined) caller.disabled = true; // temporarily disable the caller button
    if(spinner !== undefined) spinner.hidden = false; // ...and show the spinner

    let url = (test === undefined ? TH_BASE_URL : TH_TEST_URL) + "start?player=" + params["player"]
        + "&app=" + params["app"] + "&treasureHuntId=" + params["treasureHuntId"]; // form the url
    console.log("the formed url is: " + url);

    let listener = function() {
        if (this.readyState === 4) {
            if(this.status === 200) {
                // If response received (success).
                let reply = JSON.parse(this.responseText);
                console.info("status: " + reply["status"]);
                if(reply["status"] === "ERROR") {
                    // If response received but not OK, show the error...
                    let errorMessages = reply["errorMessages"];
                    let errorHtml = "<ul>";
                    for(let i = 0; i < errorMessages.length; i++) {
                        console.error("error[" + i + "]: " + errorMessages[i]);
                        errorHtml += "<li>" + errorMessages[i] + "</li>";
                    }
                    errorHtml += "</ul>";
                    document.getElementById("message").innerHTML = errorMessages;
                    document.getElementById("message").className = "errorMessage"; // set element's class (handled by CSS)
                } else {
                    let session = reply["session"]; // access the "session" id
                    let numOfQuestions = reply["numOfQuestions"]; // access the "numOfQuestions"
                    console.info("session: " + session);
                    console.info("numOfQuestions: " + numOfQuestions);
                    document.getElementById("session").innerHTML = "started <b>..." + session.substring(session.length - 10) + "</b> with " + numOfQuestions + " questions";
                }
            } else { // assert status != 200
                // If response received but not OK, show the error...
                console.error("error: state: " + this.readyState + ", status: " + this.status);
                document.getElementById("message").innerText = "state: " + this.readyState + ", status: " + this.status;
                document.getElementById("message").className = "errorMessage"; // set element's class (handled by CSS)
            }
            if(caller !== undefined) caller.disabled = false; // either way, enable back the caller button...
            if(spinner !== undefined) spinner.hidden = true; // ...and hide the spinner
        }
    };

    // create and invoke the http request
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = listener;
    httpRequest.open("GET", url, true);
    httpRequest.send();
}