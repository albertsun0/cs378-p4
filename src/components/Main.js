import React, {useState, useEffect} from 'react'
import axios from 'axios';

const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast?";
const WEATER_API_PARAMS = "&past_days=1&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode";
function Main() {
  const[load, setLoad] = useState(false);
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
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const day = currentDate.toLocaleString('default', { weekday: 'long' });
  const dayNumber = currentDate.getDate();
  useEffect(() => {
    console.log("load");
    axios.get(`${WEATHER_BASE_URL}latitude=30.27&longitude=-97.74${WEATER_API_PARAMS}`).then(
        (res) => {
          console.log(res.data); 
          setWeatherData(res.data);
          setLoad(true);
        }
    ).catch((err) => {
        console.log(err);
    })
  }, [])

  const CtoF = (c) =>{
    return Math.floor( ((c) * 9/5 + 32) * 1000)/1000;
  }
  

  return (
    <div className="w-screen h-screen bg-slate-900 text-white flex flex-row p-10">
        <div className='flex flex-col p-4'>
            <div className = 'text-4xl font-bold pl-2 mb-6'>Locations</div>
            {locations.map((location, i) => {
                return <div className='p-2 text-2xl' key={i}>{location.Name}</div>
            })}
        </div>
        <div className='flex flex-grow flex-col p-4 px-8'>
          <div className='text-4xl font-bold'>{`${day}, ${month} ${dayNumber}`}</div>
          <div className='flex flex-col w-full'>
            {load && weaterData.hourly.time.slice(0,24).map((time, i) => {
              return <div className='flex flex-row text-lg'>
                  <div className='mr-10'>{`${i%12 + 1} ${i >= 12 ? "PM":"AM"}`} </div>
                  <div>{`${CtoF(weaterData.hourly.temperature_2m[i])} °F`}</div>
                </div>
            })}
            {!load && <div className='animate-pulse w-40 h-80 bg-slate-800 rounded-lg'></div>}
          </div>
        
        </div>
    </div>
  )
}

export default Main