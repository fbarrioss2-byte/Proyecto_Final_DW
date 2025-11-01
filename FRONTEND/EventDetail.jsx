import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, deleteEvent } from '../services/api';
import ParticipantForm from '../components/ParticipantForm';
import ParticipantList from '../components/ParticipantList';
import './EventDetail.css';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const response = await getEventById(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Error al cargar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        await deleteEvent(id);
        navigate('/');
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        alert('Error al eliminar el evento');
      }
    }
  };

  const handleRegisterSuccess = () => {
    setShowRegisterForm(false);
    loadEvent();
  };

  if (loading) {
    return <div className="loading">Cargando evento...</div>;
  }

  if (!event) {
    return <div className="error">Evento no encontrado</div>;
  }

  return (
    <div className="event-detail-container">
      <div className="event-detail-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Volver
        </button>
        <div className="event-actions">
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="btn btn-secondary"
          >
            ✏️ Editar
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            🗑️ Eliminar
          </button>
        </div>
      </div>

      <div className="event-detail-content">
        <div className="event-main-info">
          <span className="event-category">{event.category}</span>
          <h1>{event.title}</h1>
          <p className="event-description">{event.description}</p>

          <div className="event-details-grid">
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div>
                <strong>Fecha</strong>
                <p>{new Date(event.date).toLocaleDateString('es-GT')}</p>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">🕐</span>
              <div>
                <strong>Hora</strong>
                <p>{event.time}</p>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div>
                <strong>Ubicación</strong>
                <p>{event.location}</p>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">👥</span>
              <div>
                <strong>Capacidad</strong>
                <p>{event.maxParticipants} personas</p>
              </div>
            </div>
          </div>

          {!showRegisterForm ? (
            <button
              onClick={() => setShowRegisterForm(true)}
              className="btn btn-primary btn-register"
            >
              📝 Registrarse en este Evento
            </button>
          ) : (
            <ParticipantForm
              eventId={id}
              onSuccess={handleRegisterSuccess}
              onCancel={() => setShowRegisterForm(false)}
            />
          )}
        </div>

        <div className="event-participants-section">
          <ParticipantList eventId={id} />
        </div>
      </div>
    </div>
  );
}

export default EventDetail;