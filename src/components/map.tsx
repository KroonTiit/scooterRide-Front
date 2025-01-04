import React,  {useState} from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "75vh",
};

export function Map(){
  const [userLocation, setUserLocation] = useState({ latitude: 59.436962 , longitude: 24.753574 });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return(<>
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{lat: userLocation.latitude, lng: userLocation.longitude}}
        zoom={10}
        options={{
          disableDefaultUI: true,
        }}
      >
        {userLocation && <Marker position={{lat: userLocation.latitude, lng: userLocation.longitude}} />}
      </GoogleMap>
    </LoadScript>
    {!userLocation && <button 
      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      onClick={getUserLocation}>Set my location</button>}
  </>
    
  )
}