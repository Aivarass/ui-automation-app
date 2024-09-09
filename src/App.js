import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const generateData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            companyName: `Company ${i + 1}`,
            ticker: `TKR${i + 1}`,
            cobDate: new Date(2023, 0, 1 + i).toISOString().split('T')[0],
            stockPrice: (Math.random() * 1000).toFixed(2),
            marketCap: (Math.random() * 1000000000).toFixed(0),
        });
    }
    return data;
};

const modifyData = (data) => {
    const modifiedData = [...data];
    const affectedRows = [];
    for (let i = 99; i < data.length; i += 100) {
        const original = { ...modifiedData[i] };
        modifiedData[i] = {
            ...original,
            stockPrice: (parseFloat(original.stockPrice) + Math.random() * 10 - 5).toFixed(2),
            marketCap: (parseInt(original.marketCap) + Math.random() * 1000000 - 500000).toFixed(0),
        };
        affectedRows.push({ original, modified: modifiedData[i] });
    }
    return { modifiedData, affectedRows };
};

const Table = ({ data }) => {
    const [visibleData, setVisibleData] = useState(data.slice(0, 100));
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;
            setScrollPosition(position);
            const newVisibleCount = Math.min(Math.floor(position / 30) + 100, data.length);
            setVisibleData(data.slice(0, newVisibleCount));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [data]);

    return (
        <table className="table">
            <thead>
            <tr>
                <th>Company Name</th>
                <th>Ticker</th>
                <th>COB Date</th>
                <th>Stock Price</th>
                <th>Market Cap</th>
            </tr>
            </thead>
            <tbody>
            {visibleData.map((row, index) => (
                <tr key={index} className="row">
                    <td className="cell">{row.companyName}</td>
                    <td className="cell">{row.ticker}</td>
                    <td className="cell">{row.cobDate}</td>
                    <td className="cell">{row.stockPrice}</td>
                    <td className="cell">{row.marketCap}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState('tab1');
    const [data1] = useState(() => generateData(1000));
    const [data2, setData2] = useState([]);
    const [affectedRows, setAffectedRows] = useState([]);

    useEffect(() => {
        const { modifiedData, affectedRows: affected } = modifyData([...data1]);
        setData2(modifiedData);
        setAffectedRows(affected);
    }, [data1]);

    const chartData = {
        labels: data1.slice(0, 10).map(d => d.ticker),
        datasets: [
            {
                label: 'Stock Price',
                data: data1.slice(0, 10).map(d => d.stockPrice),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const barData = {
        labels: data1.slice(0, 10).map(d => d.ticker),
        datasets: [
            {
                label: 'Market Cap',
                data: data1.slice(0, 10).map(d => d.marketCap),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="app">
            <header className="header">
                <h1>Financial Data Dashboard</h1>
                <div className="author">Made by Aivaras Skripka</div>
            </header>
            <nav className="nav">
                <button className={`tab ${activeTab === 'tab1' ? 'active' : ''}`} onClick={() => setActiveTab('tab1')}>Table 1</button>
                <button className={`tab ${activeTab === 'tab2' ? 'active' : ''}`} onClick={() => setActiveTab('tab2')}>Table 2</button>
                <button className={`tab ${activeTab === 'tab3' ? 'active' : ''}`} onClick={() => setActiveTab('tab3')}>Charts</button>
            </nav>
            <main className="main">
                {activeTab === 'tab1' && <Table data={data1} />}
                {activeTab === 'tab2' && <Table data={data2} />}
                {activeTab === 'tab3' && (
                    <div className="charts">
                        <div className="chart">
                            <Line data={chartData} />
                        </div>
                        <div className="chart">
                            <Bar data={barData} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
