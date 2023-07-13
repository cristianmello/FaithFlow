import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Input, Select, message, Modal } from 'antd';
import { useSpring, animated as a } from 'react-spring';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { DollarCircleOutlined } from '@ant-design/icons';
import styles from '../../../../assets/css/terasury.module.css';
import moment from 'moment';
import useRoles from '../../../../hooks/useRoles';

const { Option } = Select;

export const Treasuries = () => {
  const [treasuries, setTreasuries] = useState([]);
  const [typeTreasuries, setTypeTreasuries] = useState([]);
  const [editingTreasury, setEditingTreasury] = useState(null);
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const formRef = React.createRef();
  const [churchIncome, setChurchIncome] = useState(0);
  const [churchTotalTreasuries, setChurchTotalTreasuries] = useState(0);
  const [showTotalBalance, setShowTotalBalance] = useState(false);
  const { roles } = useRoles();
  const [editingTreasuryValue, setEditingTreasuryValue] = useState(0);
  const [editingTreasuryType, setEditingTreasuryType] = useState(null);

  useEffect(() => {
    fetchTypeTreasuries();
    fetchTreasuries();
    fetchChurch();
  }, []);

  const fetchTypeTreasuries = () => {
    axios
      .get('http://localhost:3000/api/typeTreasury', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setTypeTreasuries(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchChurch = () => {
    axios
      .get('http://localhost:3000/api/church/', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const churchData = res.data;
        setChurchIncome(churchData.church_income);
        setChurchTotalTreasuries(churchData.church_totalTreasuries);
      })
      .catch((err) => console.error(err));
  };

  const fetchTreasuries = () => {
    axios
      .get('http://localhost:3000/api/treasury', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const treasuriesWithTypes = res.data.map(treasury => {
          const typeTreasury = typeTreasuries.find(type => type.TypeTreasury_code === treasury.TypeTreasury_code);
          return {
            ...treasury,
            TypeTreasury_type: typeTreasury ? typeTreasury.TypeTreasury_type : null,
          };
        });
        setTreasuries(treasuriesWithTypes);
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (treasury_code) => {
    const treasury = treasuries.find((treasury) => treasury.activity_code === treasury_code);
    form.setFieldsValue(treasury);
    setEditingTreasury(treasury_code);

    setEditingTreasuryValue(parseFloat(treasury.activity_value));
    setEditingTreasuryType(treasury.TypeTreasury_type);

    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };


  const handleNewSubmit = (values) => {
    const method = editingTreasury ? axios.patch : axios.post;
    const url = editingTreasury ? `http://localhost:3000/api/treasury/${editingTreasury}` : 'http://localhost:3000/api/treasury';

    // Establece la fecha de la actividad a la fecha actual solo si se está creando una nueva treasury
    if (!editingTreasury) {
      const todayDate = moment().format('YYYY-MM-DD');
      values.activity_date = todayDate;
    }
    
    const typeTreasury = typeTreasuries.find(type => type.TypeTreasury_code === values.TypeTreasury_code);

    const activityValue = parseFloat(values.activity_value);

    // Se realiza el cálculo inicial del prospectiveTotal
    let prospectiveTotal = typeTreasury.TypeTreasury_type === 1 ? (churchTotalTreasuries + activityValue) : (churchTotalTreasuries - activityValue);

    // Si se está editando, se tiene en cuenta el valor antiguo
    if (editingTreasury) {
      prospectiveTotal = editingTreasuryType === 1 ? (prospectiveTotal - editingTreasuryValue) : (prospectiveTotal + editingTreasuryValue);
    }

    console.log(prospectiveTotal)

    if (prospectiveTotal < 0) {
      message.error('La operación no puede realizarse, resultaría en un saldo total negativo.');
      return;
    }

    method(url, values, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        form.resetFields();
        setShowSuccessMessage(true);
        setEditingTreasury(null);
        fetchTreasuries();
        updateChurchTotalTreasuries();
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (treasury_code) => {
    Modal.confirm({
      title: '¿Estás seguro de que quieres eliminar esta actividad?',
      onOk: () => {
        const deletedTreasury = treasuries.find((treasury) => treasury.activity_code === treasury_code);
        const typeTreasury = typeTreasuries.find(type => type.TypeTreasury_code === deletedTreasury.TypeTreasury_code);

        const deletedTreasuryValue = parseFloat(deletedTreasury.activity_value);
        let prospectiveTotal;
        if (typeTreasury.TypeTreasury_type === 1) {  // Tipo 1 es un ingreso
          prospectiveTotal = churchTotalTreasuries - deletedTreasuryValue;
        } else if (typeTreasury.TypeTreasury_type === 2) {  // Tipo 2 es un gasto
          prospectiveTotal = churchTotalTreasuries + deletedTreasuryValue;
        }

        if (prospectiveTotal < 0) {
          message.error('La operación no puede realizarse, resultaría en un saldo total negativo.');
          return;
        }

        axios
          .delete(`http://localhost:3000/api/treasury/${treasury_code}`, {
            headers: {
              Authorization: token,
            },
          })
          .then(() => {
            fetchTreasuries();
            updateChurchTotalTreasuries();
          })
          .catch((err) => console.error(err));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };


  const handleShowTotalBalance = () => {
    ;
    message.info(`Saldo total de la iglesia: ${churchTotalTreasuries}`);
  };

  const renderTotalBalanceButton = () => (
    <Button onClick={handleShowTotalBalance} style={{ background: '#dad9d9' }} type="text">
      <DollarCircleOutlined style={{ color: '#c01d0c', background: '#dad9d9' }} />
      <span style={{ color: '#c01d0c' }}>
        Mostrar Saldo Total
      </span>
    </Button>
  );

  const updateChurchTotalTreasuries = () => {
    axios
      .get('http://localhost:3000/api/treasury', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const totalTreasuries = res.data.reduce((sum, treasury) => {
          const typeTreasury = typeTreasuries.find(type => type.TypeTreasury_code === treasury.TypeTreasury_code);
          const value = parseFloat(treasury.activity_value);
          if (typeTreasury.TypeTreasury_type === 1) {
            return sum + value;
          } else if (typeTreasury.TypeTreasury_type === 2) {
            return sum - value;
          } else {
            return sum;
          }
        }, 0);

        // Calcular el nuevo valor de church_totalTreasuries teniendo en cuenta totalTreasuries y church_income
        const newChurchTotalTreasuries = totalTreasuries + churchIncome;

        // Verificar que newChurchTotalTreasuries no sea un número negativo
        if (newChurchTotalTreasuries < 0) {
          message.error('El saldo total de la iglesia no puede ser negativo.');
          return;
        }

        axios.patch(
          'http://localhost:3000/api/church/totalTreasuries',
          { church_totalTreasuries: newChurchTotalTreasuries },
          {
            headers: {
              Authorization: token,
            },
          }
        )
          .then(() => {
            setChurchTotalTreasuries(newChurchTotalTreasuries);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };


  const calculateIncome = (value, type) => {
    const activityValue = parseFloat(value);

    if (type === 1) {
      // Tipo 1 es un ingreso, se suma al total
      return churchIncome + activityValue;
    } else if (type === 2) {
      // Tipo 2 es un gasto, se resta del total
      return churchIncome - activityValue;
    } else {
      // Para otros tipos, el total no cambia
      return churchIncome;
    }
  };


  const springProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  const columns = [
    {
      title: 'Descripción',
      dataIndex: 'activity_description',
      key: 'activity_description',
    },
    {
      title: 'Valor',
      dataIndex: 'activity_value',
      key: 'activity_value',
    },
    {
      title: 'Fecha',
      dataIndex: 'activity_date',
      key: 'activity_date',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record.activity_code)} icon={<FaEdit style={{ color: '#5856d6' }} />} />
          <Button onClick={() => handleDelete(record.activity_code)} icon={<FaTrash style={{ color: '#c01d0c' }} />} />
        </span>
      ),
    },
  ];

  const validateNumber = (rule, value, callback) => {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue) || numberValue < 0) {
      callback('El valor debe ser un número mayor o igual a cero');
    } else {
      callback();
    }
  };

  useEffect(() => {
    if (showSuccessMessage) {
      message.success('El proceso ha sido realizado');
      setShowSuccessMessage(false);
    }
  }, [showSuccessMessage]);

  const isAdminOrPastorOrTesor = roles.some((role) => {
    // Verificar si el usuario tiene los roles de administrador, pastor o tesorero
    return role.role_name === 'Administrador' || role.role_name === 'Pastor' || role.role_name === 'Tesorero';
  });

  return (
    <a.div style={springProps} className={styles.container}>
      <br />
      {typeTreasuries.map((typeTreasury) => (
        <a.div className={styles.card} key={typeTreasury.TypeTreasury_code}>
          <h2 className={styles.title}>{typeTreasury.TypeTreasury_title}</h2>
          <br />
          <Table
            dataSource={treasuries
              .filter((treasury) => treasury.TypeTreasury_code === typeTreasury.TypeTreasury_code)
              .sort((a, b) => new Date(b.activity_date) - new Date(a.activity_date))}
            pagination={{ pageSize: 30 }}
            rowKey="activity_code"
            style={{ marginBottom: '20px' }}
            columns={columns}
          />
        </a.div>
      ))}

      {renderTotalBalanceButton()}
      <br />
      <br />
      {isAdminOrPastorOrTesor && (
        <a.div className={styles.card} key="new" ref={formRef}>
          <Form form={form} layout="vertical" onFinish={handleNewSubmit}>
            <h2 className={styles.title}>Nueva Actividad</h2>
            <br />
            <Form.Item label="Descripción" name="activity_description" rules={[{ required: true }]}>
              <Input placeholder="Descripción" />
            </Form.Item>
            <Form.Item
              label="Valor"
              name="activity_value"
              rules={[
                { required: true },
                {
                  validator: validateNumber,
                },
              ]}
            >
              <Input placeholder="Valor" type="number" min={0} />
            </Form.Item>
            <Form.Item label="Tipo" name="TypeTreasury_code" rules={[{ required: true }]}>
              <Select placeholder="Seleccionar Tipo">
                {typeTreasuries.map((typeTreasury) => (
                  <Option key={typeTreasury.TypeTreasury_code} value={typeTreasury.TypeTreasury_code}>
                    {typeTreasury.TypeTreasury_title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<FaPlus />}>
                {editingTreasury ? 'Actualizar' : 'Añadir'}
              </Button>
            </Form.Item>
          </Form>
        </a.div>
      )}
    </a.div>
  );
};

export default Treasuries;
