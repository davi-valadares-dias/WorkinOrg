require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Academia = require('./models/Academia');
const Admin = require('./models/Admin');

async function seed() {
  try {
    // Conectar ao banco
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar dados existentes (apenas para desenvolvimento)
    // Descomente se quiser resetar o banco
    // await Academia.deleteMany({});
    // await Admin.deleteMany({});

    // Verificar se já existe academia
    let academia = await Academia.findOne({ nome: 'Academia Padrão' });

    if (!academia) {
      academia = await Academia.create({
        nome: 'Academia Padrão',
        email: 'academia@workinorg.com',
        cnpj: '12345678000190',
        telefone: '(11) 98765-4321',
        endereco: 'Rua Principal, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        descricao: 'Sua academia de fitness e treinamento'
      });
      console.log('✅ Academia criada:', academia.nome);
    } else {
      console.log('ℹ️  Academia já existe');
    }

    // Verificar se já existe admin
    let admin = await Admin.findOne({ email: 'admin@workinorg.com' });

    if (!admin) {
      admin = await Admin.create({
        nome: 'Administrador',
        email: 'admin@workinorg.com',
        senha: 'admin123', // Será hasheado automaticamente por causa do pre-save
        academia: academia._id,
        telefone: '(11) 98765-4321',
        ativo: true
      });
      console.log('✅ Admin criado com sucesso');
      console.log('📧 Email:', admin.email);
      console.log('🔐 Senha: admin123');
    } else {
      console.log('ℹ️  Admin já existe');
    }

    console.log('\n✨ Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error.message);
    process.exit(1);
  }
}

seed();
