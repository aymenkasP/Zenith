import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react';
import countries from "../../countries.json"
console.log("🚀 ~ file: index.js:6 ~ countries:", countries)

export default function Home() {
  const [Data, setData] = useState("");
  console.log("🚀 ~ file: index.js:10 ~ Home ~ Data:", Data)
  const [Country, setCountry] = useState("");
  console.log("🚀 ~ file: index.js:12 ~ Home ~ Country:", Country)

  const [Search, setSearch] = useState("");
  const [isDropdown, setIsDropdown] = useState(false);

  const getToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    return today
  };

  const convert = (unixTimestamp) => {
    const dateObj = new Date((unixTimestamp + Data.utc_offset_seconds) * 1000);
    const utcString = dateObj.toUTCString();
    const time = utcString.slice(-12, -4);
    return time
  };

  useEffect(() => {
    const getData = async () => {
      const today = getToday()
      console.log("🚀 ~ file: App.jsx:30 ~ getData ~ today:", today)
      const get = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${Country.latitude}&longitude=${Country.longitude}&daily=sunrise,sunset&current_weather=true&timeformat=unixtime&timezone=auto&start_date=${today}&end_date=${today}`
      );
      const res = await get.json();
      setData(res);
    };

    getData();

 
  }, [Country]);


  useEffect(() => {
    if(Search.length === 0 ) {
      setIsDropdown(false)
    }
  }, [Search])
  

  const zenith = Data?.daily?.sunset[0] - Data?.daily?.sunrise[0]


  return (
    <>
      <Head>
        <title>Zenith</title>
        <meta name="description" content="Zenith" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>



        <div className={styles.container} >



          <div>
            <h3>{Data.timezone}</h3>
            <p><b>temperature</b> : {Data?.current_weather?.temperature} °C  </p>
            <p><b>sunrise</b> : {convert(Data?.daily?.sunrise[0])}  </p>
            <p><b>sunset</b> : {convert(Data?.daily?.sunset[0])}  </p>
            <p><b>zenith</b> : {convert(Data?.daily?.sunrise[0] + (zenith / 2))}  </p>
          </div>

          <div className={styles.dropdown} >
            <div className={styles.dropdown__content} >
              <input type="text" placeholder="Search.." value={Search} onChange={({ target }) => {
      setIsDropdown(true)

                setSearch(target.value)}
              } 
               />
              <div style={{display : isDropdown ? 'block' : "none"}}  >
                {
                  countries.country.filter(item => item.country?.toLowerCase().includes(Search.toLowerCase())).slice(0, 20).map(country => {
                    return <p key={country.country} onClick={() => {
                      setCountry(country)
                      setIsDropdown(false)
                      setSearch("")
                    } 
                    } 
                    >{country.country}</p>
                  })
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
