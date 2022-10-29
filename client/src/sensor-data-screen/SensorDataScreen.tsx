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
import {getHumidityValues, getTemperatureValues} from "../api/sensorApiCalls";
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

    useEffect(() => {
        const fetchData = async () => {
            const humidityData = await getHumidityValues();
            const temperatureData = await getTemperatureValues();

            setHumidity(humidityData);
            setTemperature(temperatureData);
        }
        fetchData().catch(console.error);
    }, []);

    const temperatureValues = temperature.map(x => x.value);
    const humidityValues = humidity.map(x => x.value);
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
    return (
        <>
            <Line options={options} data={temperatureData} />
            <Line options={options}  data={humidityData} />
        </>)
        ;
}
