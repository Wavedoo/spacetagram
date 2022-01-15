//Inital setup with default mode being random images
const API_TOKEN = "TfTsHtqDPttmSZcKm77S99loINsheU9QC02NcpcF";
var display = document.getElementById("displayArea");
var url = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&count=5`;
getData(url);

var likedDates = []
if(localStorage.getItem("likes") != null){
    likedDates = JSON.parse(localStorage.getItem("likes"));
}

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

//Event listeners

//Changes the page to appropriately work for the random images
randomButton.addEventListener("click", function(){
    if(!randomButton.classList.contains("selected")){
        randomButton.classList.add("selected");
        dateButton.classList.remove("selected");
        likedButton.classList.remove("selected");

        clearArea(display);
        url = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&count=5`;
        getData(url);
        window.addEventListener("scroll", infiniteScroll);

        display.insertAdjacentElement("beforebegin", modeRandom);

        removeFromBody(searchBar);
        removeFromBody(modeDates);
        removeFromBody(modeLiked);
    }
    
});

//Changes the page to appropriately work for the search feature
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

        searchFunction();
    }
    
});

//Changes the page to appropriately work for the liked images
likedButton.addEventListener("click", function(){
    if(!likedButton.classList.contains("selected")){
        randomButton.classList.remove("selected");
        dateButton.classList.remove("selected");
        likedButton.classList.add("selected");

        clearArea(display);
        window.removeEventListener("scroll", infiniteScroll);
        display.insertAdjacentElement("beforebegin", modeLiked);
        
        removeFromBody(searchBar);
        removeFromBody(modeRandom);
        removeFromBody(modeDates);
        
        if(likedDates.length >= 1){
            modeLiked.innerHTML = "View all the images you liked!";
            for(let i = 0; i < likedDates.length; i++){
                url = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${likedDates[i]}&end_date=${likedDates[i]}`;
                getData(url);
            }
        }else{
            modeLiked.innerHTML = "Go like some images and come back when you do!";
        }

    }
    
});

search.addEventListener("click", searchFunction);


clear.addEventListener("click", function(){
    start.value = null;
    end.value = null;
});

toTop.addEventListener("click", function(){
    window.scrollTo(scrollX, 0);
});

window.addEventListener("scroll", infiniteScroll);

//Returns an appropraite date to be a valid parameter
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
    let year = date.getFullYear();  
    let month = date.getMonth() + 1;
    if(month < 10){
        month = '0' + month;
    }
    let day = date.getDate();
    if(day < 10){
        day = '0' + day;
    }
    
    let string_date = year + "-" + month + "-" + day;
    return string_date;
}

function searchFunction(){
    var maxDays = 31;
    var defaultDays = 10;
    var maxDiff = maxDays * 24 * 60 * 60 * 1000;
    var difference = defaultDays * 24 * 60 * 60 * 1000;
    clearArea(display);

    //Checks which dates have data and works appropriately
    if(start.value != "" && end.value != ""){
        if(Date.parse(start.value) > Date.parse(end.value)){
            //Does not search anything if the start date is after the end date
            window.alert("The end date needs to be after the start date");
            return;

        }else if(Date.parse(end.value) - Date.parse(start.value) > maxDiff){
            //Changes the end date to 31 day after the start date if it is too large
            let endValue = Date.parse(start.value) + maxDiff;
            end.value = dateToParameter(endValue);
            url = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;
            window.alert("The end date has been automatically changed to " + end.value)
        
        }else{
            //Executes normally if the dates are appropriate
            url = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;
        }

    }else if(start.value != ""){
        //Automatically picks end date
        let endValue = Date.parse(start.value) + difference;
        end.value = dateToParameter(endValue);
        url = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;

    }else if(end.value != ""){
        //Automatically picks start date
        let startValue = Date.parse(end.value) - difference;
        start.value = dateToParameter(startValue);
        url = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;
   
    }else{
        //Shows the current date's photo of the day
        url = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${today}&end_date=${today}`;
    }

    //Gets data from the url
    getData(url);
}

//Allows for infinite scrolling in random images mode
function infiniteScroll(){
    var offset = 1000;
    if(window.innerHeight + window.scrollY + offset >= document.body.offsetHeight){
        window.removeEventListener("scroll", infiniteScroll);
        getData(url);
        
        //Debounces the event listener when the if statement is true 
        setTimeout(function(){
            window.addEventListener("scroll", infiniteScroll);
        }, 1000);

    }
}

//Gets data from the url and outputs it to the display area
function getData(url){
    $.getJSON(url, function(data){
        $.each(data, function(index, picture){
            let article = document.createElement("article");
            
            let titleElement = document.createElement("h3");
            let titleText = document.createTextNode(decodeURI(picture["title"]));
            titleElement.appendChild(titleText);

            let fileElement;
            if(picture["media_type"] == "image"){
                fileElement = document.createElement("img");
                fileElement.setAttribute("src", picture['url']);
            }else{
                //Executes if media_type is a video
                fileElement = document.createElement("iframe");
                fileElement.setAttribute("src", picture["url"]);
                fileElement.setAttribute("title", picture["title"]);

            }

            let explanationElement = document.createElement("p");
            let explanationText = document.createTextNode(picture["explanation"]);
            explanationElement.appendChild(explanationText);

            let date = document.createTextNode("Date posted: " + picture["date"]);
            let dateElement = document.createElement("p");
            dateElement.appendChild(date);
            
            let buttonElement = document.createElement("button");
            let buttonText; 

            //Adds the appropriate text for the button
            if(likedDates.indexOf(picture["date"]) == -1){
                buttonText = document.createTextNode("Like");
            }else{
                buttonText = document.createTextNode("Unlike");
            }
            buttonElement.appendChild(buttonText);
            buttonElement.setAttribute("value", picture['date']);
            buttonElement.setAttribute("class", "like");
            

            article.appendChild(titleElement);
            article.appendChild(fileElement);
            article.appendChild(dateElement);
            article.appendChild(explanationElement);
            buttonElement = article.appendChild(buttonElement);

            buttonElement.addEventListener("click", like);

            display.appendChild(article);



        });
    }).fail(function(jqXHR, textStatus, error) {
        let errorElement = document.createElement("p");
        errorText = document.createTextNode(error);
        errorElement.appendChild(errorText);
        display.appendChild(errorElement);
    });
}

function like(){
    if(this.innerHTML == "Like"){
        //Adds liked image to array
        this.innerHTML = "Unlike";
        likedDates.push(this.value);   

    }else{ 
        //Removes unliked image from array
        this.innerHTML = "Like";
        let index = likedDates.indexOf(this.value);
        likedDates.splice(index, 1);
    }
    //Updates localStorage
    localStorage.setItem("likes", JSON.stringify(likedDates));
}

//Clears an area of all children
function clearArea(area){
    let child;
    while(child = area.firstChild){
        display.removeChild(child);
    }
}

//Checks if an element exists before removing it to avoid uncaught domexceptions
function removeFromBody(elementToRemove){
    if(document.body.contains(elementToRemove)){
        document.body.removeChild(elementToRemove);
    }
}