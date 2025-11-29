import { useState, useContext } from 'react';
import './TransactionTable.css';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm';
import DangerIcon from '../../assets/icon/DangerCircle.png';
import PlusIcon from '../../assets/icon/Plus.png';
import Delete from '../../assets/icon/Delete.png';
import ToPersian from '../../utils/ToPersian';
import { TransactionContext } from '../../context/TransactionContext';

const TransactionTable = () => {
  const { transactions, dispatch } = useContext(TransactionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };
  return (
    <div className="size">
      <div className="header">
        <h2 className="transaction font-size-list">تراکنش‌ها</h2>
        <button className='button-transaction' onClick={() => setIsModalOpen(true)}>
          <img src={PlusIcon} alt="icon" />
          <span className='font-size-list'>
            افزودن تراکنش

          </span>
        </button>
      </div>
      {transactions.length > 0 && (
        <div className="title">
          <div className="transaction-date-title">تاریخ</div>
          <div className="transaction-income-title">درآمد (تومان)</div>
          <div className="transaction-expense-title">هزینه (تومان)</div>
          <div className="transaction-description-title">شرح</div>
        </div>
      )}
      <div className="table-body">
        {transactions.length === 0 ? (
          <div className="not">
            <img src={DangerIcon} alt="icon" />
            شما هنوز تراکنشی وارد نکرده‌اید
          </div>
        ) : (
          transactions.map((tx) => (
            <div className='info-parent' key={tx.id}>
              <div className="info" key={tx.id}>
                <div className="transaction-date">{ToPersian(tx.date)}</div>
                <div className={`${tx.type === 'expense' ? 'transaction-expense' : 'transaction-income'}`}>
                  {`${ToPersian(tx.amount)}${tx.type === 'income' ? '+' : '-'}`}
                  <span className='toman' >تومان</span>
                </div>
                <div className="transaction-description">{tx.description}</div>
                <div
                  className="delete-btn left"
                  onClick={() => handleDelete(tx.id)}
                >
                  <img src={Delete} alt="delete" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isModalOpen && (
        <AddTransactionForm
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
export default TransactionTable;
