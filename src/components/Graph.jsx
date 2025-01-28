import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const Graph = ({ dt }) => {
    return (
        <ResponsiveContainer width='100%' height={400}>
            {dt?.length > 0 ? (
                <AreaChart data={dt}>
                    <XAxis dataKey="_id" />
                    <YAxis/>
                    <Tooltip/>
                    <Area type='monotone' dataKey='Total' stroke='#8884d8' fill='#8884d8'/>
                </AreaChart>
            ) : (
                <img src='https://static-00.iconduck.com/assets.00/chart-bar-graph-icon-2048x1799-pu5ac7ch.png' alt='No Data' className='w-full h-full opacity-10'/>
            )}

        </ResponsiveContainer>
    )

}

export default Graph;