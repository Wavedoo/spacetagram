const API_TOKEN = "TfTsHtqDPttmSZcKm77S99loINsheU9QC02NcpcF";
var display = document.getElementById("displayArea");
//10 magic number
//Maybe 31?
var link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&count=10`;
getData(link);

var start = document.getElementById("startDate");
var end = document.getElementById("endDate");

var today = dateToParameter(Date.now());
var firstDay = "1995-06-16";

start.setAttribute("max", today);
end.setAttribute("max", today);


var search = document.getElementById("search");
/*Nope bad and annoying for the ser to use*/

/*start.addEventListener("change", function() {
    let days = 31;
    let difference = days * 24 * 60 * 60 * 1000 + Date.parse(start.value);
    let max = dateToParameter(difference);
    end.setAttribute("max", max);
});

end.addEventListener("change", function() {
    let days = 31;
    let difference = days * 24 * 60 * 60 * 1000 - Date.parse(end.value);
    let min = dateToParameter(difference);
    end.setAttribute("min", min);
});*/

search.onclick = function(){
    var maxDays = 31;
    var defaultDays = 10;
    var maxDiff = maxDays * 24 * 60 * 60 * 1000;
    var difference = defaultDays * 24 * 60 * 60 * 1000;
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
}

var clear = document.getElementById("clear");

clear.addEventListener("click", function(){
    start.value = null;
    end.value = null;
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
        //server needed ugh I'll figure this out later
        document.cookie = "superstar=you;"

    }else{
        this.innerHTML = "Like";
    }
}

function getData(link){
    var display = document.getElementById("displayArea");
    // let oldArticle = document.getElementById().
    $.getJSON(link, function(data){
        $.each(data, function(index, picture){
            let article = document.createElement("article");
            
            let title_element = document.createElement("h2");
            let title_text = document.createTextNode(picture["title"]);
            title_element.appendChild(title_text);

            let file_element;
            if(picture["media_type"] == "image"){
                file_element = document.createElement("img");
                file_element.setAttribute("src", picture['url']);
                file_element.setAttribute("height", "350px");
            }else{
                //VIDEO THUMBNAIL CLICK TO VIEW BLAH LAH BLAH
                file_element = document.createElement("video");
                file_element.setAttribute("height", "350px");
                file_element.setAttribute("controls", true);
                let source = document.createElement("source"); 
                source.setAttribute("src", picture['url']);
                let file_text = document.createTextNode("Sorry video could not be loaded");
                file_element.appendChild(source);
                file_element.appendChild(file_text);
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
    });
}

