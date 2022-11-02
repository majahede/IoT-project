import React, {useEffect, useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
    getCurrentHeatIndex,
    getCurrentHumidity,
    getCurrentTemperature,
    getHeatIndexValues,
    getHumidityValues,
    getTemperatureValues
} from "../api/sensorApiCalls";
import {SensorData} from "../api/api-interfaces.ts/sensorData";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Last 7 days',
        },
    },
};

export default function SensorDataScreen() {
    const [temperature, setTemperature] = useState<SensorData[]>([]);
    const [humidity, setHumidity] = useState<SensorData[]>([]);
    const [heatIndex, setHeatIndex] = useState<SensorData[]>([]);
    const [currentTemperature, setCurrentTemperature] = useState<SensorData>();
    const [currentHumidity, setCurrentHumidity] = useState<SensorData>();
    const [currentHeatIndex, setCurrentHeatIndex] = useState<SensorData>();

    useEffect(() => {
        const fetchData = async () => {
            const humidityData = await getHumidityValues();
            const temperatureData = await getTemperatureValues();
            const heatIndexData = await getHeatIndexValues();
            const currentHumidityData = await getCurrentHumidity();
            const currentTemperatureData = await getCurrentTemperature();
            const currentHeatIndexData = await getCurrentHeatIndex();

            setHumidity(humidityData);
            setTemperature(temperatureData);
            setHeatIndex(heatIndexData);

            setCurrentHumidity(currentHumidityData);
            setCurrentTemperature(currentTemperatureData);
            setCurrentHeatIndex(currentHeatIndexData);
        }
        fetchData().catch(console.error);
    }, []);

    const temperatureValues = temperature.map(x => x.value);
    const humidityValues = humidity.map(x => x.value);
    const heatIndexValues = heatIndex.map(x => x.value);
    const labels = temperature.map(x => x.time);

    const temperatureData = {
        labels,
        datasets: [
            {
                label: 'Temperature',
                data: temperatureValues,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'heatIndex',
                data: heatIndexValues,
                borderColor: 'rgb(255,140,0)',
                backgroundColor: 'rgb(255,165,0)',
            }
        ],
    };

    const humidityData = {
        labels,
        datasets: [
            {
                label: 'humidity',
                data: humidityValues,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
        ],
    };
    
    return (
        <>
            <div style={{display: "flex", justifyContent: "space-between", marginLeft: 70}}>
                <div style={{color: "rgb(255, 99, 132)", width: 800, display: "flex", padding: 20}}>
                    <h1>Current temperature = {currentTemperature?.value} °C</h1>
                </div>
                <div style={{color: "rgb(255,140,0)", width: 800, display: "flex", padding: 20}}>
                    <h1>Current heat index = {currentHeatIndex?.value} °C</h1>
                </div>
                <div style={{color: "rgb(53, 162, 235)", width: 800, display: "flex", padding: 20}}>
                    <h1>Current humidity = {currentHumidity?.value} %</h1>
                </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", marginLeft: 50}}>
                <div style={{width: 800, display: "flex", padding: 20}}>
                    <Line style={{ margin: 20}} options={options} data={temperatureData}/>
                    <Line style={{ margin: 20}} options={options}  data={humidityData}/>
                </div>
            </div>
        </>)
        ;
}
