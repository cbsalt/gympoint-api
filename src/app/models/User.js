// Arquivo reponsável pela manipulação dos dados de usuário
// (criar, deletar, alterar)

import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    // Criar objeto com todas as colunas
    // Referenciando init da classe pai
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Não existe na base de dados
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // Hooks: trechos de código executados de forma automática de acordo com
    // uma ação do model, ou seja, antes de ir para o banco de dados
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
