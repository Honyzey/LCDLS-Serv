<template>
    <div class="message-card" @click="voirConversation">
        <div class="image-container">
            <img :src="'data:image/jpeg;base64,' + conversation.Annonce.Images[0].image_base64"
                alt="Image de l'annonce" />
        </div>
        <div class="message-details">
            <h2>{{ conversation.Annonce.title }}</h2>
            <p class="last-message">{{ conversation.last_message }}</p>
            <p class="annonce-info">
                <span>{{ conversation.Annonce.User.identifiant }}</span> -
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
            return new Date(this.conversation.updated_at).toLocaleString();
        }
    },
    methods: {
        voirConversation() {
            this.$router.push(`/message/${this.conversation.id}`);
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