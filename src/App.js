import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    const [visibleRows, setVisibleRows] = useState([]);
    const [recentlyUpdated, setRecentlyUpdated] = useState(new Set());
    const tableRef = useRef(null);
    const rowHeight = 42; // Approximate height of each row in pixels
    const bufferSize = 10; // Number of rows to render above and below the visible area
    
    // Store the previous data to detect changes
    const prevDataRef = useRef();
    
    // Check for updated rows when data changes
    useEffect(() => {
        if (prevDataRef.current) {
            const updatedIndices = new Set();
            data.forEach((row, index) => {
                if (index < prevDataRef.current.length) {
                    const prevRow = prevDataRef.current[index];
                    if (row.stockPrice !== prevRow.stockPrice || row.marketCap !== prevRow.marketCap) {
                        updatedIndices.add(index);
                    }
                }
            });
            
            if (updatedIndices.size > 0) {
                setRecentlyUpdated(updatedIndices);
                
                // Clear the indicator after 5 seconds
                setTimeout(() => {
                    setRecentlyUpdated(new Set());
                }, 5000);
            }
        }
        
        prevDataRef.current = [...data];
    }, [data]);
    
    useEffect(() => {
        const calculateVisibleRows = () => {
            if (!tableRef.current) return;
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const tableTop = tableRef.current.offsetTop;
            const windowHeight = window.innerHeight;
            
            // Calculate first and last visible row indices
            const firstVisibleIndex = Math.max(0, Math.floor((scrollTop - tableTop) / rowHeight) - bufferSize);
            const lastVisibleIndex = Math.min(
                data.length - 1,
                Math.ceil((scrollTop - tableTop + windowHeight) / rowHeight) + bufferSize
            );
            
            // Create an array of indices for the visible rows
            const visibleIndices = [];
            for (let i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
                visibleIndices.push(i);
            }
            
            setVisibleRows(visibleIndices);
        };

        // Initial calculation
        calculateVisibleRows();
        
        // Update on scroll
        const handleScroll = () => {
            calculateVisibleRows();
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', calculateVisibleRows);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', calculateVisibleRows);
        };
    }, [data]);
    
    // Calculate total height of the table to maintain scrollbar proportion
    const totalHeight = data.length * rowHeight;
    
    return (
        <div ref={tableRef} className="table-container">
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
                    {/* Spacer to maintain scroll position for virtualized rows above */}
                    {visibleRows.length > 0 && visibleRows[0] > 0 && (
                        <tr style={{ height: `${visibleRows[0] * rowHeight}px` }} />
                    )}
                    
                    {visibleRows.map(index => {
                        const isUpdated = recentlyUpdated.has(index);
                        return (
                            <tr 
                                key={index} 
                                className={`row ${isUpdated ? 'updated-row' : ''}`} 
                                data-row-index={index}
                            >
                                <td className="cell">{data[index].companyName}</td>
                                <td className="cell">{data[index].ticker}</td>
                                <td className="cell">{data[index].cobDate}</td>
                                <td className={`cell ${isUpdated ? 'updated-cell' : ''}`}>{data[index].stockPrice}</td>
                                <td className={`cell ${isUpdated ? 'updated-cell' : ''}`}>{data[index].marketCap}</td>
                            </tr>
                        );
                    })}
                    
                    {/* Spacer to maintain scroll position for virtualized rows below */}
                    {visibleRows.length > 0 && visibleRows[visibleRows.length - 1] < data.length - 1 && (
                        <tr style={{ height: `${(data.length - 1 - visibleRows[visibleRows.length - 1]) * rowHeight}px` }} />
                    )}
                </tbody>
            </table>
        </div>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState('tab1');
    const [data1, setData1] = useState(() => generateData(1000));
    const [data2, setData2] = useState([]);
    const [affectedRows, setAffectedRows] = useState([]);

    // Function to randomly update some data values
    const updateRandomData = useCallback(() => {
        setData1(prevData => {
            const newData = [...prevData];
            // Update 5 random rows
            for (let i = 0; i < 5; i++) {
                const randomIndex = Math.floor(Math.random() * newData.length);
                newData[randomIndex] = {
                    ...newData[randomIndex],
                    stockPrice: (Math.random() * 1000).toFixed(2),
                    marketCap: (Math.random() * 1000000000).toFixed(0),
                };
            }
            return newData;
        });
    }, []);
    
    useEffect(() => {
        const { modifiedData, affectedRows: affected } = modifyData([...data1]);
        setData2(modifiedData);
        setAffectedRows(affected);
    }, [data1]);

    // Set up periodic data updates
    useEffect(() => {
        // Update some random data every 30 seconds
        const intervalId = setInterval(updateRandomData, 30000);
        
        return () => clearInterval(intervalId);
    }, [updateRandomData]);

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
            <footer className="footer">
                <div className="author">Made by Aivaras Skripka 2025</div>
            </footer>
        </div>
    );
};

export default App;
