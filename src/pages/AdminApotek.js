import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminApotek() {
    const [adm, setAdm] = useState([]);
    useEffect(() => {
        fectData();
    }, []);

    const fectData = async () => {
        try {
            const response1 = await axios.get('http://localhost:3000/api/adm');
            const data1 = await response1.data.data;
            setAdm(data1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [nama_admin, setNamaAdmin] = useState('');
    const [telp_admin, setTelpAdmin] = useState('');
    const [validation, setValidation] = useState({});
    const navigate = useNavigate();

    const handleNamaAdminChange = (e) => {
        setNamaAdmin(e.target.value);
    };

    const handleTelpAdminChange = (e) => {
        setTelpAdmin(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            nama_admin: nama_admin,
            telp_admin: telp_admin
        };

        try {
            const response = await axios.post('http://localhost:3000/api/adm/create', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.status === 201) {
                navigate('/adm');
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
        id_admin: null,
        nama_admin: '',
        telp_admin: ''
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

        formData.append('id_admin', editData.id_admin);
        formData.append('nama_admin', editData.nama_admin);
        formData.append('telp_admin', editData.telp_admin);

        try {
            await axios.patch(`http://localhost:3000/api/adm/update/${editData.id_admin}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            navigate('/adm');
            fectData();
            setShowEditModal(false);
        } catch (error) {
            console.error('Kesalahan: ', error);
            setValidation(error.response.data);
        }
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:3000/api/adm/delete/${id}`)
            .then((response) => {
                console.log('Data berhasil dihapus');
                const updatedAdm = adm.filter((item) => item.id_admin !== id);
                setAdm(updatedAdm);
            })
            .catch((error) => {
                console.error('Gagal menghapus data:', error);
                alert('Gagal menghapus data. Silahkan coba lagi atau hubungi administrator.');
            });
    };

    return (
        <Container className="my-4">
            <Row>
                <Col>
                    <div className="my-4 p-3 border bg-light">
                        <h2 className="text-center">Data Admin</h2>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <table className="table table-bordered table-striped table-hover mt-4">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Nama Admin</th>
                                <th scope="col">No. Telp</th>
                                <th scope="col" colSpan={1}>Edit Data</th>
                                <th scope="col" colSpan={1}>Delete Data</th>
                            </tr>
                        </thead>
                        <tbody>
                        { adm.map((Ad, index) => (
                            <tr key={Ad.id_admin}>
                                <td>{index + 1}</td>
                                <td>{Ad.nama_admin}</td>
                                <td>{Ad.telp_admin}</td>
                                <td>
                                    <button onClick={() => handleShowEditModal(Ad)} className="btn btn-info">Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(Ad.id_admin)} className="btn btn-danger">Hapus</button>
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
                            <label className="form-label">Nama Admin:</label>
                            <input type="text" className="form-control" value={nama_admin} onChange={handleNamaAdminChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Telp Admin:</label>
                            <input type="text" className="form-control" value={telp_admin} onChange={handleTelpAdminChange} />
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
                            <label className="form-label">Nama Admin :</label>
                            <input type="text" className="form-control" value={editData ? editData.nama_admin : ''} onChange={(e) => handleEditDataChange('nama_admin', e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">No. Telp :</label>
                            <input type="text" className="form-control" value={editData ? editData.telp_admin : ''} onChange={(e) => handleEditDataChange('telp_admin', e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Change</button>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default AdminApotek;