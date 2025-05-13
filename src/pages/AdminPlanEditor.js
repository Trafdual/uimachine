import React, { useState, useEffect } from "react";
import "../styles/AdminPlanEditor.scss";

export default function PriceManager() {
  const [plans, setPlans] = useState([]);
  const [savingIndex, setSavingIndex] = useState(null);
  const [newPlan, setNewPlan] = useState({ name: "", description: "", price: "" });
  const [showModal, setShowModal] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${apiUrl}/getbanggia`);
        const data = await res.json();
        const formatted = data.map((item) => ({
          id: item._id,
          name: item.plan || "",
          description: item.description || "",
          price: item.price?.toString() || "0",
        }));
        setPlans(formatted);
      } catch (err) {
        console.error("Lỗi khi lấy bảng giá:", err);
      }
    };

    fetchPlans();
  }, [apiUrl]);

  const handleChange = (index, field, value) => {
    const updated = [...plans];
    updated[index][field] = value;
    setPlans(updated);
  };

  const handleSave = async (index) => {
    const plan = plans[index];
    setSavingIndex(index);

    try {
      const res = await fetch(`${apiUrl}/updatebanggia/${plan.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.name,
          description: plan.description,
          price: parseInt(plan.price, 10) || 0,
        }),
      });

      if (!res.ok) {
        alert("Cập nhật thất bại!");
      } else {
        alert("Đã lưu thành công");
      }
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      alert("Lỗi kết nối");
    } finally {
      setSavingIndex(null);
    }
  };

  const handleAddPlan = async () => {
    const { name, description, price } = newPlan;
    if (!name || !description || !price) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/postbanggia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: name,
          description,
          price: parseInt(price, 10),
        }),
      });

      if (!res.ok) {
        alert("Thêm thất bại!");
        return;
      }

      const added = await res.json();
      setPlans([
        ...plans,
        {
          id: added._id,
          name: added.plan,
          description: added.description,
          price: added.price?.toString() || "0",
        },
      ]);
      setNewPlan({ name: "", description: "", price: "" });
      setShowModal(false);
      alert("Đã thêm bảng giá");
    } catch (err) {
      console.error("Lỗi khi thêm:", err);
      alert("Lỗi kết nối");
    }
  };

  return (
    <div className="admin-price-manager">
      <h3>Quản lý bảng giá</h3>

      <button className="btn-add" onClick={() => setShowModal(true)}>
        + Thêm bảng giá
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>Thêm bảng giá mới</h4>
            <input
              placeholder="Tên gói"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
            <input
              placeholder="Mô tả"
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
            />
            <input
              placeholder="Giá (số)"
              type="number"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleAddPlan}>Thêm</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Tên gói</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, idx) => (
            <tr key={plan.id}>
              <td>
                <input
                  value={plan.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={plan.description}
                  onChange={(e) => handleChange(idx, "description", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={plan.price}
                  onChange={(e) => handleChange(idx, "price", e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => handleSave(idx)} disabled={savingIndex === idx}>
                  {savingIndex === idx ? "Đang lưu..." : "Lưu"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
