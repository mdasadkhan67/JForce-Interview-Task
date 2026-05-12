// Task schema for the Task Management system
// This schema documents the task table structure and property types.

const taskSchema = {
  id: {
    type: 'INT',
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: 'INT',
    required: true,
    description: 'References the user that owns this task'
  },
  expenseName: {
    type: 'VARCHAR(255)',
    required: true,
    description: 'Name or title of the expense/task'
  },
  amount: {
    type: 'DECIMAL(12,2)',
    required: true,
    description: 'Amount for the expense'
  },
  expenseDate: {
    type: 'DATE',
    required: true,
    description: 'Date of the expense'
  },
  description: {
    type: 'TEXT',
    required: false,
    description: 'Optional description for the expense'
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

module.exports = taskSchema;
