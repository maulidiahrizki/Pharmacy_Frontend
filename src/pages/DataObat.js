import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function DataObat() {

    const [dbt, setDbt] = useState([]);
    const url = "http://localhost:3000/static/";
    useEffect(() => {
      fectData();
    }, []);
    const fectData = async () => {
      const response1 = await axios.get('http://localhost:3000/api/dbt');
      const data1 = await response1.data.data;
      setDbt(data1);
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [gambar, setGambar] = useState(null);
    const [nama_obat, setNamaObat] = useState('');
    const [harga, setHarga] = useState('');
    const [expired_date, setExpired] = useState('');
    const [validation, setValidation] = useState({});
    const navigate = useNavigate();

    const handleGambarChange = (e) => {
      const file = e.target.files[0];
      setGambar(file);
    };
    const handleNamaObatChange = (e) => {
      setNamaObat(e.target.value);
    };
    const handleHargaChange = (e) => {
      setHarga(e.target.value);
    };
    const handleExpiredChange = (e) => {
      setExpired(e.target.value);
    };


    // HANDLE SUBMIT ADA DISINI
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();

      formData.append('nama_obat', nama_obat);
      formData.append('harga', harga);
      formData.append('expired_date', expired_date);
      formData.append('gambar', gambar);
      
      try {
        await axios.post('http://localhost:3000/api/dbt/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        navigate('/dbt');
        fectData();
      } catch (error) {
        console.error('Kesalahan:', error);
        setValidation(error.response.data);
      }
    };

    // Start Edit
    const [editData, setEditData] = useState({
      id: null,
      nama_obat: '',
      harga: '',
      expired_date: '',
      gambar: null,
    });

    const [showEditModal, setShowEditModal] = useState(false);

    const handleShowEditModal = (data) => {
      setEditData(data);
      setShowEditModal(true);
      setShow(false);
    };

    const handleCloseEditModal = () => {
      setShowEditModal(false);
      setEditData(null);
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
    
      formData.append('id', editData.id);
      formData.append('nama_obat', editData.nama_obat);
      formData.append('harga', editData.harga);
      formData.append('expired_date', editData.expired_date);
    
      if (editData.gambar) {
        formData.append('gambar', editData.gambar);
      }
    
      try {
        await axios.patch(`http://localhost:3000/api/dbt/update/${editData.kode_obat}`, formData, {
          headers: {
            'Content-Type' : 'multipart/form-data',
          },
        });
        navigate('/dbt');
        fectData();
        setShowEditModal(false);
      } catch (error) {
        console.error('Kesalahan:', error);
        setValidation(error.response.data);
      }
    };
    

    
    const handleDelete = (id) => {
      axios
        .delete(`http://localhost:3000/api/dbt/delete/${id}`)
        .then((response) => {
          console.log('Data berhasil dihapus');
          // Hapus item dari array data dbt
          const updatedDbt = dbt.filter((item) => item.kode_obat !== id);
          setDbt(updatedDbt); // Perbarui state dengan data yang sudah diperbarui
        })
        .catch((error) => {
          console.error('Gagal menghapus data:', error);
          alert('Gagal menghapus data. Silakan coba lagi atau hubungi administrator.');
        });
    };
    

    return (
        <Container>
        <Row>
          <Col>
            <div className="my-4 p-3 border bg-light">
              <h2 className="text-center">Data Obat</h2>
            </div>
          </Col>
        </Row>
        <Row>
            <Col>
            <table className="table table-bordered table-striped table-hover mt-4">
                <thead>
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Gambar</th>
                    <th scope="col">Nama Obat</th>
                    <th scope="col">Harga</th>
                    <th scope="col">Expired</th>
                    <th scope="col" colSpan={1}>Edit Data</th>
                    <th scope="col" colSpan={1}>Delete Data</th>
                </tr>
                </thead>
                <tbody>
                {dbt.map((Db, index) => (
                    <tr key={Db.kode_obat}>
                    <td>{index + 1}</td>
                    <td><img src={url + Db.gambar} height="100" /></td>
                    <td>{Db.nama_obat}</td>
                    <td>{Db.harga}</td>
                    <td>{Db.expired_date}</td>
                    <td>
                    <button onClick={() => handleShowEditModal(Db)} className="btn btn-info">Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(Db.kode_obat)} className="btn btn-danger">Hapus</button>
                  </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </Col>
            <Button className="mb-4" variant="success" onClick={handleShow}>Tambah</Button>
        </Row>


        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Data</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className="form-label">Gambar:</label>
                <input type='file' className="form-control" accept="image/*" onChange={handleGambarChange} />
              </div>
              <div className='mb-3'>
                <label className="form-label">Nama Obat:</label>
                <input type='text' className="form-control" value={nama_obat} onChange={handleNamaObatChange} />
              </div>
              <div className='mb-3'>
                <label className="form-label">Harga:</label>
                <input type='text' className="form-control" value={harga} onChange={handleHargaChange} />
              </div>
              <div className='mb-3'>
                <label className="form-label">Tanggal Expired:</label>
                <input type='date' className="form-control" value={expired_date} onChange={handleExpiredChange} />
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
                    <input
                      type="text"
                      className="form-control"
                      value={editData ? editData.nama_obat : ''}
                      onChange={(e) => handleEditDataChange('nama_obat', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Harga :</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData ? editData.harga : ''}
                      onChange={(e) => handleEditDataChange('harga', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Expired :</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editData ? editData.expired_date : ''}
                      onChange={(e) => handleEditDataChange('expired_date', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gambar:</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => handleEditDataChange('gambar', e.target.files[0])}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
                  </button>
                </form>
              </Modal.Body>
            </Modal>

        </Container>
    );
}

export default DataObat;