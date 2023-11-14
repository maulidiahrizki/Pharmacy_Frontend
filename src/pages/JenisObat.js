import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JenisObat() {
    const [jbt, setJbt] = useState([]);
    useEffect(() => {
        fectData();
    }, []);

    const fectData = async () => {
        try {
            const response1 = await axios.get('http://localhost:3000/api/jbt');
            const data1 = await response1.data.data;
            setJbt(data1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [nama_jenis_obat, setNamaJenisObat] = useState('');
    const [validation, setValidation] = useState({});
    const navigate = useNavigate();

    const handleNamaJenisObatChange = (e) => {
        setNamaJenisObat(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            nama_jenis_obat: nama_jenis_obat,
        };

        try {
            const response = await axios.post('http://localhost:3000/api/jbt/create', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.status === 201) {
                navigate('/jbt');
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
        kode_jenis_obat: null,
        nama_jenis_obat: ''
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

        formData.append('kode_jenis_obat', editData.kode_jenis_obat);
        formData.append('nama_jenis_obat', editData.nama_jenis_obat);

        try {
            await axios.patch(`http://localhost:3000/api/jbt/update/${editData.kode_jenis_obat}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            navigate('/jbt');
            fectData();
            setShowEditModal(false);
        } catch (error) {
            console.error('Kesalahan: ', error);
            setValidation(error.response.data);
        }
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:3000/api/jbt/delete/${id}`)
            .then((response) => {
                console.log('Data berhasil dihapus');
                const updatedjbt = jbt.filter((item) => item.kode_jenis_obat !== id);
                setJbt(updatedjbt);
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
                        <h2 className="text-center">Data Jenis Obat</h2>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <table className="table table-bordered table-striped table-hover mt-4">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Nama Jenis Obat</th>
                                <th scope="col" colSpan={1}>Edit Data</th>
                                <th scope="col" colSpan={1}>Delete Data</th>
                            </tr>
                        </thead>
                        <tbody>
                        { jbt.map((Jb, index) => (
                            <tr key={Jb.kode_jenis_obat}>
                                <td>{index + 1}</td>
                                <td>{Jb.nama_jenis_obat}</td>
                                <td>
                                    <button onClick={() => handleShowEditModal(Jb)} className="btn btn-info">Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(Jb.kode_jenis_obat)} className="btn btn-danger">Hapus</button>
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
                            <label className="form-label">Nama Jenis Obat:</label>
                            <input type="text" className="form-control" value={nama_jenis_obat} onChange={handleNamaJenisObatChange} />
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
                            <label className="form-label">Nama Jenis Obat:</label>
                            <input type="text" className="form-control" value={editData ? editData.nama_jenis_obat : ''} onChange={(e) => handleEditDataChange('nama_jenis_obat', e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Change</button>
                    </form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default JenisObat;
