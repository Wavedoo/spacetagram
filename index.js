//Inital setup
const API_TOKEN = "TfTsHtqDPttmSZcKm77S99loINsheU9QC02NcpcF";
var display = document.getElementById("displayArea");
var link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&count=10`;
getData(link);

var likedDates = [];
likedDates = localStorage.getItem("likes");


var randomButton = document.getElementById("randomButton");
var dateButton = document.getElementById("dateButton");
var likedButton = document.getElementById("likedButton");

//Stores the different explanations for each mode as a p element for later
var modeRandom = document.getElementById("modeRandom");
var modeDates = document.getElementById("modeDates");
var modeLiked = document.getElementById("modeLiked");

document.body.removeChild(modeDates);
document.body.removeChild(modeLiked);

//Saves selections bar to easily remove and add it
var searchBar = document.getElementById("searchBar");

var start = document.getElementById("startDate");
var end = document.getElementById("endDate");

var today = dateToParameter(Date.now());
var firstDay = "1995-06-16";

start.setAttribute("max", today);
end.setAttribute("max", today);

var search = document.getElementById("search");
var clear = document.getElementById("clear");

document.body.removeChild(searchBar);

var toTop = document.getElementById("toTop");


randomButton.addEventListener("click", function(){
    if(!randomButton.classList.contains("selected")){
        randomButton.classList.add("selected");
        dateButton.classList.remove("selected");
        likedButton.classList.remove("selected");
        //TODO: Change the objects that are shown.
        clearArea(display);
        window.addEventListener("scroll", infiniteScroll);
        link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&count=10`;
        getData(link);

        display.insertAdjacentElement("beforebegin", modeRandom);

        removeFromBody(searchBar);
        removeFromBody(modeDates);
        removeFromBody(modeLiked);
    }
    
});

dateButton.addEventListener("click", function(){
    if(!dateButton.classList.contains("selected")){
        randomButton.classList.remove("selected");
        dateButton.classList.add("selected");
        likedButton.classList.remove("selected");

        clearArea(display);
        window.removeEventListener("scroll", infiniteScroll);
        display.insertAdjacentElement("beforebegin", modeDates);
        display.insertAdjacentElement("beforebegin", searchBar);
    
        removeFromBody(modeRandom);
        removeFromBody(modeLiked);
    }
    
});

likedButton.addEventListener("click", function(){
    if(!likedButton.classList.contains("selected")){
        randomButton.classList.remove("selected");
        dateButton.classList.remove("selected");
        likedButton.classList.add("selected");
        //TODO: Change the objects that are shown.
        clearArea(display);
        window.removeEventListener("scroll", infiniteScroll);
        display.insertAdjacentElement("beforebegin", modeLiked);

        removeFromBody(searchBar);
        removeFromBody(modeRandom);
        removeFromBody(modeDates);
    }
    
});

search.addEventListener("click", function(){
    var maxDays = 31;
    var defaultDays = 10;
    var maxDiff = maxDays * 24 * 60 * 60 * 1000;
    var difference = defaultDays * 24 * 60 * 60 * 1000;
    //TODO CHECK IF NO DATE IS PICKED AND RECOMMMEND THEY USE RANDOM IMAGES
    //Checks which dates have data
    if(start.value != "" && end.value != ""){
        if(Date.parse(start.value) > Date.parse(end.value)){
            window.alert("The end date needs to be after the start date");
            return;
        }else if(Date.parse(end.value) - Date.parse(start.value) > maxDiff){
            let end_value = Date.parse(start.value) + difference;
            end.value = dateToParameter(end_value);
            link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;
            window.alert("The end date has been automatically changed to " + end.value)
        }else{
            link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;
        }
    }else if(start.value != ""){
        let end_value = Date.parse(start.value) + difference;
        end.value = dateToParameter(end_value);
        link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;

    //Checks if an end date is chosen
    }else if(end.value != ""){
        let start_value = Date.parse(end.value) - difference;
        start.value = dateToParameter(start_value);
        link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;
    }else if(Date.parse(start.value) > Date.parse(end.value)){
        window.alert("The end date needs to be after the start date");
        //TODO: ADD EVENTLISTENER FOR CHANGING DATE
    }
    getData(link);
});


clear.addEventListener("click", function(){
    start.value = null;
    end.value = null;
});

toTop.addEventListener("click", function(){
    //Add animation maybe?
    window.scrollTo(scrollX, 0);
});

window.addEventListener("scroll", infiniteScroll);

function infiniteScroll(){
    var offset = 1000;
    if(window.innerHeight + window.scrollY + offset >= document.body.offsetHeight){
        window.removeEventListener("scroll", infiniteScroll);
        getData(link);
        setTimeout(function(){
            window.addEventListener("scroll", infiniteScroll);
        }, 2500);

    }
}
//Returns an appropriate date to be a valid parameter
function dateToParameter(milliseconds){
    //Limits end date to the current date
    if(milliseconds > Date.parse(window.today)){
        return window.today;
    //Limits start date to June 16, 1995.
    }else if(milliseconds < Date.parse(window.firstDay)){
        return window.firstDay;
    }

    //Returns date in yyyy-mm-dd format
    let date = new Date(milliseconds);
    var year = date.getFullYear();  
    var month = date.getMonth() + 1;
    if(month < 10){
        month = '0' + month;
    }
    var day = date.getDate();
    if(day < 10){
        day = '0' + day;
    }
    
    var string_date = year + "-" + month + "-" + day;
    return string_date;
}

function like(){
    if(this.innerHTML == "Like"){
        this.innerHTML = "Unlike";
        likedDates.push(this.value);
        localStorage.setItem("likes", likedDates);
        console.log(likedDates);

    }else{
        this.innerHTML = "Like";
        likedDates.remove
    }
}

function clearArea(area){
    let child;
    while(child = area.firstChild){
        display.removeChild(child);
    }
}

function getData(link){
    var display = document.getElementById("displayArea");
    // let oldArticle = document.getElementById().
    $.getJSON(link, function(data){
        $.each(data, function(index, picture){
            let article = document.createElement("article");
            
            let title_element = document.createElement("h2");
            let title_text = document.createTextNode(decodeURI(picture["title"]));
            title_element.appendChild(title_text);

            let file_element;
            if(picture["media_type"] == "image"){
                file_element = document.createElement("img");
                file_element.setAttribute("src", picture['url']);
                file_element.setAttribute("height", "350px");
            }else{
                //VIDEO THUMBNAIL CLICK TO VIEW BLAH LAH BLAH
                file_element = document.createElement("iframe");
                file_element.setAttribute("height", "350px");
                file_element.setAttribute("src", picture["url"]);
                file_element.setAttribute("title", picture["title"]);

            }


            let explanation_element = document.createElement("p");
            let explanation_text = document.createTextNode(picture["explanation"]);
            explanation_element.appendChild(explanation_text);

            let date = document.createTextNode("Date posted: " + picture["date"]);
            let date_element = document.createElement("p");
            date_element.appendChild(date);
            
            let button_element = document.createElement("button");
            let button_text = document.createTextNode("Like");
            button_element.appendChild(button_text);
            button_element.setAttribute("value", picture['date']);
            button_element.setAttribute("class", "likes");
            

            article.appendChild(title_element);
            article.appendChild(file_element);
            article.appendChild(date_element);
            article.appendChild(explanation_element);
            button_element = article.appendChild(button_element);

            button_element.addEventListener("click", like);

            display.appendChild(article);



        });
    }).fail(function(jqXHR, textStatus, error) {
        let error_element = document.createElement("p");
        error_text = document.createTextNode(error);
        error_element.appendChild(error_text);
        display.appendChild(error_element);
    });
}

//Checks if an element exists before removing it to avoid uncaught domexceptions
function removeFromBody(elementToRemove){
    if(document.body.contains(elementToRemove)){
        document.body.removeChild(elementToRemove);
    }
}