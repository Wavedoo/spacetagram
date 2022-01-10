const API_TOKEN = "TfTsHtqDPttmSZcKm77S99loINsheU9QC02NcpcF";
var display = document.getElementById("displayArea");
//10 magic number
//Maybe 31?
var link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&count=31`;
getData(link);

var start = document.getElementById("startDate");
var end = document.getElementById("endDate");

var today = dateToParameter(Date.now());
var firstDay = "1995-06-16";

start.setAttribute("max", today);
end.setAttribute("max", today);


var search = document.getElementById("search");
/*Nope bad and annoying for the ser to use*/
start.addEventListener("change", function() {
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
});

search.onclick = function(){
    let start_value = new Date(start.value).getTime();
    let end_value = new Date(end.value).getTime();
    //Limits it to retrieving 10 photos at
    //Checks if a start date is chosen
    if(start.value != "" && end.value != ""){
        let days = 30;
        let maxDiff = days * 24 * 60 * 60 * 1000;
        if(true){

        }
    }else if(start.value != ""){
        let days = 10;
        let difference = days * 24 * 60 * 60 * 1000;
        end_value = Date.parse(start.value) + difference;
        end.value = dateToParameter(end_value);
        link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;

    //Checks if an end date is chosen
    }else if(end.value != ""){
        let days = 10;
        let difference = days * 24 * 60 * 60 * 1000;
        start_value = Date.parse(end.value) - difference;
        start.value = dateToParameter(start_value);
        link = `https://api.nasa.gov/planetary/apod?api_key=${API_TOKEN}&start_date=${start.value}&end_date=${end.value}`;
    }else if(Date.parse(start.value) > Date.parse(end.value)){
        window.alert("The end date needs to be after the start date");
        //TODO: ADD EVENTLISTENER FOR CHANGING DATE
    }
    getData(link);
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


function getData(link){
    var display = document.getElementById("displayArea");
    // let oldArticle = document.getElementById().
    $.getJSON(link, function(data){
        $.each(data, function(index, picture){
            let article = document.createElement("article");
            
            let title_element = document.createElement("h2");
            let title_text = document.createTextNode(picture["title"]);
            title_element.appendChild(title_text);

            let file_element = document.createElement("img");
            file_element.setAttribute("src", picture['url']);
            file_element.setAttribute("height", "350px");

            let explanation_element = document.createElement("p");
            let explanation_text = document.createTextNode(picture["explanation"]);
            explanation_element.appendChild(explanation_text);

            let date = document.createTextNode("Date posted: " + picture["date"]);
            let date_element = document.createElement("p");
            date_element.appendChild(date);
            
            article.appendChild(title_element);
            article.appendChild(file_element);
            article.appendChild(date_element);
            article.appendChild(explanation_element);
            display.appendChild(article);

            if(picture["media_type"] == "image"){
                //TODO: MAKE IMAGE SPECFIC
            }else{
                //TODO: ADD VIDEO SUPPORT
            }


        });
    });
}

