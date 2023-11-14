import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function KartuStok() {
    const [stok, setStok] = useState([]);
    const [dbt, setDbt] = useState([]);
    const [jbt, setJbt] = useState([]);
    const [supp, setSupp] = useState([]);
    useEffect(() => {
        fectData();
    }, []);

    const fectData = async () => {
        try {
            const response1 = await axios.get('http://localhost:3000/api/stok');
            const response2 = await axios.get('http://localhost:3000/api/dbt');
            const response3 = await axios.get('http://localhost:3000/api/jbt');
            const response4 = await axios.get('http://localhost:3000/api/supp');
            const data1 = await response1.data.data;
            const data2 = await response2.data.data;
            const data3 = await response3.data.data;
            const data4 = await response4.data.data;
            setStok(data1);
            setDbt(data2);
            setJbt(data3);
            setSupp(data4);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [kode_nama_obat, setKodeNamaObat] = useState('');
    const [kode_jenis_obat, setKodeJenisObat] = useState('');
    const [id_supplier, setIdSupplier] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [stok_masuk, setStokMasuk] = useState('');
    const [stok_keluar, setStokKeluar] = useState('');
    const [sisa, setSisa] = useState('');
    const [kode_exp_obat, setKodeExpObat] = useState('');
    const [validation, setValidation] = useState({});
    const navigate = useNavigate();


    // START Handle Semua Data
    const handleKodeNamaObatChange = (e) => {
        setKodeNamaObat(e.target.value);
    };

    const handleKodeJenisObatChange = (e) => {
        setKodeJenisObat(e.target.value);
    };

    const handleIdSupplierChange = (e) => {
        setIdSupplier(e.target.value);
    };

    const handleTanggalChange = (e) => {
        setTanggal(e.target.value);
    };

    const handleStokMasukChange = (e) => {
        setStokMasuk(e.target.value);
    };

    const handleStokKeluarChange = (e) => {
        setStokKeluar(e.target.value);
    };

    const handleSisaChange = (e) => {
        setSisa(e.target.value);
    };

    const handleKodeExpObatChange = (e) => {
        setKodeExpObat(e.target.value);
    };


    // END Handle Semua Data

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            kode_nama_obat: kode_nama_obat,
            kode_jenis_obat: kode_jenis_obat,
            id_supplier: id_supplier,
            tanggal: tanggal,
            stok_masuk: stok_masuk,
            stok_keluar: stok_keluar,
            sisa: sisa,
            kode_exp_obat: kode_exp_obat,
        };

        try {
            const response = await axios.post('http://localhost:3000/api/stok/create', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.status === 201) {
                navigate('/stok');
                fectData();
            } else {
                console.error('Respon tidak berhasil:', response);
            }
        } catch (error) {
            console.error('Kesalahan:', error);
            if (error.response) {
                console.error('Respon kesalahan:', error.response.data);
            }
        }
    };

    const [editData, setEditData] = useState({
        id_stok: null,
        kode_nama_obat: '',
        kode_jenis_obat: '',
        id_supplier: '',
        tanggal: '',
        stok_masuk: '',
        stok_keluar: '',
        sisa: '',
        kode_exp_obat: '',
    });

    
    const [showEditModal, setShowEditModal] = useState(false);

    const handleShowEditModal = (data) => {
        setEditData(data);
        setShowEditModal(true);
        setShow(false);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleEditDataChange = (field, value) => {
        setEditData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('id_stok', editData.id_stok);
        formData.append('kode_nama_obat', editData.kode_nama_obat);
        formData.append('kode_jenis_obat', editData.kode_jenis_obat);
        formData.append('id_supplier', editData.id_supplier);
        formData.append('tanggal', editData.tanggal);
        formData.append('stok_masuk', editData.stok_masuk);
        formData.append('stok_keluar', editData.stok_keluar);
        formData.append('sisa', editData.sisa);
        formData.append('kode_exp_obat', editData.kode_exp_obat);

        try {
            await axios.patch(`http://localhost:3000/api/stok/update/${editData.id_stok}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            navigate('/stok');
            fectData();
            setShowEditModal(false);
        } catch (error) {
            console.error('Kesalahan: ', error);
            setValidation(error.response.data);
        }
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:3000/api/stok/delete/${id}`)
            .then((response) => {
                console.log('Data berhasil dihapus');
                const updatedStok = stok.filter((item) => item.id_stok !== id);
                setStok(updatedStok);
            })
            .catch((error) => {
                console.error('Gagal menghapus data:', error);
                alert('Gagal menghapus data. Silahkan coba lagi atau hubungi suppinistrator.');
            });
    };

    return (
        <Container className="my-4">
            <Row>
                <Col>
                    <div className="my-4 p-3 border bg-light">
                        <h2 className="text-center">Data Kartu Stok</h2>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <table className="table table-bordered table-striped table-hover mt-4">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Nama Obat</th>
                                <th scope="col">Nama Jenis Obat</th>
                                <th scope="col">Nama Supplier</th>
                                <th scope="col">Tanggal</th>
                                <th scope="col">Stok Masuk</th>
                                <th scope="col">Stok Keluar</th>
                                <th scope="col">Sisa Obat</th>
                                <th scope="col" colSpan={1}>Edit Data</th>
                                <th scope="col" colSpan={1}>Delete Data</th>
                            </tr>
                        </thead>
                        <tbody>
                        { stok.map((Stk, index) => (
                            <tr key={Stk.id_stok}>
                                <td>{index + 1}</td>
                                <td>{Stk.nama_obat}</td>
                                <td>{Stk.nama_jenis_obat}</td>
                                <td>{Stk.nama_pabrik}</td>
                                <td>{Stk.tanggal}</td>
                                <td>{Stk.stok_masuk}</td>
                                <td>{Stk.stok_keluar}</td>
                                <td>{Stk.sisa}</td>
                                <td>{Stk.kode_exp_obat}</td>
                                <td>
                                    <button onClick={() => handleShowEditModal(Stk)} className="btn btn-info">Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(Stk.id_stok)} className="btn btn-danger">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Col>
                <Button variant="success" onClick={handleShow}>Tambah</Button>
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nama Obat :</label>
                            <select className="form-select" value={kode_nama_obat} onChange={handleKodeNamaObatChange}>
                            {dbt.map((db) => (
                                <option key={db.kode_obat} value={db.kode_obat}>
                                {db.nama_obat}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nama Jenis Obat :</label>
                            <select className="form-select" value={kode_jenis_obat} onChange={handleKodeJenisObatChange}>
                            {jbt.map((jb) => (
                                <option key={jb.kode_jenis_obat} value={jb.kode_jenis_obat}>
                                {jb.nama_jenis_obat}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nama Supplier :</label>
                            <select className="form-select" value={id_supplier} onChange={handleIdSupplierChange}>
                            {supp.map((sp) => (
                                <option key={sp.id_supplier} value={sp.id_supplier}>
                                {sp.nama_pabrik}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tanggal :</label>
                            <input type="date" className="form-control" value={tanggal} onChange={handleTanggalChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Stok Masuk :</label>
                            <input type="text" className="form-control" value={stok_masuk} onChange={handleStokMasukChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Stok Keluar :</label>
                            <input type="text" className="form-control" value={stok_keluar} onChange={handleStokKeluarChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Sisa :</label>
                            <input type="text" className="form-control" value={sisa} onChange={handleSisaChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tanggal Expired :</label>
                            <select className="form-select" value={kode_exp_obat} onChange={handleKodeExpObatChange}>
                            {dbt.map((db) => (
                                <option key={db.kode_obat} value={db.kode_obat}>
                                {db.expired_date}
                                </option>
                            ))}
                            </select>
                        </div>
                        <button onClick={handleClose} type="submit" className="btn btn-primary">Kirim</button>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleUpdate}>
                        <div className="mb-3">
                            <label className="form-label">Nama Obat:</label>
                            <select
                            className="form-select"
                            value={editData ? editData.kode_nama_obat : ''}
                            onChange={(e) => handleEditDataChange('kode_nama_obat', e.target.value)}
                            >
                            {dbt.map((Db) => (
                                <option key={Db.kode_obat} value={Db.kode_obat}>
                                {Db.nama_obat}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nama Jenis Obat:</label>
                            <select
                            className="form-select"
                            value={editData ? editData.kode_jenis_obat : ''}
                            onChange={(e) => handleEditDataChange('kode_jenis_obat', e.target.value)}
                            >
                            {jbt.map((Jb) => (
                                <option key={Jb.kode_jenis_obat} value={Jb.kode_jenis_obat}>
                                {Jb.nama_jenis_obat}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nama Jenis Obat:</label>
                            <select
                            className="form-select"
                            value={editData ? editData.kode_jenis_obat : ''}
                            onChange={(e) => handleEditDataChange('kode_jenis_obat', e.target.value)}
                            >
                            {jbt.map((Jb) => (
                                <option key={Jb.kode_jenis_obat} value={Jb.kode_jenis_obat}>
                                {Jb.nama_jenis_obat}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nama Pabrik :</label>
                            <input type="text" className="form-control" value={editData ? editData.kode_nama_obat : ''} onChange={(e) => handleEditDataChange('kode_nama_obat', e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nama Pegawai :</label>
                            <input type="text" className="form-control" value={editData ? editData.kode_jenis_obat : ''} onChange={(e) => handleEditDataChange('kode_jenis_obat', e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Change</button>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default KartuStok;