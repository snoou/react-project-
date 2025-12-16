import { useState, useEffect } from "react";
import './AddTransactionForm.css';
import VectorIcon from '../../assets/icon/Vector.png';
import Line from '../../assets/icon/Line1.png'
import { useTransactionContext } from "../../context/TransactionContext";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const AddTransactionForm = ({ onClose, initialData }) => {
  const { addTransaction, editTransaction } = useTransactionContext();
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      const displayAmount = Math.abs(initialData.amount);

      setDate(initialData.date);
      setAmount(String(displayAmount));
      setType(initialData.type);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !amount || !description) {
      setError('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    const normalizedAmount = parseFloat(amount);
    if (normalizedAmount <= 0) {
      setError('مبلغ باید بزرگتر از صفر باشد.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    let success = false;

    const transactionData = {
      date: date.toString(),
      amount: type === 'expense' ? -normalizedAmount : normalizedAmount,
      type,
      description,
    };

    try {
      if (initialData) {
        const updatedData = { ...transactionData, id: initialData.id };
        success = await editTransaction(updatedData);

      } else {
        success = await addTransaction(transactionData);
      }

      if (success) {
        setDate('');
        setAmount('');
        setType('income');
        setDescription('');
        if (onClose) onClose();
      } else {
        setError(initialData ? 'خطا در ویرایش تراکنش. لطفاً دوباره تلاش کنید.' : 'خطا در ثبت تراکنش. لطفاً دوباره تلاش کنید.');
      }

    } catch (apiError) {
      console.error("خطای API:", apiError);
      setError('خطای ارتباط با سرور. لطفاً اتصال خود را بررسی کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-add">
        <div className='head modal-add-div '>
          <h3 className="off-resposive">
            {initialData ? 'ویرایش تراکنش' : 'افزودن تراکنش'}
          </h3>
          <button className="colse-add" onClick={onClose}>
            <img className="off-resposive" src={VectorIcon} alt="کنسل" />
          </button>
          <img className="on-resposive" src={Line} alt="line" />
        </div>
        <form onSubmit={handleSubmit}>
          {(error || useTransactionContext().error) &&
            <p className="error">{error || useTransactionContext().error}</p>
          }
          <div className="row modal-add-div">
            <label>تاریخ</label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={date}
              onChange={(val) => setDate(val)}
              format="YYYY/MM/DD"
              placeholder="انتخاب تاریخ"
              inputClass="custom-date-input"
              calendarPosition="bottom-right"
            />
          </div>
          <div className="row modal-add-div ">
            <label>مبلغ (تومان)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace('-', ''))}
            />
          </div>
          <div className="modal-add-div">
            <label>نوع تراکنش</label>
            <div className="type-t modal-add-div ">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={type === 'income'}
                  onChange={() => setType('income')}
                />
                درآمد
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={() => setType('expense')}
                />
                هزینه
              </label>
            </div>
          </div>
          <div className="row modal-add-div">
            <label>شرح</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="buttons modal-add-div ">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              انصراف
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'در حال ارسال...'
                : initialData ? 'ویرایش' : 'ثبت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionForm;