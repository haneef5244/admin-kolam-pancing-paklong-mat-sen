'use client';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect } from 'react';
import Highcharts from "highcharts";


export const BarChart = (props) => {
    useEffect(() => {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    }, [])
    const chartOptions = {
        ...props
    };

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />

}