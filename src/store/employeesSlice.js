import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: JSON.parse(localStorage.getItem('employees')) || [],
}

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.list.push(action.payload)
      localStorage.setItem('employees', JSON.stringify(state.list))
    },
  },
})

export const { addEmployee } = employeesSlice.actions
export default employeesSlice.reducer
