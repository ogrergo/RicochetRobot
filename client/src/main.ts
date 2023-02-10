import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { io } from "socket.io-client";

import './assets/main.css'

const app = createApp(App)
var socket = io();
socket.on('connect', function () {
    socket.emit('my event', { data: 'I\'m connected!' });
});

app.use(router)

app.mount('#app')
