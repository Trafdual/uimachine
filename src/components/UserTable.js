import React, { useEffect, useState } from 'react'
import '../styles/admin.scss'

export default function UserTable () {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ machine_id: '', name: '', note: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const apiUrl = process.env.REACT_APP_API_URL

  const fetchUsers = async (pageNum = 1) => {
    try {
      const res = await fetch(`${apiUrl}/getmachine?page=${pageNum}`)
      const json = await res.json()
      const updated = (json.data || []).map(user => ({
        ...user,
        editedPlan: user.plan,
        editedName: user.name || '',
        editedNote: user.note || ''
      }))
      setUsers(updated)
      setTotalPages(json.totalPages || 1)
      setPage(json.page || 1)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  useEffect(() => {
    fetchUsers(page)
  }, [page])

  const handleAddUser = async () => {
    try {
      const res = await fetch(`${apiUrl}/postmachine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setShowModal(false)
        setForm({ machine_id: '', name: '', note: '' })
        fetchUsers()
      } else {
        alert('Thêm thất bại!')
      }
    } catch (err) {
      alert('Lỗi kết nối')
    }
  }

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlanSave = async (id, plan, name, note) => {
    try {
      await fetch(`${apiUrl}/updatemachine/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, name, note })
      })
      fetchUsers()
    } catch (err) {
      console.error('Lỗi cập nhật:', err)
    }
  }

  const handleRenew = async id => {
    try {
      await fetch(`${apiUrl}/giahan/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      fetchUsers()
    } catch (err) {
      alert('Lỗi khi gia hạn')
    }
  }

  return (
    <div className='user-table'>
      <div className='user-table-header'>
        <h4>Danh sách người dùng</h4>
        <button onClick={() => setShowModal(true)}>➕ Thêm người dùng</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã máy</th>
            <th>Gói</th>
            <th>Ngày kích hoạt</th>
            <th>Ngày hết hạn</th>
            <th>Ghi chú</th>
            <th>Tên</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={idx}>
              <td>{u.machine_id}</td>
              <td>
                <select
                  value={u.editedPlan}
                  onChange={e => {
                    const updated = users.map(user =>
                      user._id === u._id
                        ? { ...user, editedPlan: e.target.value }
                        : user
                    )
                    setUsers(updated)
                  }}
                >
                  <option value='free'>Miễn phí</option>
                  <option value='month'>Gói Tháng</option>
                  <option value='unlimit'>Vĩnh viễn</option>
                </select>
              </td>
              <td>{u.activate_time || '-'}</td>
              <td>{u.expire_time || '-'}</td>
              <td>
                <input
                  type='text'
                  value={u.editedNote}
                  onChange={e => {
                    const updated = users.map(user =>
                      user._id === u._id
                        ? { ...user, editedNote: e.target.value }
                        : user
                    )
                    setUsers(updated)
                  }}
                />
              </td>
              <td>
                <input
                  type='text'
                  value={u.editedName}
                  onChange={e => {
                    const updated = users.map(user =>
                      user._id === u._id
                        ? { ...user, editedName: e.target.value }
                        : user
                    )
                    setUsers(updated)
                  }}
                />
              </td>
              <td>
                {(u.editedPlan !== u.plan ||
                  u.editedNote !== (u.note || '') ||
                  u.editedName !== (u.name || '')) && (
                  <button
                    onClick={() =>
                      handlePlanSave(
                        u._id,
                        u.editedPlan,
                        u.editedName,
                        u.editedNote
                      )
                    }
                  >
                    Lưu
                  </button>
                )}
                <button
                  onClick={() => handleRenew(u._id)}
                  style={{ marginLeft: '6px' }}
                >
                  Gia hạn
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='pagination'>
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page <= 1}
        >
          Trang trước
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Trang sau
        </button>
      </div>

      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h4>Thêm người dùng</h4>
            <input
              type='text'
              name='machine_id'
              placeholder='Mã máy'
              value={form.machine_id}
              onChange={handleInputChange}
            />
            <input
              type='text'
              name='name'
              placeholder='Tên người dùng'
              value={form.name}
              onChange={handleInputChange}
            />
            <textarea
              name='note'
              placeholder='Ghi chú'
              value={form.note}
              onChange={handleInputChange}
            ></textarea>
            <div className='modal-actions'>
              <button onClick={handleAddUser}>Lưu</button>
              <button className='cancel' onClick={() => setShowModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
