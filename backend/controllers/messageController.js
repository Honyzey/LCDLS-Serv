// controllers/messageController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Annonce = require('../models/Annonce');
const { Op } = require('sequelize');

const getConversations = async (req, res) => {
    const userId = req.user.id;

    try {
        const conversations = await Conversation.findAll({
            where: {
                participants: {
                    [Op.like]: `%${userId}%`
                }
            },
            include: [
                {
                    model: Annonce,
                    include: [User]
                }
            ],
            order: [['updated_at', 'DESC']]
        });

        res.status(200).json(conversations);
    } catch (error) {
        console.error('Erreur lors de la récupération des conversations:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getConversationDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const messages = await Message.findAll({
            where: { conversation_id: id },
            include: [
                {
                    model: User,
                    as: 'sender'
                },
                {
                    model: Conversation,
                    include: [
                        {
                            model: Annonce,
                            include: [User]
                        }
                    ]
                }
            ],
            order: [['created_at', 'ASC']]
        });

        if (messages.length === 0) {
            return res.status(404).json({ message: 'Conversation non trouvée' });
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la conversation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const createConversation = async (req, res) => {
    const { annonce_id, destinataire_id, content } = req.body;
    const sender_id = req.user.id;

    try {
        // Vérifiez si une conversation existe déjà entre les deux utilisateurs pour cette annonce
        let conversation = await Conversation.findOne({
            where: {
                annonce_id,
                participants: {
                    [Op.like]: `%${sender_id}%`,
                    [Op.like]: `%${destinataire_id}%`
                }
            }
        });

        if (!conversation) {
            // Créez une nouvelle conversation si elle n'existe pas
            conversation = await Conversation.create({
                annonce_id,
                participants: JSON.stringify([sender_id, destinataire_id]),
                last_message: content,
                updated_at: new Date()
            });
        }

        // Créez le message
        const message = await Message.create({
            conversation_id: conversation.id,
            sender_id,
            content
        });

        res.status(201).json({ conversation_id: conversation.id });
    } catch (error) {
        console.error('Erreur lors de la création de la conversation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const sendMessage = async (req, res) => {
    const { conversation_id, content } = req.body;
    const sender_id = req.user.id;

    try {
        const message = await Message.create({
            conversation_id,
            sender_id,
            content
        });

        await Conversation.update(
            { last_message: content, updated_at: new Date() },
            { where: { id: conversation_id } }
        );

        res.status(201).json(message);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { getConversations, getConversationDetails, sendMessage, createConversation };