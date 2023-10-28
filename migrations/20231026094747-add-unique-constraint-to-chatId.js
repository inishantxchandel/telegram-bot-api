'use strict';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.addConstraint('Users', {
      fields: ['chatId'],
      type: 'unique',
      name: 'unique_chatId_constraint',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeConstraint('Users', 'unique_chatId_constraint');
  },
};
