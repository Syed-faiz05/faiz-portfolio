import { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './LeetCodeActivity.css';
import API_URL from '../config';

const LeetCodeActivity = ({ username }) => {
    const [activityData, setActivityData] = useState([]);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeetCodeData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/leetcode/${username}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch LeetCode data');
                }

                const data = await response.json();

                if (data.errors) {
                    throw new Error(data.errors[0].message);
                }

                if (data.data?.matchedUser?.userCalendar) {
                    const calendar = JSON.parse(data.data.matchedUser.userCalendar.submissionCalendar);

                    // Transform data for react-calendar-heatmap
                    const transformedData = Object.entries(calendar).map(([timestamp, count]) => ({
                        date: new Date(parseInt(timestamp) * 1000),
                        count: count
                    }));

                    setActivityData(transformedData);
                    setTotalSubmissions(Object.values(calendar).reduce((a, b) => a + b, 0));
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching LeetCode data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchLeetCodeData();
    }, [username]);

    const getClassForValue = (value) => {
        if (!value) {
            return 'color-empty';
        }
        if (value.count < 3) {
            return 'color-github-1';
        }
        if (value.count < 6) {
            return 'color-github-2';
        }
        if (value.count < 10) {
            return 'color-github-3';
        }
        return 'color-github-4';
    };

    if (loading) {
        return (
            <div className="leetcode-container">
                <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
                    <span className="ml-2 text-sm text-gray-400">Loading LeetCode activity...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leetcode-container">
                <div className="text-center py-6">
                    <p className="text-orange-400 text-sm mb-2">⚠️ Backend server needed</p>
                    <p className="text-xs text-gray-500 mb-4">Start: <code className="bg-slate-800 px-2 py-1 rounded">cd backend && node server.js</code></p>
                    <a
                        href={`https://leetcode.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-profile-btn inline-block"
                    >
                        View LeetCode Profile →
                    </a>
                </div>
            </div>
        );
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    return (
        <div className="leetcode-container">
            <div className="leetcode-header">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                    LeetCode Activity
                </h2>
                <div className="header-actions">
                    <span>{totalSubmissions} submissions in the past year</span>
                    <a
                        href={`https://leetcode.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-profile-btn"
                    >
                        View Profile →
                    </a>
                </div>
            </div>

            <div className="heatmap-wrapper">
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={endDate}
                    values={activityData}
                    classForValue={getClassForValue}
                    tooltipDataAttrs={(value) => {
                        if (!value || !value.date) {
                            return {};
                        }
                        return {
                            'data-tip': `${value.count || 0} submissions on ${value.date.toLocaleDateString()}`
                        };
                    }}
                    showWeekdayLabels={true}
                    gutterSize={3}
                />
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                fontSize: '0.75rem',
                color: '#888'
            }}>
                <span>Less</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#1f2937' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#0e4429' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#26a641' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#39d353' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#4ade80' }}></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default LeetCodeActivity;
