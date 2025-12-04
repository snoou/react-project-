import { createContext, useReducer, useEffect, useContext } from "react";

const API_URL = "http://localhost:3001/transactions";

const INITIAL_STATE = {
    transactions: [],
    isLoading: false,
    error: null,
};

export const TransactionContext = createContext(INITIAL_STATE);

const ACTIONS = {
    FETCH_START: "FETCH_START",
    FETCH_SUCCESS: "FETCH_SUCCESS",
    FETCH_ERROR: "FETCH_ERROR",
    ADD_SUCCESS: "ADD_SUCCESS",
    DELETE_SUCCESS: "DELETE_SUCCESS",
    EDIT_SUCCESS: "EDIT_SUCCESS",
};

const transactionReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.FETCH_START:
            return { ...state, isLoading: true, error: null };

        case ACTIONS.FETCH_SUCCESS:
            return { ...state, transactions: action.payload, isLoading: false, error: null };

        case ACTIONS.FETCH_ERROR:
            return { ...state, isLoading: false, error: action.payload };

        case ACTIONS.ADD_SUCCESS:
            return { ...state, transactions: [...state.transactions, action.payload] };

        case ACTIONS.DELETE_SUCCESS:
            return {
                ...state,
                transactions: state.transactions.filter((tx) => tx.id !== action.payload),
            };

        case ACTIONS.EDIT_SUCCESS:
            return {
                ...state,
                transactions: state.transactions.map((tx) =>
                    tx.id === action.payload.id ? action.payload : tx
                ),
            };

        default:
            return state;
    }
};

export const TransactionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(transactionReducer, INITIAL_STATE);

    const fetchTransactions = async () => {
        dispatch({ type: ACTIONS.FETCH_START });
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`خطای ${response.status}: دریافت داده‌ها با مشکل مواجه شد.`);
            }
            const data = await response.json();
            dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
        } catch (err) {
            dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const addTransaction = async (newTransaction) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTransaction),
            });
            if (!response.ok) {
                throw new Error("ثبت تراکنش جدید موفقیت‌آمیز نبود.");
            }
            const data = await response.json();
            dispatch({ type: ACTIONS.ADD_SUCCESS, payload: data });
            return true;
        } catch (err) {
            console.error("خطای افزودن:", err.message);
            dispatch({ type: ACTIONS.FETCH_ERROR, payload: `ثبت تراکنش شکست خورد: ${err.message}` });
            return false;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("حذف تراکنش موفقیت‌آمیز نبود.");
            }
            dispatch({ type: ACTIONS.DELETE_SUCCESS, payload: id });
        } catch (err) {
            console.error("خطای حذف:", err.message);
            dispatch({ type: ACTIONS.FETCH_ERROR, payload: `حذف تراکنش شکست خورد: ${err.message}` });
        }
    };

    const editTransaction = async (updatedTransaction) => {
        try {
            const response = await fetch(`${API_URL}/${updatedTransaction.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTransaction),
            });

            if (!response.ok) {
                throw new Error("ویرایش تراکنش موفقیت‌آمیز نبود.");
            }

            let data = updatedTransaction;

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            }

            dispatch({ type: ACTIONS.EDIT_SUCCESS, payload: data });
            return true;
        } catch (err) {
            console.error("خطای ویرایش:", err.message);
            dispatch({ type: ACTIONS.FETCH_ERROR, payload: `ویرایش تراکنش شکست خورد: ${err.message}` });
            return false;
        }
    };
    const contextValue = {
        transactions: state.transactions,
        isLoading: state.isLoading,
        error: state.error,
        addTransaction,
        deleteTransaction,
        editTransaction,
        fetchTransactions,
    };

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );
};
export const useTransactionContext = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransactionContext باید درون TransactionProvider استفاده شود.");
    }
    return context;
}
const UseContext = () => {
    const context = useTransactionContext();
    const income = context.transactions.filter(tx => tx.type === "income");
    const expense = context.transactions.filter(tx => tx.type === "expense");
    const list = [income, expense];
    return { list, isLoading: context.isLoading, error: context.error };
}

export default UseContext;