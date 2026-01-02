import React, { useState, useMemo, memo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// ایمپورت فایل CSS
import "./Diagram.css"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const SHAMSI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const Diagram = ({ income = [], expense = [] }) => {
  const [year, setYear] = useState("");

  const incomeStr = JSON.stringify(income);
  const expenseStr = JSON.stringify(expense);

  const { processedData, years, totals } = useMemo(() => {
    const inc = JSON.parse(incomeStr || "[]");
    const exp = JSON.parse(expenseStr || "[]");

    const incomeMonthly = Array(12).fill(0);
    const expenseMonthly = Array(12).fill(0);
    let totalInc = 0;
    let totalExp = 0;
    const distinctYears = new Set();

    const processItems = (items, targetArray, isIncome) => {
      if (!Array.isArray(items)) return;

      items.forEach((item) => {
        if (!item?.date) return;
        try {
          const dateObj = new DateObject({
            date: item.date,
            calendar: persian,
            locale: persian_fa,
            format: "YYYY/MM/DD",
          });

          distinctYears.add(dateObj.year);

          if (year && dateObj.year !== Number(year)) return;

          const amount = Number(item.amount) || 0;
          const monthIndex = dateObj.month - 1;

          if (monthIndex >= 0 && monthIndex < 12) {
            targetArray[monthIndex] += amount;
            if (isIncome) totalInc += amount;
            else totalExp += amount;
          }
        } catch (e) {}
      });
    };

    processItems(inc, incomeMonthly, true);
    processItems(exp, expenseMonthly, false);

    return {
      processedData: { income: incomeMonthly, expense: expenseMonthly },
      years: [...distinctYears].sort((a, b) => b - a),
      totals: { income: totalInc, expense: totalExp, balance: totalInc - totalExp }
    };
  }, [incomeStr, expenseStr, year]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { family: "Vazirmatn" } } },
      tooltip: { titleFont: { family: "Vazirmatn" }, bodyFont: { family: "Vazirmatn" } }
    },
    scales: {
      x: { ticks: { font: { family: "Vazirmatn" } } },
      y: { ticks: { font: { family: "Vazirmatn" } } }
    }
  };

  const doughnutOptions = {
    ...options,
    scales: { x: { display: false }, y: { display: false } },
    plugins: { ...options.plugins, legend: { position: 'bottom' } }
  };

  const formatNumber = (num) => new Intl.NumberFormat('fa-IR').format(num);

  return (
    <div className="diagram-container">
      <div className="diagram-header">
        <h2 className="header-title">داشبورد مالی</h2>
        <select
          className="year-select"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">همه سال‌ها</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="cards-container">
        <div className="card">
          <div className="card-title">درآمد کل</div>
          <p className="card-value text-green">{formatNumber(totals.income)} ت</p>
        </div>
        <div className="card">
          <div className="card-title">هزینه کل</div>
          <p className="card-value text-red">{formatNumber(totals.expense)} ت</p>
        </div>
        <div className="card">
          <div className="card-title">تراز</div>
          <p className={`card-value ltr-dir ${totals.balance >= 0 ? 'text-blue' : 'text-yellow'}`}>
            {formatNumber(totals.balance)} ت
          </p>
        </div>
      </div>

      <div className="charts-grid">
        {/* اضافه کردن کلاس full-width برای اینکه کل عرض را بگیرد */}
        <div className="chart-box full-width">
          <h4 className="chart-title">روند ماهانه</h4>
          <div className="canvas-wrapper">
            <Line options={options} data={{
              labels: SHAMSI_MONTHS,
              datasets: [
                { label: "درآمد", data: processedData.income, borderColor: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.2)", tension: 0.3, fill: true },
                { label: "هزینه", data: processedData.expense, borderColor: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.2)", tension: 0.3, fill: true },
              ]
            }} />
          </div>
        </div>

        <div className="chart-box">
          <h4 className="chart-title">مقایسه</h4>
          <div className="canvas-wrapper">
            <Bar options={options} data={{
              labels: SHAMSI_MONTHS,
              datasets: [
                { label: "درآمد", data: processedData.income, backgroundColor: "#10b981", borderRadius: 4 },
                { label: "هزینه", data: processedData.expense, backgroundColor: "#ef4444", borderRadius: 4 },
              ]
            }} />
          </div>
        </div>

        <div className="chart-box">
          <h4 className="chart-title">نسبت کل</h4>
          <div className="canvas-wrapper">
            <Doughnut options={doughnutOptions} data={{
              labels: ["درآمد", "هزینه"],
              datasets: [{
                data: [totals.income, totals.expense],
                backgroundColor: ["#10b981", "#ef4444"],
                borderWidth: 0,
              }]
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Diagram);