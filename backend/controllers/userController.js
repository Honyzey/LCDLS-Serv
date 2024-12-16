// controllers/userController.js
const User = require('../models/User');
const Annonce = require('../models/Annonce');
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

const getUserInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            include: [{ model: Annonce }],
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Formater la date de la dernière connexion avec Moment.js
        const formattedLastConnexion = moment(user.last_connexion).format('DD/MM/YYYY HH:mm:ss');
        // Formater la date d'inscription avec Moment.js
        const formattedInscriptionDate = moment(user.inscription_date).format('DD/MM/YYYY HH:mm:ss');

        res.status(200).json({
            ...user.toJSON(),
            last_connexion: formattedLastConnexion,
            inscription_date: formattedInscriptionDate
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getUserProfile = async (req, res) => {

    const { id } = req.user;

    try {
        const userProfile = await User.findByPk(id, {
            include: [{ model: Annonce }],
        });

        if (!userProfile) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Formater la date d'inscription avec Moment.js
        const formattedInscriptionDate = moment(userProfile.inscription_date).format('DD/MM/YYYY HH:mm:ss');

        res.status(200).json({
            mail: userProfile.mail,
            identifiant: userProfile.identifiant,
            inscription_date: formattedInscriptionDate,
            annonces: userProfile.Annonces,
        });
    } catch (error) {
        console.error(chalk.red('Erreur lors de la récupération du profil de l\'utilisateur:', error));
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteUserAccount = async (req, res) => {

    const { id } = req.user;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        user.statut = 'supprimé';
        await user.save();

        res.status(200).json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
        console.error(chalk.red('Erreur lors de la suppression du compte:', error));
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteAnnonce = async (req, res) => {
    const annonceId = req.params.id;
    const userId = req.user.id; // ID de l'utilisateur connecté, récupéré depuis le middleware d'authentification

    try {
        // Vérifie que l'annonce existe et appartient à l'utilisateur
        const annonce = await Annonce.findOne({
            where: {
                id: annonceId,
                user_id: userId, // Vérifie que l'annonce appartient bien à l'utilisateur connecté
            },
        });

        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée ou non autorisée.' });
        }

        // Supprime l'annonce
        await annonce.destroy();

        res.status(200).json({ message: 'Annonce supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'annonce :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

module.exports = { getUserInfo, getUserProfile, deleteUserAccount, deleteAnnonce };