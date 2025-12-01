import { useState, useContext, useEffect } from 'react';
import './TransactionTable.css';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm';
import DangerIcon from '../../assets/icon/DangerCircle.png';
import Delete from '../../assets/icon/Delete.png'
import PlusIcon from '../../assets/icon/Plus.png';
import Edit from '../../assets/icon/Edit.png'
import ToPersian from '../../utils/ToPersian';
import More from '../../assets/icon/More.png'
import { TransactionContext } from '../../context/TransactionContext';

const TransactionTable = () => {
  const { transactions, dispatch } = useContext(TransactionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    setOpenMenuId(null);
  };
  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setOpenMenuId(null);
    setIsModalOpen(true);
  };
  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  }
  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };
  return (
    <div className="size">
      <div className="header">
        <h2 className="transaction font-size-list">تراکنش‌ها</h2>
        <button className='button-transaction' onClick={handleAddClick}>
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
                <div className="transaction-income">
                  {tx.type === 'income' ? (
                    <>
                      {`${ToPersian(tx.amount)}+`}
                      <span className='toman'>تومان</span>
                    </>
                  ) : null}
                </div>

                <div className="transaction-expense">
                  {tx.type === 'expense' ? (
                    <>
                      {`${ToPersian(tx.amount)}-`}
                      <span className='toman'>تومان</span>
                    </>
                  ) : null}
                </div>
                <div className="transaction-description">{tx.description}</div>
                <div
                  className="menu-container left">
                  <div className='more-btn' onClick={(e) => toggleMenu(e, tx.id)}>
                    <img src={More} alt="menu" />
                  </div>
                  {openMenuId === tx.id && (
                    <div className="popup-menu">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditClick(tx); }}
                        className="popup-menu-item edit-btn">
                        <img src={Edit} alt="Edit" />
                        <span>ویرایش</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(tx.id); }}
                        className="popup-menu-item">
                        <img src={Delete} alt="Delete" />
                        <span>حذف</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isModalOpen && (
        <AddTransactionForm
          initialData={editingTransaction}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};
export default TransactionTable;