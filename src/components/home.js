import { useState } from "react";
import { useAuth } from "../context/authContext.js";
import { db } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import {RideInterface} from "./rideInterface.js"
import axios from "axios";
import { Map } from "./map.js";

export function Home() {
  const { currentUser } = useAuth();
  const [code, setCode] = useState('');
  const [activeVehicle, setActiveVehicle] = useState();
  const [command, setCommand] = useState("START");
  


  const pairWithScooter = async () => {
      await axios.post(`${process.env.REACT_APP_API_URL}/pair?apiKey=${currentUser.stsTokenManager.accessToken}`, {
        vehicleCode: code,
      }).then((success) => {
        if (success.status < 300) {
          queryActiveVehicleId();
        }
      }).catch((error) => {
        console.error("Error pairing:", error);
      });
  };

  const queryActiveVehicleId = async () => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const activeVehicle = userDoc.data().activeVehicle;
        setActiveVehicle(activeVehicle);

      } else {
        console.error("No such user document exists");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const unPairWithScooter = async () => {
    if(command === "STOP"){
      toggleScooterState();
    }
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/pair?apiKey=${currentUser.stsTokenManager.accessToken}`,
      { data: { vehicleId: activeVehicle } }
    ).then((success) => {
        if (success.status < 300) {
          setActiveVehicle();
        }
    }).catch((error) => {
      console.log(error);
    });
  };

  const toggleScooterState = async () => {
      await axios.post(`${process.env.REACT_APP_API_URL}/send-commands?apiKey=${currentUser.stsTokenManager.accessToken}`, {
        vehicleId: activeVehicle, 
        command: command
      }).then((success) =>{
        if (success.status < 300) {
         setCommand((prevCommand) => (prevCommand === "START" ? "STOP" : "START"));
        }
      }).catch((error) =>{
        console.log(error);
      });
  };


  const onToggleScooterState = async (e) => {
    e.preventDefault();
    if (code.length !== 0) {
      await toggleScooterState();
    }
  }

  const onSubmitCode = async (e) => {
    e.preventDefault();
    await pairWithScooter();
  }

  const onUnPair = async (e) => {
    e.preventDefault();
    await unPairWithScooter();
  }

  return <>
    <main className="w-full h-screen flex self-center place-content-center place-items-center">
      <div className="space-y-6">
        {activeVehicle && <Map/>}
        <RideInterface activeVehicle={activeVehicle} code={code}>MAP</RideInterface>
        <div className="space-y-6">
          <div className="mt-2">
            <input
              id="code"
              name="code"
              type="code"
              required
              autoComplete="code"
              placeholder="Insert scooter code & click Pair"
              value={code} onChange={(e) => setCode(e.target.value)}
              disabled= {activeVehicle}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
          {/* ternery for the pair/unpair button */}
            {!activeVehicle ? <button
              onClick={onSubmitCode}
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Pair
            </button>
            :
            <button
              onClick={onUnPair}
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              UnPair
            </button>
            }
          <button
            onClick={onToggleScooterState}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {command}
          </button>
        </div>
      </div>
    </main>
  </>;
}