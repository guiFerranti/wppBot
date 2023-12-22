import fs from 'fs';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcodeTerminal from 'qrcode-terminal';

// Caminho onde os dados da sessão serão armazenados
const SESSION_FILE_PATH = './session.json';

// Carregue os dados da sessão se eles tiverem sido salvos anteriormente
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = JSON.parse(fs.readFileSync(SESSION_FILE_PATH));
}

// Use os valores salvos
const client = new Client({
    authStrategy: new LocalAuth({
        session: sessionData
    })
});

client.initialize();

client.on('loading_screen', (percent, message) => {
  console.log('LOADING SCREEN', percent, message);
});

// Salve os valores da sessão no arquivo após a autenticação bem-sucedida
client.on('authenticated', (session) => {
  if (session) {
      sessionData = session;
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
  } else {
      console.log('No session data was returned');
  }
});

client.on('qr', qr => {
    console.log(qr)
    // Exibe o QR Code no terminal

    qrcodeTerminal.generate(qr, {small: true});
});

client.on('auth_failure', msg => {
  // Fired if session restore was unsuccessful
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  console.log('READY');
});


client.on('message', async msg => {
  
  console.log(msg.body)
  
})
