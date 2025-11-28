import './Dashboard.css'
import Diagram from '../Diagram/Diagram';
import UseContext from '../../context/TransactionContext';
const Dashboard = () => {
  const [income, expense] = UseContext()
  return (
    <>
      <div className="size">
        <div className=" dashbord">
          <h2>داشبورد</h2>
          <div className='header '>
            <Diagram income={income} expense={expense}></Diagram>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;