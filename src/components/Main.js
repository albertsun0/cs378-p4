import React, {useState, useEffect} from 'react'
import axios from 'axios';

const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast?";
const WEATER_API_PARAMS = "&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode";
function Main() {

  const[weaterData, setWeatherData] = useState({});
  const[locations, setLocations] = useState([
    {Name : "Austin", lat: 30.27, long: 97.74}
  ]);

  
  /*
    location : {
        Name: string,
        latitude: number,
        longitude:number,
    }
  */

  useEffect(() => {
    console.log("load");
    axios.get(`${WEATHER_BASE_URL}latitude=30.27&longitude=-97.74${WEATER_API_PARAMS}`).then(
        (res) => {console.log(res.data)}
    ).catch((err) => {
        console.log(err);
    })
  }, [])
  return (
    <div className="w-screen h-screen bg-white flex flex-row p-10">
        <div className='flex flex-col p-4'>
            <div className = 'text-3xl font-bold pl-2 mb-6'>Locations</div>
            {locations.map((location, i) => {
                return <div className='p-2 text-2xl' key={i}>{location.Name}</div>
            })}
        </div>
        <div>right</div>
    </div>
  )
}

export default Main