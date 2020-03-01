// Criando o loader para os models
import Sequelize from 'sequelize';

// Importar o arquivo responsável pela manipulação das informações
// do banco para cada usuário
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import Checkin from '../app/models/Checkin';
import HelpOrder from '../app/models/HelpOrder';

// Importar as configurações de conexão de banco de dados
import databaseConfig from '../config/database';

// Vetor de models
const models = [User, Student, Plan, Enrollment, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
  }

  // Conexão com a base de dados
  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
