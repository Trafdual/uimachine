import React, { useState, useEffect } from 'react';
import '../styles/UserPricingPage.scss';

export default function PriceTable() {
  const [plans, setPlans] = useState([]);
const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${apiUrl}/getbanggia`);
        const data = await res.json();
        const formatted = data.map(item => ({
          name: item.plan || '',
          description: item.description || '',
          price: item.price === 0 ? '0đ' : item.price.toLocaleString('vi-VN') + 'đ'
        }));
        setPlans(formatted);
      } catch (err) {
        console.error('Lỗi khi lấy bảng giá:', err);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="price-table">
      <h3>Bảng giá các gói</h3>
      <div className="price-columns">
        {plans.map((plan, idx) => (
          <div className="plan-card" key={idx}>
            <h4>{plan.name}</h4>
            <p>{plan.description}</p>
            <strong>{plan.price}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
