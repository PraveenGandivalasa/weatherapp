const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");


let currentTab=userTab;
const API_KEY="977c56b6b708e269efefc7b0bd397d9a";
currentTab.classList.add("current-tab");
getfromSessionStorage();

// creation a function to switch tabs
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
            
        if(!searchForm.classList.contains("active")){
        //if search form is ivisible then make it visible
             userInfoContainer.classList.remove("active");
             grantAccessContainer.classList.remove("active");
             searchForm.classList.add("active");

        }
        else{
            userInfoContainer.classList.remove("active");
            searchForm.classList.remove("active");
            //now am in your weather tab the it should also display weather,
            //so lets check local storage for coordinates, if we have saved
            getfromSessionStorage();


        }


    }

}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});
//check if coordinates aare already present in session storeage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        //if user coordinates are not found
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
    

}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader invisible
    loadingScreen.classList.add("active");

    //API 
    try{
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
         );
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }catch(err){
        console.log("not found");

    }

}

function renderWeatherInfo(weatherInfo){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");


    //fetch valuews from weatherInfo object and put in ui elements

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °c`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;

}
function getLocation(){
    if(navigator.geolocation){
        // console.log("hiii")
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert
        console.log("fdslvgxhbj")
    }

}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);


//search weeather function
const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    // console.log("i clicked")

    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName===""){
        // console.log(cityName)
        return;
    }
    
    else{
        fetchSearchWeatherInfo(cityName);

        // console.log(cityName)
    }
        
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // console.log("displaying")
        renderWeatherInfo(data);


    }
    catch(e){

    }

}



