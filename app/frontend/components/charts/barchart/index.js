import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import Highcharts from "highcharts";


export const BarChart = (props) => {
    const chartOptions = {
        ...props
    };

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />

}