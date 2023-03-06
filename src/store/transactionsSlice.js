import { createSlice } from '@reduxjs/toolkit'

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: []
  },
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload)
    },
    removeTransaction: (state, action) => {
      state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload)
    },
    updateTransaction: (state, action) => {
      const { id, ...newTransaction } = action.payload
      const index = state.transactions.findIndex(transaction => transaction.id === id)
      state.transactions[index] = { ...state.transactions[index], ...newTransaction }
    }
  }
})

export const { addTransaction, removeTransaction, updateTransaction } = transactionsSlice.actions