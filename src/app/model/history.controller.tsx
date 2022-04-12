import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'

import History, { HistoryRecord } from 'app/helper/history'

/**
 * Interface & Utility
 */
export type HistoryState = HistoryRecord[]

/**
 * Store constructor
 */

const NAME = 'history'
const initialState: HistoryRecord[] = []

/**
 * Actions
 */

export const getHistory = createAsyncThunk(
  `${NAME}/getHistory`,
  async (walletAddress: string) => {
    if (!account.isAddress(walletAddress))
      throw new Error('Wallet is not connected')
    const history = new History('history', walletAddress)
    const data = await history.get()
    return data
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      getHistory.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
