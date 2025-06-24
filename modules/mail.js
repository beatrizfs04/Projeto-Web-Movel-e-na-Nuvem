var functions = {};
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true,
  auth: {
    user: 'apikey',
    pass: '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'
  }
});

  
functions.sendStateMail = async (email, num) => {
  try {
    const newTasks = `${num}`;

    const mailOptions = {
      from: '"MedRecover" <slayn@matz.pt>',
      to: email,
      subject: 'Link de Inicio de Sessão',
      text: `Olá, não se esqueça de fazer as suas tarefas, tem ${newTasks} nova(s) tarefa(s).`,
      html: `<p>Olá,</p><p>Não se esqueça de fazer as suas tarefas, tem ${newTasks} nova(s) tarefa(s).</p>`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};  
  
functions.sendPatientMail = async (email, id, token) => {
  try {
    const loginLink = `http://localhost:5000/?id=${id}&token=${token}`;

    const mailOptions = {
      from: '"MedRecover" <slayn@matz.pt>',
      to: email,
      subject: 'Link de Inicio de Sessão',
      text: `Olá, clica no seguinte link para fazeres login na app: ${loginLink}`,
      html: `<p>Olá,</p><p>clica no seguinte link para fazeres login na app:</p> <a href="${loginLink}">${loginLink}</a>`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};  

module.exports = functions;
