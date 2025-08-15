import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

function sortBy(arr, key, dir) {
  const m = dir === 'asc' ? 1 : -1
  return [...arr].sort((a, b) => {
    const va = a?.[key] ?? ''
    const vb = b?.[key] ?? ''
    if (!isNaN(Date.parse(va)) && !isNaN(Date.parse(vb))) {
      return (new Date(va) - new Date(vb)) * m
    }
    if (!isNaN(+va) && !isNaN(+vb)) return (+va - +vb) * m
    return String(va).localeCompare(String(vb)) * m
  })
}

export default function EmployeeList() {
  const employees = useSelector((state) => state.employees.list)

const columns = useMemo(() => [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'department', label: 'Department' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'street', label: 'Street' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zipCode', label: 'Zip Code' },
], [])

  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: null, dir: 'asc' })

  // filtre
  const filtered = useMemo(() => {
    if (!search.trim()) return employees
    const q = search.toLowerCase()
    return employees.filter((e) =>
      columns.some(({ key }) => String(e?.[key] ?? '').toLowerCase().includes(q))
    )
  }, [employees, search, columns])

  // tri
  const sorted = useMemo(() => {
    if (!sort.key) return filtered
    return sortBy(filtered, sort.key, sort.dir)
  }, [filtered, sort])

  // pagination
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const pageRows = sorted.slice(startIndex, startIndex + pageSize)

  function toggleSort(key) {
    setPage(1)
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' }
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
    })
  }

  function goPrev() { setPage((p) => Math.max(1, p - 1)) }
  function goNext() { setPage((p) => Math.min(totalPages, p + 1)) }

  return (
    <main id="employee-div" className="container">
      <h1>Current Employees</h1>
      <div className="dataTables_wrapper">
        <div className="dataTables_length">
          Show{' '}
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(+e.target.value); setPage(1) }}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>{' '}
          entries
        </div>

        <div className="dataTables_filter">
          Search:{' '}
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        <table id="employee-table" className="display dataTable">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() => toggleSort(c.key)}
                  className={
                    sort.key === c.key
                      ? sort.dir === 'asc'
                        ? 'sorting_asc'
                        : 'sorting_desc'
                      : 'sorting'
                  }
                  role="button"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                  No matching records found
                </td>
              </tr>
            ) : (
              pageRows.map((e, i) => (
                <tr key={startIndex + i}>
                  {columns.map((c) => (
                    <td key={c.key}>{e?.[c.key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="dataTables_info">
          {total === 0
            ? 'Showing 0 to 0 of 0 entries'
            : `Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, total)} of ${total} entries`}
        </div>

        <div className="dataTables_paginate paging_simple_numbers">
          <button className={`paginate_button previous ${currentPage === 1 ? 'disabled' : ''}`} onClick={goPrev} disabled={currentPage === 1}>
            Previous
          </button>
          {}
          {Array.from({ length: totalPages }, (_, idx) => {
            const n = idx + 1
            return (
              <button
                key={n}
                className={`paginate_button ${n === currentPage ? 'current' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            )
          })}
          <button className={`paginate_button next ${currentPage === totalPages ? 'disabled' : ''}`} onClick={goNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      <a href="/">Home</a>
    </main>
  )
}