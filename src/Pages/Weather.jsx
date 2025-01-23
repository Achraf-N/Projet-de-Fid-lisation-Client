import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "./Weather.module.css";
//import { Link } from "react-router-dom";
//import User from "../components/User";

const productsDetails = {
  id: 1,
  name: "Crème Solaire SPF 30",
  description: "Protection solaire modérée, idéale pour une exposition légère.",
  details: [
    "SPF 30, protège contre les UVB et UVA.",
    "Appliquer 15 minutes avant l'exposition.",
    "Renouveler toutes les 2 heures.",
    "Ne pas oublier les zones sensibles (visage, mains, oreilles).",
  ],
  Poster: "/productEcran1.jpg",
};

/*
function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤️"],
    [[2], "⛅"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦️"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧️"],
    [[71, 73, 75, 77, 85, 86], "🌨️"],
    [[95], "🌩️"],
    [[96, 99], "⛈️"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return arr ? icons.get(arr) : "❓";
}
*/

function getWeatherIcon(weatherbitIconCode) {
  const icons = new Map([
    // Map Weatherbit codes to icons
    ["c01d", "☀️"], // Clear sky (Day)
    ["c01n", "🌑"], // Clear sky (Night)
    ["c02d", "🌤️"], // Partly cloudy (Day)
    ["c02n", "🌤️"], // Partly cloudy (Night)
    ["c03d", "⛅"], // Cloudy (Day)
    ["c03n", "⛅"], // Cloudy (Night)
    ["c04d", "☁️"], // Overcast (Day)
    ["c04n", "☁️"], // Overcast (Night)
    ["d01", "🌦️"], // Light rain
    ["d02", "🌧️"], // Moderate rain
    ["d03", "🌧️"], // Heavy rain
    ["r01d", "🌧️"], // Showers
    ["r02d", "🌧️"], // Heavy rain
    ["r03d", "🌧️"], // Thunderstorm
    ["s01d", "🌨️"], // Snow
    ["s02d", "🌨️"], // Snow
    ["t01d", "⛈️"], // Thunderstorm
    ["t02d", "⛈️"], // Severe Thunderstorm
    ["t03d", "⛈️"], // Severe Thunderstorm
  ]);

  // Match the icon code to the corresponding icon
  const icon = icons.get(weatherbitIconCode);

  // Return the corresponding icon or "NOT FOUND" if no match
  return icon || "NOT FOUND";
}

/*
const products = [
  {
    id: 1,
    name: "Crème Solaire SPF 30",
    description:
      "Protection solaire modérée, idéale pour une exposition légère.",
    details: [
      "SPF 30, protège contre les UVB et UVA.",
      "Appliquer 15 minutes avant l'exposition.",
      "Renouveler toutes les 2 heures.",
      "Ne pas oublier les zones sensibles (visage, mains, oreilles).",
    ],
  },
  {
    id: 2,
    name: "Crème Solaire SPF 50+",
    description:
      "Protection solaire haute, idéale pour une exposition prolongée.",
    details: [
      "SPF 50+, protection maximale contre les UVB.",
      "Appliquer généreusement et uniformément.",
      "Réappliquez après avoir nagé ou transpiré.",
      "Ne convient pas aux peaux sensibles aux produits chimiques.",
    ],
  },
];
*/
function useGeolocation() {
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({});

  console.log(error);
  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    //setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        //  setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        console.log(error);
        //setIsLoading(false);
      }
    );
  }
  return { position, getPosition };
}

function Weather() {
  const [isclose, setIsClose] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(loading, error);
  const {
    position: { lat, lng },
    getPosition,
  } = useGeolocation();

  return (
    <div className={styles.app}>
      <div className={styles.product}>
        <h1 className={styles.header}>
          Vérifiez votre utilisation de crème solaire.
        </h1>

        {/*<User />*/}
        {/*<Search />*/}
        <WeatherDetails
          isclose={isclose}
          setIsClose={setIsClose}
          lat={lat}
          lng={lng}
          getPosition={getPosition}
          weatherData={weatherData}
          setWeatherData={setWeatherData}
          setLoading={setLoading}
          setError={setError}
          setData={setData}
        />
      </div>

      {isclose && weatherData && (
        <FormSplitBill
          lat={lat}
          lng={lng}
          weatherData={weatherData}
          data={data}
        />
      )}
    </div>
  );
}

function WeatherDetails({
  isclose,
  setIsClose,
  lat,
  lng,
  getPosition,
  weatherData,
  setWeatherData,
  setLoading,
  setError,
  setData,
}) {
  //const [elevation, setElevation] = useState("");
  const [countClicks, setCountClicks] = useState(0);
  const [selectdetail, setselectdetail] = useState(false);

  console.log(weatherData);
  console.log(countClicks);

  function handleClick() {
    getPosition();
    setselectdetail(!selectdetail);
    setIsClose(!isclose);
    setCountClicks((count) => count + 1);
    GetProduct();
  }

  async function GetProduct() {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token"); // Retrieve the token from localStorage

    // Check if token exists
    if (!token) {
      setError("Token not found");
      setLoading(false);
      return;
    }

    try {
      // Send the request
      const response = await fetch(
        "http://localhost:5296/api/products/GetbyRef/qwerty",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data get product");
      }

      const result = await response.json();

      setData(result); // Set the retrieved data
    } catch (err) {
      setError(err.message); // Set the error message if something goes wrong
    } finally {
      setLoading(false); // Stop loading
    }
  }

  useEffect(
    function () {
      async function fetchWeather() {
        try {
          if (!lat || !lng) return;
          const res = await fetch(
            `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=a16dcd3b8a18431daf026a3e021adec2`
          );
          if (!res.ok) throw new Error("Failed to fetch weather data");
          const data = await res.json();

          console.log(data);
          setWeatherData(data);
        } catch (err) {
          console.error(err);
        }
      }

      fetchWeather();
    },
    [lat, lng, setWeatherData]
  );

  return (
    <div className={styles.card}>
      <Search handleClick={handleClick} isclose={isclose} />
    </div>
  );
}

function Search({ handleClick, isclose }) {
  return (
    <main>
      <button onClick={handleClick}>{isclose ? "Close" : "Details"}</button>
    </main>
  );
}

function FormSplitBill({ lat, lng, weatherData, data }) {
  //const [product1, setProduct1] = useState({});
  console.log(lat, lng);
  //const [selectedId1, setSelectedId1] = useState(null);
  //const [isLoading, setIsLoading] = useState(false);

  const {
    data: [
      {
        uv,
        temp,
        weather: { icon },
      },
    ],
  } = weatherData;

  //Get Product

  /*
  useEffect(
    function () {
      async function getProductdetails() {

        if(selectedId===null) return
        setIsLoading(true);
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        // Check if token exists
        if (!token) {
          setIsLoading(false);
          return;
        }

        try {
          const res = await fetch(
            `http://localhost:5296/api/products/${selectedId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch data get product");
          }
          const data = await res.json();

          setProduct1(data);
          setIsLoading(false);
        } catch (err) {
          console.log(err.message); // Set the error message if something goes wrong
        } finally {
          setIsLoading(false); // Stop loading
        }
      }
      getProductdetails();
    },
    [selectedId]
  );

  */
  //fetch elevation
  /*
  useEffect(
    function () {
    
      getDosageRecommendation;
    },
    [selectedId1, uv]
  );
*/
  function getDosageRecommendation() {
    // Fetch UV index from API
    const hours = new Date().getHours();

    if (hours < 10 || hours > 23)
      return "Évitez l'application de crème solaire pendant les premières heures du matin et en soirée, lorsque l'exposition au soleil est moins intense.";
    if (uv > 7) {
      return "UV élevé ! Appliquez un SPF 30 ou plus toutes les 2 heures.";
    } else if (uv > 3) {
      return "UV modéré. Appliquez un SPF 15 ou plus.";
    } else {
      return "UV faible. Un SPF 15 suffit.";
    }

    //return "Appliquez régulièrement de la crème solaire pour vous protéger pendant les heures de fort ensoleillement.";
  }
  /*
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = this.props.weather;
   */
  /*
  const handleClick1 = () => {
    localStorage.setItem("selectedID", selectedId1);
  };
  */
  return (
    <div className={styles.product}>
      <div className={styles.try}>
        <h3>Details Product</h3>
        <Product data={data} />
      </div>
      <div>
        <span>details Weather UV : {uv}</span>
        <span> {getWeatherIcon(icon)}</span>
        <span>{temp}&deg;</span>
      </div>
      <h3>indications de protection solaire</h3>
      {
        <div className={styles.details}>
          <h1>{getDosageRecommendation()}</h1>
          {/*
          <Link to="/product" className="cta" onClick={handleClick1}>
            Click ICI
          </Link>*/}
        </div>
      }
    </div>
  );
}

function Product({ data }) {
  console.log(data);
  const { productName, price } = data;
  return (
    <li>
      <img
        src={productsDetails.Poster}
        alt={`${productsDetails.name} poster`}
      />
      <h3>{productName}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{price}</span>
        </p>
      </div>
    </li>
  );
}

Search.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isclose: PropTypes.func.isRequired,
};
Search.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isclose: PropTypes.func.isRequired,
};
Product.propTypes = {
  data: PropTypes.func.isRequired,
};

WeatherDetails.propTypes = {
  isclose: PropTypes.func.isRequired,
  setIsClose: PropTypes.func.isRequired,
  lat: PropTypes.func.isRequired,
  lng: PropTypes.func.isRequired,
  setWeatherData: PropTypes.func.isRequired,
  weatherData: PropTypes.func.isRequired,
  getPosition: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

FormSplitBill.propTypes = {
  lat: PropTypes.func.isRequired,
  lng: PropTypes.func.isRequired,
  weatherData: PropTypes.func.isRequired,
  data: PropTypes.func.isRequired,
};

export default Weather;

/*

function WeatherDetails() {
  const [elevation, setElevation] = useState("");
  const [countClicks, setCountClicks] = useState(0);
  const [selectdetail, setselectdetail] = useState(false);
  const [isclose, setIsClose] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  console.log(weatherData);
  console.log(countClicks);
  console.log(elevation);
  const {
    position: { lat, lng },
    getPosition,
  } = useGeolocation();

  function handleClick() {
    setselectdetail(!selectdetail);
    setIsClose(!isclose);
    setCountClicks((count) => count + 1);
    getPosition();
  }

  useEffect(
    function () {
      async function fetchCurrentElevation() {
        // setLoading(true);
        try {
          const res = await fetch(
            `https://api.open-elevation.com/api/v1/lookup?locations=${lat.toFixed(
              4
            )},${lng.toFixed(4)}`
          ).catch(() => {
            throw new Error("this is where error happened");
          });
          const data = await res.json();
          if (data) {
            console.log("Atitude is : ", data.results[0].elevation);
            setElevation(data.results[0].elevation);
            // setLoading(false);
          }
        } catch (e) {
          console.log(e);
        }
      }
      fetchCurrentElevation();
    },
    [setElevation, lat, lng]
  );

  useEffect(
    function () {
      async function fetchCurrentweather() {
        //  setLoading(true);
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=e34b4c51d8c2b7bf48d5217fe52ff79e`
            // `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=e34b4c51d8c2b7bf48d5217fe52ff79e`
          ).catch(() => {
            throw new Error("this is where error happened");
          });
          const data = await res.json();
          if (data) {
            console.log("data", data);
            setWeatherData(data);
            //  setLoading(false);
          }
        } catch (e) {
          console.log(e);
        }
      }
      fetchCurrentweather();
    },
    [setWeatherData, lat, lng]
  );

  return (
    <div className={styles.card}>
      <Search handleClick={handleClick} isclose={isclose} />
      {selectdetail && (
        <div className={styles.details}>
          <p className={styles.message}>
            {isdossage
              ? HoursDate < 10
                ? "Évitez d'utiliser de la crème solaire avant 10 h"
                : "Évitez d'utiliser de la crème solaire après 16 h"
              : "Utilisez 5 fois par jour pour une meilleure protection."}
          </p>
        </div>
      )}
      {selectdetail &&
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
    </div>
  );
}
*/
