// models/ConversationParticipant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ConversationParticipant = sequelize.define('ConversationParticipant', {
    conversation_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Conversations',
            key: 'id',
        },
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        },
        allowNull: false,
    },
}, {
    tableName: 'conversation_participants',
    timestamps: false,
});

module.exports = ConversationParticipant;