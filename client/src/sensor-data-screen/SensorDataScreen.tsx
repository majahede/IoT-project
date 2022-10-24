import React, { useEffect, useState } from 'react';
import {SensorData, SensorDataList} from "../api/api-interfaces.ts/sensorData";
import {getHumidityValues} from "../api/sensorApiCalls";
import {Line} from "react-chartjs-2";
import {options} from "../App";

export const UsePostStarshipService = () => {
    const [result, setResult] = useState<SensorData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getHumidityValues();
            setResult(data)

            console.log(data.length)
        }
         fetchData().catch(console.error);
        result.forEach((el)=>{
            console.log(el.value)
        })
    }, []);


    return (
        <>
        </>)
};