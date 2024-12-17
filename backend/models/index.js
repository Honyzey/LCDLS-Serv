const sequelize = require('../config/db');
const User = require('./User');
const Annonce = require('./Annonce');
const Categorie = require('./Categorie');
const Image = require('./Image');
const Conversation = require('./Conversation');
const ConversationParticipant = require('./ConversationParticipant');
const Message = require('./Message');

// Définir les associations entre les modèles
Annonce.belongsTo(User, { foreignKey: 'user_id', foreignKeyConstraints: false });
User.hasMany(Annonce, { foreignKey: 'user_id', foreignKeyConstraints: false });

Annonce.belongsTo(Categorie, { foreignKey: 'categorie_id', foreignKeyConstraints: false });
Categorie.hasMany(Annonce, { foreignKey: 'categorie_id', foreignKeyConstraints: false });

Annonce.hasMany(Image, { foreignKey: 'annonce_id', foreignKeyConstraints: false });
Image.belongsTo(Annonce, { foreignKey: 'annonce_id', foreignKeyConstraints: false });

Message.belongsTo(Conversation, { foreignKey: 'conversation_id', foreignKeyConstraints: false });
Conversation.hasMany(Message, { foreignKey: 'conversation_id', foreignKeyConstraints: false });

Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id', foreignKeyConstraints: false });

Conversation.belongsTo(Annonce, { foreignKey: 'annonce_id', foreignKeyConstraints: false });
Annonce.hasMany(Conversation, { foreignKey: 'annonce_id', foreignKeyConstraints: false });

Conversation.belongsToMany(User, { through: ConversationParticipant, foreignKey: 'conversation_id', foreignKeyConstraints: false });
User.belongsToMany(Conversation, { through: ConversationParticipant, foreignKey: 'user_id', foreignKeyConstraints: false });

module.exports = {
    sequelize,
    User,
    Annonce,
    Categorie,
    Image,
    Message,
    Conversation,
    ConversationParticipant
};