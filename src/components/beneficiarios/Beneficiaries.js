import React, { useEffect, useState } from 'react';
import { CContainer } from '@coreui/react';
import BeneficiaryList from "./BeneficiaryList";
import { getBeneficiaries } from 'src/services/api';
import '../../css/beneficiarios/Beneficiaries.css';

const Beneficiaries = () => {
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBeneficiaries = async () => {
      try {
        const response = await getBeneficiaries();
        setBeneficiarios(response?.message?.beneficiaries || []);
      } catch (err) {
        console.error('Error cargando beneficiarios:', err);
        setError(err.message || 'Error al cargar beneficiarios');
      } finally {
        setLoading(false);
      }
    };
    loadBeneficiaries();
  }, []);

  return (
    <CContainer fluid className="beneficiaries-container">
      {loading ? (
        <p>Cargando beneficiarios...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <BeneficiaryList beneficiaries={beneficiarios} />
      )}
    </CContainer>
  );
};

export default Beneficiaries;
