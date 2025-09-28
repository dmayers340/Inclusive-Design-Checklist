import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg bg-light border-bottom mb-4" role="navigation">
            <div className="container-fluid">
                <NavLink className="navbar-brand fw-semibold" to="/">Inclusive Audit</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain"
                    aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div id="navMain" className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/create">Create New Report</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/reports">View Reports</NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
