import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeadcountAnalysis } from 'Store/Actions/headcountActions';
import { fetchNhtAnalysis } from 'Store/Actions/nhtActions';
import { fetchTermsAnalysis } from 'Store/Actions/termsActions';

// Custom SVG Pie Chart Component
const PieChart = ({ data, colors, size = 160, title, total }) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / totalValue) * 100;
    const segment = {
      percentage,
      color: colors[index % colors.length],
      cumulativePercentage,
      name: item.name
    };
    cumulativePercentage += percentage;
    return segment;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          {segments.map((segment, index) => {
            const { percentage, color, cumulativePercentage } = segment;
            
            if (percentage === 0) return null;
            
            const startAngle = cumulativePercentage * 3.6;
            const endAngle = (cumulativePercentage + percentage) * 3.6;
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            // Calculate coordinates for the arc
            const startX = 50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
            const startY = 50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
            
            const endX = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
            const endY = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));
            
            const pathData = [
              `M 50 50`,
              `L ${startX} ${startY}`,
              `A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `Z`
            ].join(' ');
            
            return (
              <path
                key={index}
                d={pathData}
                fill={color}
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}
          <circle cx="50" cy="50" r="30" fill="white" />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">{total}</span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm text-gray-600">
                {item.name}: {item.value} ({((item.value / totalValue) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SummaryCharts = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const headcountData = useSelector(state => state.headcount.data);
  const nhtData = useSelector(state => state.nht.data);
  const termsData = useSelector(state => state.terms.data);
  
  const headcountLoading = useSelector(state => state.headcount.loading);
  const nhtLoading = useSelector(state => state.nht.loading);
  const termsLoading = useSelector(state => state.terms.loading);

  useEffect(() => {
    // Fetch data when component mounts
    dispatch(fetchHeadcountAnalysis());
    dispatch(fetchNhtAnalysis());
    dispatch(fetchTermsAnalysis());
  }, [dispatch]);

  // Calculate totals across all departments
  const calculateTotals = () => {
    // Total Headcount
    const totalHeadcount = headcountData.reduce((sum, dept) => sum + dept.Headcount, 0);
    const maleHeadcount = headcountData.reduce((sum, dept) => sum + dept.MaleCount, 0);
    const femaleHeadcount = headcountData.reduce((sum, dept) => sum + dept.FemaleCount, 0);
    
    // Total New Hires
    const totalNewHires = nhtData.reduce((sum, dept) => sum + dept.NewHireTotal, 0);
    const maleNewHires = nhtData.reduce((sum, dept) => sum + dept.NewHireMale, 0);
    const femaleNewHires = nhtData.reduce((sum, dept) => sum + dept.NewHireFemale, 0);
    
    // Average Age (weighted average)
    const totalAgeSum = headcountData.reduce((sum, dept) => sum + (dept.AverageAge * dept.Headcount), 0);
    const averageAge = totalHeadcount > 0 ? totalAgeSum / totalHeadcount : 0;
    
    // Average Tenure (weighted average)
    const totalTenureSum = headcountData.reduce((sum, dept) => sum + (dept.AverageTenure * dept.Headcount), 0);
    const averageTenure = totalHeadcount > 0 ? totalTenureSum / totalHeadcount : 0;
    
    // Total Turnover
    const totalTurnover = termsData.reduce((sum, dept) => sum + dept.VoluntaryTotalCount + dept.InvoluntaryTotalCount, 0);
    const maleTurnover = termsData.reduce((sum, dept) => sum + dept.VoluntaryMaleCount + dept.InvoluntaryMaleCount, 0);
    const femaleTurnover = termsData.reduce((sum, dept) => sum + dept.VoluntaryFemaleCount + dept.InvoluntaryFemaleCount, 0);

    return {
      totalHeadcount: { total: totalHeadcount, male: maleHeadcount, female: femaleHeadcount },
      totalNewHires: { total: totalNewHires, male: maleNewHires, female: femaleNewHires },
      averageAge: averageAge,
      averageTenure: averageTenure,
      totalTurnover: { total: totalTurnover, male: maleTurnover, female: femaleTurnover }
    };
  };

  const totals = calculateTotals();
  
  // Colors for the charts
  const COLORS = ['#3b82f6', '#ec4899'];
  
  // Data for pie charts
  const headcountChartData = [
    { name: 'Male', value: totals.totalHeadcount.male },
    { name: 'Female', value: totals.totalHeadcount.female }
  ];
  
  const newHiresChartData = [
    { name: 'Male', value: totals.totalNewHires.male },
    { name: 'Female', value: totals.totalNewHires.female }
  ];
  
  const turnoverChartData = [
    { name: 'Male', value: totals.totalTurnover.male },
    { name: 'Female', value: totals.totalTurnover.female }
  ];

  // Loading state
  if (headcountLoading || nhtLoading || termsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center h-80">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-32 w-32 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">HR Analytics Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Headcount Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <PieChart 
            data={headcountChartData}
            colors={COLORS}
            title="Total Headcount"
            total={totals.totalHeadcount.total}
          />
        </div>

        {/* Total New Hires Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <PieChart 
            data={newHiresChartData}
            colors={COLORS}
            title="Total New Hires"
            total={totals.totalNewHires.total}
          />
        </div>

        {/* Average Age Display */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Average Age</h3>
          <div className="flex items-center justify-center h-40 w-40 rounded-full bg-blue-50 border-4 border-blue-100">
            <span className="text-3xl font-bold text-blue-600">{totals.averageAge.toFixed(1)}</span>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">Years</p>
        </div>

        {/* Average Tenure Display */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Average Tenure</h3>
          <div className="flex items-center justify-center h-40 w-40 rounded-full bg-green-50 border-4 border-green-100">
            <span className="text-3xl font-bold text-green-600">{totals.averageTenure.toFixed(1)}</span>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">Years</p>
        </div>

        {/* Total Turnover Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <PieChart 
            data={turnoverChartData}
            colors={COLORS}
            title="Total Turnover"
            total={totals.totalTurnover.total}
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryCharts;