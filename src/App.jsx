import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./Pages/Product";
import GestionSystem from "./Pages/GestionSystem";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import AppLayout from "./Pages/AppLayout";
import PageNotFound from "./Pages/PageNotFound";
import { AuthProvider } from "./Contexts/FakeAuthContext";
import ProtectedRoute from "./Pages/ProtectedRoute";
import PrivateRoute from "./Components/PrivateRoute";

//import { useEffect, useState } from "react";

/*
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
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setPosition({
          lat: latitude,
          lng: longitude,
        });
        //  setIsLoading(false);
        sendLocationToBackend(latitude, longitude);
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

function sendLocationToBackend(lat, lng) {
  fetch("http://localhost:5296/api/location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ latitude: lat, longitude: lng }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Location sent successfully.");
      } else {
        console.error("Failed to send location.");
      }
    })
    .catch((error) => {
      console.error("Error sending location:", error);
    });
}
*/
function App() {
  //send to backen every day latitude and longtitude
  /*
  const {
    position: { lat, lng },
    getPosition,
  } = useGeolocation();

  console.log(lat, lng);
  useEffect(() => {
    // Function to check the current hour every 30 seconds
    const checkTimeAndRun = () => {
      const now = new Date();
      const currentHour = now.getHours();
      console.log("Current hour: ", currentHour);

      // If it's 11 AM, call getPosition to fetch location
      if (currentHour === 10) {
        console.log("It's 11 AM, fetching geolocation...");
        getPosition(); // Fetch location only if it's 11 AM
      }
    };

    // Call checkTimeAndRun every 30 seconds
    const interval = setInterval(checkTimeAndRun, 5000); // 30000 ms = 30 seconds

    // Cleanup interval when component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [getPosition]);
*/
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="gestionSystem"
            element={<PrivateRoute element={GestionSystem} />}
          />
          <Route path="product" element={<Product />} />
          <Route path="login" element={<Login />} />

          <Route
            path="app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
