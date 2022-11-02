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
import {getHeatIndexValues, getHumidityValues, getTemperatureValues} from "../api/sensorApiCalls";
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
            text: '',
        },
    },
};

export default function SensorDataScreen() {
    const [temperature, setTemperature] = useState<SensorData[]>([]);
    const [humidity, setHumidity] = useState<SensorData[]>([]);
    const [heatIndex, setHeatIndex] = useState<SensorData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const humidityData = await getHumidityValues();
            const temperatureData = await getTemperatureValues();
            const heatIndexData = await getHeatIndexValues();

            setHumidity(humidityData);
            setTemperature(temperatureData);
            setHeatIndex(heatIndexData);
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
            },
        ],
    };

    const heatIndexData = {
        labels,
        datasets: [
            {
                label: 'heatIndex',
                data: humidityValues,
                borderColor: 'rgb(255,140,0)',
                backgroundColor: 'rgb(255,165,0)',
            },
        ],
    };
    
    return (
        <>
            <div style={{display: "flex", justifyContent: "space-between", marginLeft: 50}}>
                <div style={{width: 800, display: "flex", padding: 20}}>
                    <Line style={{ margin: 20}} options={options} data={temperatureData}/>
                    <Line style={{ margin: 20}} options={options}  data={humidityData}/>
                    <Line style={{ margin: 20}} options={options}  data={heatIndexData}/>
                </div>
            </div>
        </>)
        ;
}
