<template>
    <div class="message-card" @click="voirConversation">
        <div class="image-container">
            <!-- Vérification de l'image -->
            <img 
                v-if="conversation && conversation.Annonce && conversation.Annonce.Images && conversation.Annonce.Images[0] && conversation.Annonce.Images[0].image_base64" 
                :src="'data:image/jpeg;base64,' + conversation.Annonce.Images[0].image_base64" 
                alt="Image de l'annonce" 
            />
            <p v-else>Pas d'image disponible</p>
        </div>
        <div class="message-details">
            <!-- Vérification des autres données -->
            <h2>{{ conversation.Annonce?.title || 'Titre non disponible' }}</h2>
            <p class="last-message">{{ conversation.last_message || 'Aucun message' }}</p>
            <p class="annonce-info">
                <span>{{ conversation.Annonce?.User?.identifiant || 'Utilisateur inconnu' }}</span> - 
                <span>{{ formattedDate }}</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        conversation: {
            type: Object,
            required: true
        }
    },
    computed: {
        formattedDate() {
            if (!this.conversation.updated_at) {
                console.warn("La date `updated_at` est absente ou invalide :", this.conversation.updated_at);
                return 'Date inconnue';
            }
            console.log("Date formatée :", new Date(this.conversation.updated_at).toLocaleString());
            return new Date(this.conversation.updated_at).toLocaleString();
        }
    },
    methods: {
        voirConversation() {
            if (this.conversation.id) {
                console.log("Redirection vers la conversation :", this.conversation.id);
                this.$router.push(`/message/${this.conversation.id}`);
            } else {
                console.warn("ID de conversation non défini !");
            }
        }
    },
    mounted() {
        // Log pour vérifier les données reçues
        console.log("Conversation reçue :", this.conversation);

        if (this.conversation.Annonce) {
            console.log("Détails de l'annonce :", this.conversation.Annonce);
        } else {
            console.warn("Annonce manquante dans la conversation.");
        }

        if (this.conversation.Annonce?.Images) {
            console.log("Images de l'annonce :", this.conversation.Annonce.Images);

            if (this.conversation.Annonce.Images[0]?.image_base64) {
                console.log("Première image Base64 :", this.conversation.Annonce.Images[0].image_base64);
            } else {
                console.warn("La première image est absente ou son Base64 est invalide.");
            }
        } else {
            console.warn("Pas d'images dans l'annonce.");
        }
    }
};
</script>

<style scoped>
.message-card {
    display: flex;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin: 10px;
    cursor: pointer;
}

.image-container {
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 10px;
    margin-right: 20px;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.message-details {
    flex: 1;
}

.message-details h2 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
}

.message-details .last-message {
    font-size: 16px;
    margin-bottom: 10px;
    color: #666;
}

.message-details .annonce-info {
    font-size: 14px;
    color: #999;
}
</style>