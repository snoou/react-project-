import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import './Diagram.css'
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const SHAMSI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const Diagram = ({ income = [], expense = [] }) => {
  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const lineChart = useRef(null);
  const pieChart = useRef(null);
  const barChart = useRef(null);
  const [year, setYear] = useState("");

  const safeDate = (d) => {
    if (!d) return null;
    try {
      const dateObject = new DateObject({
        date: d,
        calendar: persian,
        locale: persian_fa,
        format: "YYYY/MM/DD"
      });
      return dateObject;
    } catch (e) {
      console.error("Failed to parse date string into DateObject. Check if the date string is correctly formatted (YYYY/MM/DD) and not null:", d, e);
      return null;
    }
  };

  const years = [...new Set(
    [...income, ...expense]
      .map((i) => safeDate(i?.date)?.year)
      .filter(Boolean)
  )].sort((a, b) => b - a);

  const buildMonthlyData = () => {
    const y = Number(year);
    const incomeMonthlyData = Array(12).fill(0);
    const expenseMonthlyData = Array(12).fill(0);

    const aggregateData = (arr, targetArray) => {
      arr.forEach((i, index) => {
        const dtObject = safeDate(i?.date);
        if (!dtObject) {
          console.log(`Skipping transaction item at index ${index}. Date could not be parsed:`, i);
          return;
        }
        if (y && dtObject.year !== y) return;
        const monthIndex = dtObject.month - 1;
        const val = Number(i?.amount) || 0;
        if (monthIndex >= 0 && monthIndex < 12) {
          targetArray[monthIndex] += val;
        }
      });
    };

    aggregateData(income, incomeMonthlyData);
    aggregateData(expense, expenseMonthlyData);

    const result = {
      labels: SHAMSI_MONTHS,
      incomeData: incomeMonthlyData,
      expenseData: expenseMonthlyData,
    };

    console.log("Monthly Chart Data (Income/Expense/Year):", {
      year: year || 'All',
      incomeData: incomeMonthlyData,
      expenseData: expenseMonthlyData
    });

    return result;
  };

  const { labels, incomeData, expenseData } = buildMonthlyData();
  const buildTotals = () => {
    const sum = (arr) =>
      arr.reduce((t, i) => t + (Number(i?.amount) || 0), 0);
    return {
      totalIncome: sum(income),
      totalExpense: sum(expense),
    };
  };
  const { totalIncome, totalExpense } = buildTotals();

  const currentYearTitle = year ? ` (سال ${year})` : ' (تمام سال‌ها)';

  useEffect(() => {
    if (lineChart.current) lineChart.current.destroy();
    if (!lineRef.current) return;

    lineChart.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "درآمد", data: incomeData, borderColor: "#4caf50" },
          { label: "هزینه", data: expenseData, borderColor: "#f44336" },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            type: 'category',
          }
        }
      }
    });
  }, [labels, incomeData, expenseData]);

  useEffect(() => {
    if (pieChart.current) pieChart.current.destroy();
    if (!pieRef.current) return;
    pieChart.current = new Chart(pieRef.current, {
      type: "pie",
      data: {
        labels: ["درآمد کل", "هزینه کل"],
        datasets: [
          {
            data: [totalIncome, totalExpense],
            backgroundColor: ["#4caf50", "#f44336"],
          },
        ],
      },
      options: {
        plugins: {
          tooltip: { enabled: true }
        }
      }
    });
  }, [totalIncome, totalExpense]);

  useEffect(() => {
    if (barChart.current) barChart.current.destroy();
    if (!barRef.current) return;
    barChart.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "درآمد", data: incomeData, backgroundColor: "#4caf50" },
          { label: "هزینه", data: expenseData, backgroundColor: "#f44336" },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            type: 'category',
          }
        }
      },
    });
  }, [labels, incomeData, expenseData]);

  return (
    <div style={{ width: 700, margin: "0px auto" }}>
      <div>
        <label>سال:</label>
        <select className="input" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">تمام سال‌ها</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <h3 className="chart-title">نمودار خطی (روند ماهانه){currentYearTitle}</h3>
      <div className="chart-wrapper">
        <canvas ref={lineRef}></canvas>
      </div>
      <h3 className="chart-title">نمودار دایره‌ای (مجموع کل)</h3>
      <div className="pie-box">
        <canvas ref={pieRef}></canvas>
      </div>
      <h3 className="chart-title">نمودار میله‌ای (مقایسه ماهانه){currentYearTitle}</h3>
      <div className="chart-wrapper">
        <canvas ref={barRef}></canvas>
      </div>

    </div>
  );
};

export default Diagram;