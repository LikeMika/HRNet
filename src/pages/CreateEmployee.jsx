import { useState } from 'react'

function CreateEmployee() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    startDate: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    department: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const employees = JSON.parse(localStorage.getItem('employees')) || []
    employees.push(formData)
    localStorage.setItem('employees', JSON.stringify(employees))
    alert('Employee Created!')
  }

  return (
    <main className="container">
      <h1>HRNet</h1>
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />

        <label>Last Name</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />

        <label>Date of Birth</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

        <label>Start Date</label>
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />

        <fieldset>
          <legend>Address</legend>

          <label>Street</label>
          <input type="text" name="street" value={formData.street} onChange={handleChange} />

          <label>City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} />

          <label>State</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} />

          <label>Zip Code</label>
          <input type="number" name="zipCode" value={formData.zipCode} onChange={handleChange} />
        </fieldset>

        <label>Department</label>
        <select name="department" value={formData.department} onChange={handleChange}>
          <option value="">-- Select --</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Engineering">Engineering</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Legal">Legal</option>
        </select>

        <button type="submit">Save</button>
      </form>
    </main>
  )
}

export default CreateEmployee