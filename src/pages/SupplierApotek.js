import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SupplierApotek() {
    const [supp, setSupp] = useState([]);
    useEffect(() => {
        fectData();
    }, []);

    const fectData = async () => {
        try {
            const response1 = await axios.get('http://localhost:3000/api/supp');
            const data1 = await response1.data.data;
            setSupp(data1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [nama_pabrik, setNamaPabrik] = useState('');
    const [nama_pegawai, setNamaPegawai] = useState('');
    const [validation, setValidation] = useState({});
    const navigate = useNavigate();

    const handleNamaPabrikChange = (e) => {
        setNamaPabrik(e.target.value);
    };

    const handleNamaPegawaiChange = (e) => {
        setNamaPegawai(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            nama_pabrik: nama_pabrik,
            nama_pegawai: nama_pegawai
        };

        try {
            const response = await axios.post('http://localhost:3000/api/supp/create', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.status === 201) {
                navigate('/supp');
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
        id_supplier: null,
        nama_pabrik: '',
        nama_pegawai: ''
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

        formData.append('id_supplier', editData.id_supplier);
        formData.append('nama_pabrik', editData.nama_pabrik);
        formData.append('nama_pegawai', editData.nama_pegawai);

        try {
            await axios.patch(`http://localhost:3000/api/supp/update/${editData.id_supplier}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            navigate('/supp');
            fectData();
            setShowEditModal(false);
        } catch (error) {
            console.error('Kesalahan: ', error);
            setValidation(error.response.data);
        }
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:3000/api/supp/delete/${id}`)
            .then((response) => {
                console.log('Data berhasil dihapus');
                const updatedSupp = supp.filter((item) => item.id_supplier !== id);
                setSupp(updatedSupp);
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
                        <h2 className="text-center">Data Supplier</h2>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <table className="table table-bordered table-striped table-hover mt-4">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Nama Pabrik</th>
                                <th scope="col">Nama Pegawai</th>
                                <th scope="col" colSpan={1}>Edit Data</th>
                                <th scope="col" colSpan={1}>Delete Data</th>
                            </tr>
                        </thead>
                        <tbody>
                        { supp.map((Sup, index) => (
                            <tr key={Sup.id_supplier}>
                                <td>{index + 1}</td>
                                <td>{Sup.nama_pabrik}</td>
                                <td>{Sup.nama_pegawai}</td>
                                <td>
                                    <button onClick={() => handleShowEditModal(Sup)} className="btn btn-info">Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(Sup.id_supplier)} className="btn btn-danger">Hapus</button>
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
                            <label className="form-label">Nama Pabrik :</label>
                            <input type="text" className="form-control" value={nama_pabrik} onChange={handleNamaPabrikChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nama Pegawai :</label>
                            <input type="text" className="form-control" value={nama_pegawai} onChange={handleNamaPegawaiChange} />
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
                            <label className="form-label">Nama Pabrik :</label>
                            <input type="text" className="form-control" value={editData ? editData.nama_pabrik : ''} onChange={(e) => handleEditDataChange('nama_pabrik', e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nama Pegawai :</label>
                            <input type="text" className="form-control" value={editData ? editData.nama_pegawai : ''} onChange={(e) => handleEditDataChange('nama_pegawai', e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Change</button>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default SupplierApotek;