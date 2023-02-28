import React, {useState, useEffect} from 'react'
import axios from 'axios';

const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast?";
const WEATER_API_PARAMS = "&past_days=1&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode";

const SEARCH_API_URL = "https://geocoding-api.open-meteo.com/v1/search?name="

function Main() {
  const[load, setLoad] = useState(false);
  const[weaterData, setWeatherData] = useState({});
  const[selectedLocation, setSelectedLocation] = useState(0);
  const[locations, setLocations] = useState([
    {Name : "Austin", lat: 30.27, long: -97.74},
    {Name : "Chicago", lat: 41.85003, long: -87.65005},
    {Name : "New York", lat: 40.71427, long: -74.00597}
  ]);
  /*
    location : {
        Name: string,
        latitude: number,
        longitude:number,
    }
  */
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const day = currentDate.toLocaleString('default', { weekday: 'long' });
  const dayNumber = currentDate.getDate();
  const hour = currentDate.getHours();

  const GetWeatherData = (i) =>{
    let item = locations[i];
    console.log("get");
    setLoad(false);
    axios.get(`${WEATHER_BASE_URL}latitude=${item.lat}&longitude=${item.long}${WEATER_API_PARAMS}`).then(
        (res) => {
          console.log(res.data); 
          setWeatherData(res.data);
          setLoad(true);
        }
    ).catch((err) => {
        console.log(err);
    })
  }

  const add = () => {
    let text = document.getElementById("input").value;
    console.log(text)
    axios.get(`${SEARCH_API_URL}${text}`).then(
        (res) => {
          console.log(res.data); 
          if(!res.data.results){
            alert(`No results found for ${text}`)
          }
          else{
            let newCity = {Name: res.data.results[0].name, lat: res.data.results[0].latitude, long: res.data.results[0].longitude}
            setLocations([...locations, newCity]);
          }
        }
    ).catch((err) => {
        console.log(err);
    })
  }

  const selectIndex = (i) =>{
    setSelectedLocation(i);
    GetWeatherData(i);
  }

  useEffect(() => {
    console.log("load");
    GetWeatherData(0);
  }, [])

  const CtoF = (c) =>{
    return Math.round( ((c) * 9/5 + 32));
  }
  
  return (
    <div className="w-screen h-screen bg-zinc-900 text-white flex flex-row p-10">
        <div className='flex flex-col p-4 space-y-2'>
            <div className = 'text-4xl font-bold pl-2 mb-6'>Locations</div>
            {locations.map((location, i) => {
                return <div className={`p-2 text-2xl rounded-lg cursor-pointer
                       hover:bg-blue-400 transition-all duration-1000 ${selectedLocation === i ? "bg-blue-600" : "bg-gray-600"}`} key={i} onClick = {() => selectIndex(i)}>{location.Name}</div>
            })}
        </div>
        <div className='flex flex-grow flex-col p-4 px-8 space-y-2'>
          <div className='flex flex-row w-full mb-4'>
            <input type={"text"} className = "font-bold bg-gray-600 rounded-lg text-xl p-2 grow"
              id = "input" placeholder='Search'
            ></input>
            <button className = "bg-blue-600 rounded-lg text-xl p-2 ml-4 px-4"
              onClick={() => add()}
            > + </button>
          </div>
          <div className='text-4xl font-bold'>{`${day}, ${month} ${dayNumber}`}</div>
          {load && <div className='text-8xl font-bold'>{`${CtoF(weaterData.hourly.temperature_2m[hour])} °F`}</div>}
          
          <div className='flex flex-col w-1/4'>
            {load && weaterData.hourly.time.slice(0,24).map((time, i) => {
              return <div className={`flex flex-row w-auto justify-between text-lg rounded-md px-2 ${hour == i ? "bg-blue-700" : ""}`}>
                  <div className='mr-10'>{`${i%12 + 1} ${(i >= 11) & i != 23 ? "PM":"AM"}`} </div>
                  <div>{`${CtoF(weaterData.hourly.temperature_2m[i])}°F`}</div>
                </div>
            })}
            {!load && <div className='animate-pulse w-full h-[800px] bg-slate-800 rounded-lg'></div>}
          </div>
        
        </div>
    </div>
  )
}

export default Main