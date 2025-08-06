import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import * as XLSX from 'xlsx'
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface AnalyticsData {
    formId: string
    title: string
    totalSubmissions: number
}

function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData[]>([])
    const [loading, setLoading] = useState(false)

    const fetchAnalytics = async () => {
        try {
            setLoading(true)
            const res = await axios.get('http://localhost:5000/api/subforms/analytics')
            setData(res.data)
        } catch (error) {
            console.error('Failed to fetch analytics', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const chartData = {
        labels: data.map(d => d.title),
        datasets: [
            {
                label: 'Total Submissions',
                data: data.map(d => d.totalSubmissions),
                backgroundColor: '#28b5d1',
                borderRadius: 8,
            }
        ]
    }

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: {
                beginAtZero: true
            }
        }
    }

    const downloadExcel = () => {
        if (!data.length) return

        const excelData = data.map(d => ({
            'Form Title': d.title,
            'Form ID': d.formId,
            'Total Submissions': d.totalSubmissions,
        }))

        const worksheet = XLSX.utils.json_to_sheet(excelData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics')
        XLSX.writeFile(workbook, 'form-analytics.xlsx')
    }

    return (
        <div className="p-10 bg-white/70 shadow-xl rounded-3xl max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-700">Dashboard Overview</h2>
                <button
                    onClick={downloadExcel}
                    className="bg-[#189ab4] hover:bg-[#168aad] text-white px-4 py-2 rounded-md shadow"
                >
                    Download CSV
                </button>
            </div>

            {loading ? (
                <p>Loading analytics...</p>
            ) : (
                <>
                    <Bar data={chartData} options={options} />

                    <div className="mt-10">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center gap-2">
                            View Form-wise Analytics
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.map(form => (
                                <a
                                    key={form.formId}
                                    href={`/analytics/${form.formId}`}
                                    className="block bg-gradient-to-br from-[#d8f3f7] to-[#c7eafc] backdrop-blur-xl rounded-xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
                                >
                                    <h4 className="text-lg font-semibold text-gray-800 group-hover:text-[#189ab4]">
                                        {form.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {form.totalSubmissions} submission{form.totalSubmissions !== 1 ? 's' : ''}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )

}

export default AnalyticsDashboard
