import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import Highcharts from "highcharts";
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

export const BarChart = (props) => {
    const chartOptions = {
        ...props
    };

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />

}