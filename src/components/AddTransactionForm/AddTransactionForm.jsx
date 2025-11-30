import { useContext, useState } from "react";
import './AddTransactionForm.css';
import Id from '../../utils/Id';
import VectorIcon from '../../assets/icon/Vector.png';
import Line from '../../assets/icon/Line1.png'
import { TransactionContext } from "../../context/TransactionContext";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const AddTransactionForm = ({ onClose }) => {
  const { dispatch } = useContext(TransactionContext);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !amount || !description) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    setError('');
    dispatch({
      type: "ADD_TRANSACTION",
      payload: {
        id: Id(),
        date: date.toString(),
        amount: parseFloat(amount),
        type,
        description,
      },
    });
    setDate('');
    setAmount('');
    setType('income');
    setDescription('');
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-add">
        <div className='head modal-add-div '>
          <h3 className="off-resposive">افزودن تراکنش</h3>
          <img className="off-resposive" src={VectorIcon} alt="کنسل" onClick={onClose} />
          <img className="on-resposive" src={Line} alt="line" />
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
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
              onChange={(e) => setAmount(e.target.value)}
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
          <div className="row modal-add-div ">
            <label>شرح</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="buttons modal-add-div ">
            <button type="button" onClick={onClose}>
              انصراف
            </button>
            <button type="submit">ثبت</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionForm;