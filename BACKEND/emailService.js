const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verificar conexión al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error.message);
  } else {
    console.log('✅ Servidor de email listo para enviar mensajes');
  }
});

// Enviar confirmación al participante
const sendConfirmationEmail = async (participantEmail, participantName, eventDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: participantEmail,
    subject: `Confirmación de registro - ${eventDetails.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">¡Hola ${participantName}!</h2>
        <p>Tu registro ha sido confirmado para el evento:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">${eventDetails.title}</h3>
          ${eventDetails.description ? `<p style="color: #666; font-style: italic;">${eventDetails.description}</p>` : ''}
          <p><strong>📅 Fecha:</strong> ${new Date(eventDetails.date).toLocaleDateString('es-GT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p><strong>🕐 Hora:</strong> ${eventDetails.time}</p>
          <p><strong>📍 Ubicación:</strong> ${eventDetails.location}</p>
        </div>
        <p style="color: #666;">¡Nos vemos allí!</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="font-size: 12px; color: #999;">Este es un correo automático, por favor no responder.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado a:', participantEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    throw error;
  }
};

// 🆕 Notificar al administrador cuando se crea un evento
const notifyAdminNewEvent = async (eventDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Se envía a tu propio correo
    subject: `🎉 Nuevo evento creado: ${eventDetails.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0;">🎉 Nuevo Evento Creado</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333;">Se ha creado un nuevo evento en el sistema:</p>
          
          <div style="background-color: #f9f9f9; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h2 style="color: #667eea; margin-top: 0;">${eventDetails.title}</h2>
            
            ${eventDetails.description ? `
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <strong style="color: #666;">📝 Descripción:</strong>
              <p style="color: #666; margin: 10px 0 0 0;">${eventDetails.description}</p>
            </div>
            ` : ''}
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
              <strong style="color: #666;">📅 Fecha:</strong>
              <p style="color: #333; margin: 5px 0 0 0; font-weight: bold;">
                ${new Date(eventDetails.date).toLocaleDateString('es-GT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
              <strong style="color: #666;">🕐 Hora:</strong>
              <p style="color: #333; margin: 5px 0 0 0; font-weight: bold;">${eventDetails.time}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
              <strong style="color: #666;">📍 Ubicación:</strong>
              <p style="color: #333; margin: 5px 0 0 0; font-weight: bold;">${eventDetails.location}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
              <strong style="color: #666;">👥 Capacidad máxima:</strong>
              <p style="color: #333; margin: 5px 0 0 0; font-weight: bold;">${eventDetails.maxParticipants} personas</p>
            </div>
          </div>
          
          <div style="background: #e8f4f8; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>📆 Fecha de creación:</strong> ${new Date().toLocaleString('es-GT')}
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #999;">Sistema de Gestión de Eventos</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Notificación enviada al admin (fbarriossdt@gmail.com)');
    return { success: true };
  } catch (error) {
    console.error('❌ Error al enviar notificación al admin:', error.message);
    throw error;
  }
};

module.exports = { 
  sendConfirmationEmail,
  notifyAdminNewEvent 
};