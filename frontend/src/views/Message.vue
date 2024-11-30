<template>
    <section class="conversations">
        <h2>Mes Conversations</h2>
        <div id="conversation-list">
            <ConvCard v-for="conversation in conversations" :key="conversation.id" :conversation="conversation" />
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import ConvCard from '../components/ConvCard.vue';

export default {
    components: {
        ConvCard
    },
    data() {
        return {
            conversations: []
        };
    },
    async created() {
        try {
            console.log('Récupération des conversations');
            const response = await axios.get('http://api.local-shyphem.site/messages/conversations', {
                withCredentials: true
            });
            console.log('Conversations récupérées:', response.data);
            this.conversations = response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des conversations:', error);
        }
    }
};
</script>

<style scoped>
.conversations {
    padding: 20px;
    background-color: #f9f9f9;
}

#conversation-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
</style>