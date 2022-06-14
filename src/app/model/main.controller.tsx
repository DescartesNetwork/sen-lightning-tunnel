import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */
export type MainState = {
  methodSelected?: number
  mintSelected: string
  visible: boolean
  isTyping: boolean
  startDate: number
  endDate: number
  typeDistribute: string
}

/**
 * Store constructor
 */

const NAME = 'main'
const initialState: MainState = {
  methodSelected: undefined,
  mintSelected: '',
  visible: false,
  isTyping: false,
  startDate: 0,
  endDate: 0,
  typeDistribute: '',
}

/**
 * Actions
 */

export const onSelectMethod = createAsyncThunk(
  `${NAME}/onSelectMethod`,
  async (methodSelected?: number) => {
    return { methodSelected }
  },
)

export const onSelectedMint = createAsyncThunk(
  `${NAME}/onSelectedMint`,
  async (mintSelected: string) => {
    return { mintSelected }
  },
)

export const setVisible = createAsyncThunk(
  `${NAME}/setVisible`,
  async (visible: boolean) => {
    return { visible }
  },
)

export const setIsTyping = createAsyncThunk(
  `${NAME}/setIsTyping`,
  async (isTyping: boolean) => {
    return { isTyping }
  },
)
export const setStartDate = createAsyncThunk(
  `${NAME}/setStartDate`,
  async (startDate: number) => {
    return { startDate }
  },
)

export const setEndDate = createAsyncThunk(
  `${NAME}/setEndDate`,
  async (endDate: number) => {
    return { endDate }
  },
)

export const setTypeDistribute = createAsyncThunk(
  `${NAME}/setTypeDistribute`,
  async (type: string) => {
    return { typeDistribute: type }
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
    void builder
      .addCase(
        onSelectMethod.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        onSelectedMint.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setVisible.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setIsTyping.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setStartDate.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setEndDate.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setTypeDistribute.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
