import { useState, useEffect, useMemo } from 'react';
import './TransactionTable.css';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm';

import DangerIcon from '../../assets/icon/DangerCircle.png';
import Vector from '../../assets/icon/Vector.png';
import Delete from '../../assets/icon/Delete.png';
import PlusIcon from '../../assets/icon/Plus.png';
import Edit from '../../assets/icon/Edit.png';
import More from '../../assets/icon/More.png';
import CalendarIcon from '../../assets/icon/Calendar.png';

import ToPersian from '../../utils/ToPersian';

import { useTransactionContext } from '../../context/TransactionContext';

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const TransactionTable = () => {
  const {
    transactions,
    isLoading,
    error,
    deleteTransaction,
  } = useTransactionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId && !e.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, sortOrder, transactions]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const processedTransactions = useMemo(() => {
    let result = [...transactions];

    if (startDate) {
      const start = startDate.format("YYYY/MM/DD");
      result = result.filter(tx => tx.date >= start);
    }

    if (endDate) {
      const end = endDate.format("YYYY/MM/DD");
      result = result.filter(tx => tx.date <= end);
    }

    result.sort((a, b) => {
      return sortOrder === 'newest'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    });

    return result;
  }, [transactions, startDate, endDate, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const paginationRange = useMemo(() => {
    const totalNumbers = 5;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    let pages = [1];

    if (currentPage > 3) {
      pages.push('...');
    }

    if (currentPage <= 3) {
      pages = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }

    return pages;
  }, [currentPage, totalPages]);

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

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
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setIdToDelete(null);
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  let content;
  if (isLoading) {
    content = <div className="not">در حال بارگذاری...</div>;
  } else if (error) {
    content = (
      <div className="not error-state">
        <img src={DangerIcon} alt="" />
        خطا در دریافت داده‌ها
      </div>
    );
  } else if (processedTransactions.length === 0) {
    content = (
      <div className="not">
        <img src={DangerIcon} alt="" />
        تراکنشی یافت نشد
      </div>
    );
  } else {
    content = currentItems.map(tx => (
      <div className="info-parent" key={tx.id}>
        <div className="info">
          <div className="transaction-date">{ToPersian(tx.date)}</div>

          <div className="transaction-income">
            {tx.type === 'income' && (
              <>
                {ToPersian(Number(tx.amount).toLocaleString())}+
                <span className="toman"> تومان</span>
              </>
            )}
          </div>

          <div className="transaction-expense">
            {tx.type === 'expense' && (
              <>
                {ToPersian(Number(tx.amount).toLocaleString())}-
                <span className="toman"> تومان</span>
              </>
            )}
          </div>

          <div className="transaction-description">
            {tx.description}
          </div>

          <div className="menu-container left">
            <div className="more-btn" onClick={(e) => toggleMenu(e, tx.id)}>
              <img src={More} alt="" />
            </div>

            {openMenuId === tx.id && (
              <div className="popup-menu">
                <button
                  className="popup-menu-item edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(tx);
                  }}
                >
                  <img src={Edit} alt="" />
                  <span>ویرایش</span>
                </button>

                <button
                  className="popup-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(tx.id);
                  }}
                >
                  <img src={Delete} alt="" />
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
        <h2 className="transaction">تراکنش‌ها</h2>
        <button className="button-transaction" onClick={handleAddClick}>
          <img src={PlusIcon} alt="" />
          <span>افزودن تراکنش</span>
        </button>
      </div>

     <div className="filters-container">
  <div className="filter-group">
    <label>از تاریخ</label>
    <div className="input-with-icon">
      <DatePicker
        value={startDate}
        onChange={setStartDate}
        calendar={persian}
        locale={persian_fa}
        format="YYYY/MM/DD"
        placeholder="انتخاب تاریخ"
        containerClassName="w-100" 
        inputClass="custom-date-input" 
      />
    </div>
  </div>

  <div className="filter-group">
    <label>تا تاریخ</label>
    <div className="input-with-icon">
      <DatePicker
        value={endDate}
        onChange={setEndDate}
        calendar={persian}
        locale={persian_fa}
        format="YYYY/MM/DD"
        placeholder="انتخاب تاریخ"
        containerClassName="w-100"
        inputClass="custom-date-input"
      />
    </div>
  </div>

  <div className="filter-group">
    <label>ترتیب نمایش</label>
    <select
      className='select-option'
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
    >
      <option value="newest">جدیدترین</option>
      <option value="oldest">قدیمی‌ترین</option>
    </select>
  </div>
</div>

      {transactions.length > 0 && !isLoading && !error && (
        <div className="title">
          <div>تاریخ</div>
          <div>درآمد(تومان)</div>
          <div>هزینه(تومان)</div>
          <div>شرح</div>
        </div>
      )}

      <div className="table-body">{content}</div>

      {processedTransactions.length > itemsPerPage && (
        <div className="pagination-container">
          <button
            className="pagination-arrow"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {paginationRange.map((page, index) => {
            if (page === '...') {
              return <span key={`dots-${index}`} className="pagination-dots">...</span>;
            }

            return (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              >
                {ToPersian(page)}
              </button>
            );
          })}

          <button
            className="pagination-arrow"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}

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
              <span className="close-icon" onClick={cancelDelete}>
                <img src={Vector} alt="" />
              </span>
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