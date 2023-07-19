<template>
    <q-page class="column flex-center">
        
        
            <q-card style="max-width: 600px" class="col full-width" flat>
                <q-card-section>
                    <q-chat-message v-for="message in msgs" :key="message.index"
                    :text="[message.text]"
                    :sent="checkSent(message)"
                    />
                </q-card-section>
                <q-card-section style="width: 80%" class="full-width">
                    <q-input v-model="msg" type="text" placeholder="Message...">
                        <template v-slot:after>
                            <q-btn round dense flat text-color="black" icon="send" @click="sendMsg"/>
                        </template>
                    </q-input>
                </q-card-section>
            </q-card>
            
      
    </q-page>
</template>

<script>

import { defineComponent, ref} from 'vue'
import {Stomp} from "@stomp/stompjs"

export default defineComponent({
    setup() {
        const ws = "ws://localhost:15674/ws" 
        const client = Stomp.client(ws)

        const msg = ref("")

        const msgs = ref([])

        const user = window.Clerk.user

        const checkSent = (message) => {
            return message.user_id === user.id;
        };

        const onConnect = function() {
            console.log("connect")
            client.subscribe('/exchange/web-stomp-test', function (message) {
            msgs.value.push(JSON.parse(message.body))
            console.log('Received message: ' + msgs.value)})
        }

        const sendMsg = function () {
            client.send('/exchange/web-stomp-test', { "content-type": "text/plain" }, JSON.stringify({text: msg.value, user_id: user.id}));
            msg.value = ""
        }

        const onError = function (e) {
            console.log("error", e);
        }

        client.connect("guest", "guest", onConnect, onError);
        
        return{
            msg, sendMsg, ws, client, msgs, user, checkSent
        }
    },
})
</script>
