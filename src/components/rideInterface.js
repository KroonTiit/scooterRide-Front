import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";

export function RideInterface({activeVehicle, code}){
  const [odometer, setOdometer] = useState();
  const [stateOfCharge, setStateOfCharge] = useState();
  const [powered, setPowered] = useState();
  const [range, setRange] = useState();



  useEffect(() => {
    const queryVehicleData = async () => {
      try {
        if(activeVehicle){
          const vehicleDocRef = doc(db, "vehicles", activeVehicle);
          const vehicleDoc = await getDoc(vehicleDocRef);
          setOdometer(vehicleDoc._document.data.value.mapValue.fields.odometer.doubleValue);
          setPowered(vehicleDoc._document.data.value.mapValue.fields.poweredOn.booleanValue);
          setStateOfCharge(vehicleDoc._document.data.value.mapValue.fields.soc.integerValue);
          setRange(vehicleDoc._document.data.value.mapValue.fields.estimatedRange.integerValue);
        } else {
          console.error("No such user document exists");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    queryVehicleData();
  }, [activeVehicle]);


  return <>
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight break-all">
          {activeVehicle ? `Paired with ${code}`: "Enter code to pair a Scooter"}
        </h2>
        {activeVehicle &&
          <div>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Charge: {stateOfCharge}%
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Odometer: {odometer}
              </div>
            </div>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Range: {range}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Powered: {powered ? "ON": "OFF"}
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  </>
}