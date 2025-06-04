"use client";

import { Chart } from 'primereact/chart';
import { motion } from 'framer-motion';
import prisma from "@/lib/prisma";
import { Card } from 'primereact/card';
import { use, useEffect, useState } from 'react';
import { getData } from '@/app/(main)/actions';

interface DashboardData {
    motos: number;
    clientes: number;
    reparaciones: number;
    totalFacturado: number;
    partes: number;
    reparacionesPorMes: Array<{ estado: string; _count: number; }>;
}

export default function Home() {

    const [data, setData] = useState<DashboardData | null>(null);
    const [chartDataST, setChartDataST] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: []
        }]
    });


    useEffect(() => {
        async function fetchData() {
            const fetchedData = await getData();
            setData(fetchedData as any);
            const chartData = {
                labels: ['EN_PROCESO', 'FINALIZADO', 'PENDIENTE', 'FACTURADO'],
                datasets: [
                    {
                        data: [
                            fetchedData.reparacionesPorMes.filter(r => r.estado === 'EN_PROCESO')[0]?._count || 0,
                            fetchedData.reparacionesPorMes.filter(r => r.estado === 'FINALIZADO')[0]?._count || 0,
                            fetchedData.reparacionesPorMes.filter(r => r.estado === 'PENDIENTE')[0]?._count || 0,
                            fetchedData.reparacionesPorMes.filter(r => r.estado === 'FACTURADO')[0]?._count || 0
                        ],
                        backgroundColor: ['#FF9900', '#00C851', '#ff0000', '#0088cc']
                    }
                ]
            };
            setChartDataST(chartData as any);
        }

        fetchData();
    }
    , []);



    function formatCurrency(totalFacturado: number | undefined): string {
        if (!totalFacturado) return '$0';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
        }).format(totalFacturado);
    }

    return (
        <main className="min-h-screen p-4 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid">
                <div className="col-12">
                    <h1 className="text-4xl font-bold mb-4">Resumen</h1>
                </div>

                <div className="col-12 grid">
                    {/* Tarjetas de Resumen */}
                    <motion.div
                        className="col-12 md:col-6 lg:col-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="shadow-lg bg-blue-600">
                            <h2 className="text-xl text-white mb-2">Total Motos</h2>
                            <p className="text-4xl font-bold text-white">{data?.motos || 0}</p>
                        </Card>
                    </motion.div>

                    <motion.div
                        className="col-12 md:col-6 lg:col-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="shadow-lg bg-green-600">
                            <h2 className="text-xl text-white mb-2">Clientes</h2>
                            <p className="text-4xl font-bold text-white">{data?.clientes}</p>
                        </Card>
                    </motion.div>

                    <motion.div
                        className="col-12 md:col-6 lg:col-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="shadow-lg bg-purple-600">
                            <h2 className="text-xl text-white mb-2">Reparaciones</h2>
                            <p className="text-4xl font-bold text-white">{data?.reparaciones}</p>
                        </Card>
                    </motion.div>

                    <motion.div
                        className="col-12 md:col-6 lg:col-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="shadow-lg bg-orange-600">
                            <h2 className="text-xl text-white mb-2">Total Facturado</h2>
                            <p className="text-4xl font-bold text-white">
                                {formatCurrency(data?.totalFacturado)}
                            </p>
                        </Card>
                    </motion.div>
                </div>

                {/* Gráfico de Reparaciones */}
                <motion.div
                    className="col-12 md:col-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="shadow-lg">
                        <h2 className="text-xl mb-4">Estado de Reparaciones</h2>
                        <Chart type="doughnut" data={chartDataST} />
                    </Card>
                </motion.div>

                {/* Inventario de Partes */}
                <motion.div
                    className="col-12 md:col-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="shadow-lg">
                        <h2 className="text-xl mb-4">Inventario</h2>
                        <p className="text-3xl font-bold">{data?.partes} partes en stock</p>
                    </Card>
                </motion.div>
            </div>
        </main>
    );
}