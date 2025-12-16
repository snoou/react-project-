import { createContext, useReducer, useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";

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

    const { executeFetch } = useFetch();

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: ACTIONS.FETCH_START });

            const result = await executeFetch(API_URL);

            if (result.success) {
                dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: result.data });
            } else {
                dispatch({ type: ACTIONS.FETCH_ERROR, payload: result.error });
            }
        };

        fetchData();

    }, [executeFetch]);


    const addTransaction = async (newTransaction) => {
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTransaction),
        };
        const result = await executeFetch(API_URL, options);

        if (result.success) {
            dispatch({ type: ACTIONS.ADD_SUCCESS, payload: result.data });
            return true;
        }
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: result.error });
        return false;
    };

    const deleteTransaction = async (id) => {
        const endpoint = `${API_URL}/${id}`;
        const options = { method: "DELETE" };

        const result = await executeFetch(endpoint, options);

        if (result.success) {
            dispatch({ type: ACTIONS.DELETE_SUCCESS, payload: id });
        } else {
            dispatch({ type: ACTIONS.FETCH_ERROR, payload: result.error });
        }
    };

    const editTransaction = async (updatedTransaction) => {
        const endpoint = `${API_URL}/${updatedTransaction.id}`;
        const options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTransaction),
        };

        const result = await executeFetch(endpoint, options);

        if (result.success) {
            dispatch({ type: ACTIONS.EDIT_SUCCESS, payload: result.data });
            return true;
        }
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: result.error });
        return false;
    };

    const contextValue = {
        transactions: state.transactions,
        isLoading: state.isLoading,
        error: state.error,
        addTransaction,
        deleteTransaction,
        editTransaction,
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

const UseTransactions = () => {
    const context = useTransactionContext();
    const income = context.transactions.filter(tx => tx.type === "income");
    const expense = context.transactions.filter(tx => tx.type === "expense");
    const list = [income, expense];
    return { list, isLoading: context.isLoading, error: context.error };
}

export default UseTransactions;