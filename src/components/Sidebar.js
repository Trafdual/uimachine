import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/admin.scss';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin </h2>
      <ul className="sidebar-menu">
        <li className={isActive('/admin') ? 'active' : ''}>
          <Link to="/admin">Người dùng</Link>
        </li>
        <li className={isActive('/admin/prices') ? 'active' : ''}>
          <Link to="/admin/prices">Cài đặt gói</Link>
        </li>
        <li>
          <button onClick={() => navigate('/')} className="logout-btn">Đăng xuất</button>
        </li>
      </ul>
    </div>
  );
}
