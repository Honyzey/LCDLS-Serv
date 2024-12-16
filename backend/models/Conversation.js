// models/Conversation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Annonce = require('./Annonce');

const Conversation = sequelize.define('Conversation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    participants: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    last_message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    annonce_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Annonce,
            key: 'id',
        },
        allowNull: false,
    },
}, {
    tableName: 'conversations',
    timestamps: false,
});

module.exports = Conversation;