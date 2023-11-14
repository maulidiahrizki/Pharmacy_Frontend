import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminApotek from '../pages/AdminApotek';
import DataObat from '../pages/DataObat';
import JenisObat from '../pages/JenisObat';
import KartuStok from '../pages/KartuStok';
import SupplierApotek from '../pages/SupplierApotek';

function Routing() {
    return (
        <Router>
        <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">Frontend</Link>
            <div className="navbar-nav ml-auto">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/adm">Admin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dbt">Obat-obatan</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/jbt">Jenis Obat</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stok">Kartu Stok</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/supp">Supplier</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
            <Route path="/adm" element={<AdminApotek />} />
            <Route path="/dbt" element={<DataObat />} />
            <Route path="/jbt" element={<JenisObat />} />
            <Route path="/stok" element={<KartuStok />} />
            <Route path="/supp" element={<SupplierApotek />} />
        </Routes>
        </div>
    </Router>
    );
}

export default Routing;