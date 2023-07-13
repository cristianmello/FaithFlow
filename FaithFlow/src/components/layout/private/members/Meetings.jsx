import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Select, Pagination, Modal, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { Global } from '../../../../helpers/Global';

import es_ES from 'antd/es/locale/es_ES';
import moment from 'moment';
import 'moment/locale/es';
import useRoles from '../../../../hooks/useRoles';

const { Option } = Select;

export const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [members, setMembers] = useState([]);
  const [meetingMembers, setMeetingMembers] = useState([]);
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [deselectedMembers, setDeselectedMembers] = useState([]);
  const [currentMeetingCode, setCurrentMeetingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const { roles } = useRoles();

  useEffect(() => {
    fetchMeetings();
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(Global.url + 'member/list', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      setMembers(response.data.members);
      setLoading(false);
    } catch (error) {
      setError('Error al obtener la lista de miembros');
      setLoading(false);
    }
  };

  const fetchMeetingMembers = async (meetingCode) => {
    try {
      const response = await axios.get(Global.url + 'meeting/' + meetingCode + '/members', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      setMeetingMembers(response.data.members || []);
      setSelectedMembers(response.data.members.map(member => member.member_code));
      setDeselectedMembers([]);

    } catch (error) {
      console.error(error);
      setMeetingMembers([]);
    }
  };

  const handleAddMemberModalClose = () => {
    setIsAddMemberModalVisible(false);
  };

  const handleAddMemberClick = (meetingCode) => {
    setCurrentMeetingCode(meetingCode);
    fetchMeetingMembers(meetingCode);
    setIsAddMemberModalVisible(true);
  };

  const handleCheckboxChange = (checked, memberCode) => {
    let updatedSelectedMembers = [];
    if (checked) {
      updatedSelectedMembers = [...selectedMembers, memberCode];
      setDeselectedMembers((prev) => prev.filter((m) => m !== memberCode));
    } else {
      updatedSelectedMembers = selectedMembers.filter((m) => m !== memberCode);
      setDeselectedMembers((prev) => [...prev, memberCode]);
    }

    setSelectedMembers(updatedSelectedMembers);
  };

  const handleAddMembers = async () => {
    try {

      for (const memberCode of selectedMembers) {
        await axios.post(Global.url + `meeting/${currentMeetingCode}/meetings/${memberCode}/associate`, null, {
          headers: {
            Authorization: token,
          },
        });
      }

      for (const memberCode of deselectedMembers) {
        await axios.delete(Global.url + `meeting/${currentMeetingCode}/meetings/${memberCode}/disassociate`, {
          headers: {
            Authorization: token,
          },
        });
      }

      setSelectedMembers([]);
      setDeselectedMembers([]);
      setIsAddMemberModalVisible(false);
      fetchMeetings();
    } catch (error) {
      console.error(error);
    }
  };


  const handleCancelAddMembers = () => {
    setSelectedMembers([]);
    setIsAddMemberModalVisible(false);
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(Global.url + 'meeting/', {
        headers: {
          Authorization: token,
        },
      });

      const sortedMeetings = response.data.sort((a, b) => {
        // Ordenar las reuniones por fecha de manera descendente
        return new Date(b.meeting_data) - new Date(a.meeting_data);
      });

      setMeetings(sortedMeetings);
      setFilteredMeetings(sortedMeetings);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleYearChange = (value) => {
    setYear(value);
    filterMeetings(value, month);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
    filterMeetings(year, value);
  };

  const filterMeetings = (selectedYear, selectedMonth) => {
    let filtered = meetings;

    if (selectedYear) {
      filtered = filteredMeetings.filter((meeting) => {
        const year = new Date(meeting.meeting_data).getFullYear();
        return year.toString() === selectedYear;
      });
    }

    if (selectedMonth) {
      filtered = filtered.filter((meeting) => {
        const month = new Date(meeting.meeting_data).getMonth() + 1;
        return month === parseInt(selectedMonth);
      });
    }

    setFilteredMeetings(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setYear('');
    setMonth('');
    setFilteredMeetings(meetings);
    setCurrentPage(1);
  };

  const years = Array.from(
    new Set(filteredMeetings.map((meeting) => new Date(meeting.meeting_data).getFullYear()))
  );

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMeetings = filteredMeetings.slice(startIndex, endIndex);
  const totalMeetings = filteredMeetings.length;
  const totalPages = Math.ceil(totalMeetings / pageSize);

  const isAdminOrPastor = roles.some((role) => {
    // Verificar si el usuario tiene los roles de administrador o Pastor
    return role.role_name === 'Administrador' || role.role_name === 'Pastor';
  });

  const columns = [
    {
      title: 'Descripción',
      dataIndex: 'meeting_description',
      key: 'meeting_description',
    },
    {
      title: 'Fecha',
      dataIndex: 'meeting_data',
      key: 'meeting_data',
    },
    {
      title: 'Hora de inicio',
      dataIndex: 'meeting_starttime',
      key: 'meeting_starttime',
    },
    {
      title: 'Hora de finalización',
      dataIndex: 'meeting_finishtime',
      key: 'meeting_finishtime',
    },
    {
      title: 'Miembros',
      key: 'members',
      render: (text, record) => (
        <Link to={`/social/miembros/reunion/${record.meeting_code}/presencias`}>
          <Button type="primary">Ver miembros</Button>
        </Link>
      ),
    },
    {
      title: 'Modificar presencias',
      key: 'addMember',
      render: (text, record) => (
        isAdminOrPastor && (
          <Button type="primary" onClick={() => handleAddMemberClick(record.meeting_code)}>
            Modificar presencias
          </Button>)
      ),
    },
  ];

  return (
    <div>
      <br />
      <Form layout="inline">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Form.Item label="Año">
              <Select onChange={handleYearChange} value={year} placeholder="Seleccione año">
                <Option key="all" value="">
                  Seleccione año
                </Option>
                {years.map((year) => (
                  <Option key={year.toString()} value={year.toString()}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <br />
          <div>
            <Form.Item label="Mes">
              <Select onChange={handleMonthChange} value={month} placeholder="Seleccione mes">
                <Option key="all" value="">
                  Seleccione mes
                </Option>
                {months.map((month, index) => (
                  <Option key={index.toString()} value={(index + 1).toString()}>
                    {month}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Button onClick={clearFilters} style={{ color: 'black !important' }}>
              Volver a seleccionar
            </Button>
          </div>
        </div>
      </Form>
      <Table
        dataSource={paginatedMeetings}
        columns={columns}
        pagination={false}
        loading={loading}
        locale={es_ES}
        rowKey={(record) => record.id}
      />
      <br />
      {totalMeetings > pageSize && (
        <Pagination
          total={totalMeetings}
          pageSize={pageSize}
          current={currentPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          showTotal={(total) => `Total ${total} reuniones`}
          locale={es_ES}
        />
      )}
      <br />
      <Modal
        title="Añadir miembro a la reunión"
        open={isAddMemberModalVisible}
        onCancel={handleCancelAddMembers}
        footer={[
          <Button key="back" onClick={handleCancelAddMembers}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddMembers}>
            Confirmar
          </Button>,
        ]}
      >
        {members.map((member) => (
          <Checkbox
            key={member.member_code.toString()}
            checked={selectedMembers.includes(member.member_code)}  // Agregamos la prop checked
            onChange={(e) => handleCheckboxChange(e.target.checked, member.member_code)}
          >
            {`${member.member_name} ${member.member_lastname}`}
          </Checkbox>
        ))}
      </Modal>
    </div>
  );

};
