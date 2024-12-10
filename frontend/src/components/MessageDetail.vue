<template>
    <div class="details-page">
        <section class="details-messages">
            <div id="message-details">
                <h2 v-if="annonce.User">Conversation avec {{ annonce.User.identifiant }} pour l'annonce "{{
                    annonce.title }}"</h2>
                <div class="messages">
                    <div v-for="message in messages" :key="message.id"
                        :class="{ 'message-sent': message.sender_id === userId, 'message-received': message.sender_id !== userId }">
                        <p>{{ message.content }}</p>
                        <span>{{ new Date(message.created_at).toLocaleString() }}</span>
                    </div>
                </div>
                <form @submit.prevent="envoyerMessage">
                    <textarea v-model="nouveauMessage" placeholder="Écrire un message..."></textarea>
                    <button type="submit">Envoyer</button>
                </form>
            </div>
        </section>

        <div class="user-card" v-if="user">
            <router-link :to="{ name: 'ProfilDetail', params: { id: user.id } }">
                <h3>{{ user.identifiant }}</h3>
            </router-link>
            <p v-if="user.Annonces.length > 1">{{ user.Annonces.length }} annonces postées</p>
            <p>Dernière connexion : {{ user.last_connexion }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import socket from '../services/socket';

export default {
    data() {
        return {
            annonce: {},
            messages: [],
            nouveauMessage: '',
            userId: null,
            user: null
        };
    },
    async created() {
        const conversationId = this.$route.params.id;
        try {
            const response = await axios.get(`https://api.local-shyphem.site/messages/conversation/${conversationId}`, {
                withCredentials: true
            });
            this.messages = response.data;
            if (response.data.length > 0) {
                this.annonce = response.data[0].Conversation.Annonce || {};
                this.userId = response.data[0].sender_id;
                this.fetchUser(this.annonce.user_id);
            }

            socket.emit('joinConversation', conversationId);

            socket.on('newMessage', (message) => {
                console.log('Nouveau message reçu:', message);
                this.messages.push(message);
            });

        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
        }
    },
    methods: {
        async fetchUser(userId) {
            try {
                const response = await axios.get(`https://api.local-shyphem.site/users/${userId}`);
                this.user = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
            }
        },
        async envoyerMessage() {
            if (this.nouveauMessage.trim() === '') return;

            const message = {
                conversation_id: this.$route.params.id,
                content: this.nouveauMessage
            };

            console.log('Envoi du message:', message);

            socket.emit('sendMessage', message, (response) => {
                console.log('Réponse du serveur:', response);
                if (response.status === 'ok') {
                    // Ne pas ajouter le message ici, il sera ajouté par l'événement 'newMessage'
                    this.nouveauMessage = '';
                } else {
                    console.error('Erreur lors de l\'envoi du message:', response.error);
                }
            });
        }
    }
};
</script>

<style scoped>
.details-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.details-messages {
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    max-width: 800px;
    width: 100%;
    position: relative;
}

#message-details {
    width: 100%;
}

.messages {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
}

.message-sent {
    text-align: right;
    background-color: #e0f7fa;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
}

.message-received {
    text-align: left;
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
}

form {
    display: flex;
    flex-direction: column;
}

textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
    resize: none;
}

button {
    padding: 10px;
    background-color: #2980B9;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #1e6391;
}

.user-card {
    width: 300px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-left: 20px;
    text-align: center;
    align-self: flex-start;
}

.user-card h3 {
    font-size: 24px;
    margin-bottom: 10px;
}

.user-card p {
    font-size: 16px;
    margin-bottom: 10px;
    color: #666;
}

.user-card .btn-primary {
    background-color: #2980B9;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}

.user-card .btn-primary:hover {
    background-color: #1e6391;
}
</style>