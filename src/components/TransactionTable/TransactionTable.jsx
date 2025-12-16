import { useState, useContext, useEffect } from 'react';
import './TransactionTable.css';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm';
import DangerIcon from '../../assets/icon/DangerCircle.png';
import Vector from '../../assets/icon/Vector.png';  
import Delete from '../../assets/icon/Delete.png'
import PlusIcon from '../../assets/icon/Plus.png';
import Edit from '../../assets/icon/Edit.png'
import ToPersian from '../../utils/ToPersian';
import More from '../../assets/icon/More.png'
import { useTransactionContext } from '../../context/TransactionContext';

const TransactionTable = () => {
  const { 
    transactions, 
    isLoading, 
    error, 
    deleteTransaction, 
  } = useTransactionContext(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };
  
  const confirmDelete = async () => {
    if (idToDelete) {
      await deleteTransaction(idToDelete); 
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setIdToDelete(null);
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

  let content;
  if (isLoading) {
    content = (
      <div className="not loading-state">
        <span className="spinner">🔄</span>
        در حال بارگذاری تراکنش‌ها...
      </div>
    );
  } else if (error) {
    content = (
      <div className="not error-state">
        <img src={DangerIcon} alt="Error" />
        خطا در دریافت داده‌ها: {error}
      </div>
    );
  } else if (transactions.length === 0) {
    content = (
      <div className="not">
        <img src={DangerIcon} alt="icon" />
        شما هنوز تراکنشی وارد نکرده‌اید
      </div>
    );
  } else {
    content = transactions.map((tx) => (
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
                {`${ToPersian(Math.abs(tx.amount))}-`} 
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
                  onClick={(e) => { e.stopPropagation(); handleDeleteClick(tx.id); }}
                  className="popup-menu-item">
                  <img src={Delete} alt="Delete" />
                  <span>حذف</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  }

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
      {transactions.length > 0 && !isLoading && !error && ( 
        <div className="title">
          <div className="transaction-date-title">تاریخ</div>
          <div className="transaction-income-title">درآمد (تومان)</div>
          <div className="transaction-expense-title">هزینه (تومان)</div>
          <div className="transaction-description-title">شرح</div>
        </div>
      )}
      <div className="table-body">
        {content} 
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

      {isDeleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-header">
              <h3>حذف تراکنش</h3>
              <span className="close-icon" onClick={cancelDelete}><img src={Vector} alt=""/></span>
            </div>
            <div className="delete-modal-body">
              <p>از حذف تراکنش اطمینان دارید؟</p>
            </div>
            <div className="delete-modal-footer">
              <button className="btn-cancel" onClick={cancelDelete}>انصراف</button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;