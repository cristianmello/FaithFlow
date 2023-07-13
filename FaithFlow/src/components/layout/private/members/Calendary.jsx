import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import Modal from "react-modal";
import { Global } from "../../../../helpers/Global";
import { Form, Input, Button } from 'antd';
import styles from '../../../../assets/css/calendary.module.css';
import useRoles from "../../../../hooks/useRoles";
import esLocale from '@fullcalendar/core/locales/es';
import { Modal as AntdModal, message } from 'antd';


Modal.setAppElement("#root");

export const Calendary = () => {
    const [meetings, setMeetings] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [optionsModalIsOpen, setOptionsModalIsOpen] = useState(false);
    const [form] = Form.useForm();
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const { roles } = useRoles();

    useEffect(() => {
        fetchMeetings();
    }, []);

    const token = localStorage.getItem("token");

    const fetchMeetings = async () => {
        try {
            const response = await axios.get(Global.url + "meeting/", {
                headers: {
                    Authorization: token,
                },
            });
            console.log(response.data);
            setMeetings(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedMeeting) {
                await axios.patch(Global.url + "meeting/" + selectedMeeting.meeting_code + "/", values, {
                    headers: {
                        Authorization: token,
                    },
                });
            } else {
                await axios.post(Global.url + "meeting/", values, {
                    headers: {
                        Authorization: token,
                    },
                });
            }
            closeModal();
            fetchMeetings();
        } catch (error) {
            console.error(error);
        }
    };


    const handleDeleteMeeting = (meeting) => {
        AntdModal.confirm({
            title: '¿Estás seguro de que quieres eliminar esta reunión?',
            onOk: async () => {
                try {
                    await axios.delete(Global.url + "meeting/" + meeting.meeting_code, {
                        headers: {
                            Authorization: token,
                        },
                    });
                    closeOptionsModal();
                    fetchMeetings();
                    message.success('Reunión eliminada exitosamente!');
                } catch (error) {
                    console.error(error);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleDateClick = (arg) => {
        setSelectedMeeting(null);
        form.setFieldsValue({
            meeting_data: arg.dateStr,
        });
        openModal();
    };

    const handleEventClick = ({ event }) => {
        const meeting = meetings.find(m => m.meeting_code.toString() === event.id);
        if (meeting) {
            setSelectedMeeting(meeting);
            form.setFieldsValue({
                meeting_description: meeting.meeting_description,
                meeting_data: meeting.meeting_data,
                meeting_starttime: meeting.meeting_starttime,
                meeting_finishtime: meeting.meeting_finishtime,
            });
            openOptionsModal();
        }
    };


    const openModal = () => {
        setModalIsOpen(true);
        closeOptionsModal();
    };

    const closeModal = () => {
        setModalIsOpen(false);
        form.resetFields();
    };

    const openOptionsModal = () => {
        setOptionsModalIsOpen(true);
    };

    const closeOptionsModal = () => {
        setOptionsModalIsOpen(false);
    };

    const isAdminOrPastor = roles.some((role) => {
        // Verificar si el usuario tiene los roles de administrador o Pastor
        return role.role_name === 'Administrador' || role.role_name === 'Pastor';
    });

    return (
        <div className={`${styles.fullCalendar} ${modalIsOpen || optionsModalIsOpen ? styles.fullCalendarShowModal : ""}`}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={"dayGridMonth"}
                locale={esLocale}
                headerToolbar={{
                    start: "today prev,next",
                    center: "title",
                    end: "dayGridMonth",
                }}
                height={"100vh"}
                events={meetings.map((meeting) => ({
                    id: meeting.meeting_code,
                    title: meeting.meeting_description,
                    start: meeting.meeting_data,
                    allDay: true,
                }))}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
            />
            <Modal
                className={`${styles.modalOverlay} ${modalIsOpen ? styles.modalOverlayShowModal : ""}`}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Agregar Reunión"
            >
                <div className={`${styles.modalContent} ${modalIsOpen ? styles.modalContentShowModal : ""}`}>
                    <h2>Agregar Reunión</h2>
                    <Form form={form} onFinish={handleSubmit}>
                        <Form.Item name="meeting_description" label="Descripción:">
                            <Input />
                        </Form.Item>
                        <Form.Item name="meeting_data" label="Fecha:">
                            <Input type="date" disabled />
                        </Form.Item>
                        <Form.Item name="meeting_starttime" label="Hora de inicio:">
                            <Input type="time" />
                        </Form.Item>
                        <Form.Item name="meeting_finishtime" label="Hora de finalización:">
                            <Input type="time" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Agregar Reunión
                            </Button>
                            <Button htmlType="button" onClick={closeModal}>
                                Cerrar
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            <Modal
                className={`${styles.modalOverlay} ${optionsModalIsOpen ? styles.modalOverlayShowModal : ""}`}
                isOpen={optionsModalIsOpen}
                onRequestClose={closeOptionsModal}
                contentLabel="Opciones de Reunión"
            >
                <div className={`${styles.modalContent} ${optionsModalIsOpen ? styles.modalContentShowModal : ""}`}>
                    <h2>Opciones de Reunión</h2>
                    {selectedMeeting && (
                        <>
                            <p><strong>Descripción:</strong> {selectedMeeting.meeting_description}</p>
                            <p><strong>Hora de inicio:</strong> {selectedMeeting.meeting_starttime}</p>
                            <p><strong>Hora de finalización:</strong> {selectedMeeting.meeting_finishtime}</p>
                        </>
                    )}
                    {isAdminOrPastor && (
                        <Button type="primary" onClick={openModal}>
                            Editar
                        </Button>
                    )
                    }
                    {isAdminOrPastor && (
                        <Button type="danger" onClick={() => handleDeleteMeeting(selectedMeeting)}>
                            Eliminar
                        </Button>
                    )
                    }
                    <Button style={{ color: 'black', backgroundColor: 'white' }} className="ant-btn" htmlType="button" onClick={closeOptionsModal}>
                        Cerrar
                    </Button>


                </div>
            </Modal>

        </div>
    );
};
