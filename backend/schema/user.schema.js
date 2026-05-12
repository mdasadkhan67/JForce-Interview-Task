const userSchema = {
  id: {
    type: 'INT',
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: 'VARCHAR(100)',
    required: true
  },
  username: {
    type: 'VARCHAR(50)',
    required: true,
    unique: true
  },
  email: {
    type: 'VARCHAR(100)',
    required: true,
    unique: true
  },
  password: {
    type: 'VARCHAR(255)',
    required: true
  },
  mobile: {
    type: 'VARCHAR(20)',
    required: true
  },
  createdAt: {
    type: 'TIMESTAMP',
    default: 'CURRENT_TIMESTAMP'
  },
  updatedAt: {
    type: 'TIMESTAMP',
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  }
};

module.exports = userSchema;