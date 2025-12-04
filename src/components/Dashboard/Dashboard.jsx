import './Dashboard.css'
import Diagram from '../Diagram/Diagram';
import UseContext from '../../context/TransactionContext';

const Dashboard = () => {
  const { list, isLoading, error } = UseContext();
  const [income, expense] = list;

  if (isLoading) {
    return (
      <div className="size">
        <div className='dashboard-loading'>
          <h2 className='dashbord-h2'>داشبورد</h2>
          <p className="loading-message">در حال دریافت اطلاعات تراکنش‌ها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="size">
        <div className='dashboard-error'>
          <h2 className='dashbord-h2'>داشبورد</h2>
          <p className="error-message">خطا در اتصال به سرور: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="size">
        <div className=" dashbord">
          <h2 className='dashbord-h2'>داشبورد</h2>
          <div className='header '>
            <Diagram income={income} expense={expense}></Diagram>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;