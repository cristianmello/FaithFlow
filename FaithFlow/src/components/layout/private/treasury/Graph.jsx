import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const Graph = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Aquí deberías hacer la llamada a tu API para obtener los datos
        // y luego guardarlos en el estado de 'data'. Por ahora, voy a usar
        // datos simulados para el ejemplo.

        const simulatedData = [
            { month: 'Enero', Entrada: 4000, Salida: 2400 },
            { month: 'Febrero', Entrada: 3000, Salida: 1398 },
            // ... continúa con los otros meses
        ];

        setData(simulatedData);
    }, []);

    return (
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Entrada" fill="#8884d8" />
            <Bar dataKey="Salida" fill="#82ca9d" />
        </BarChart>
    );
}
