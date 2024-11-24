import WebSocket from 'ws';
import { scrapeProxys } from "./modules/proxyManager.js";
import { Client } from "./modules/userModule.js";
import config from './config.js';

const PORT = process.env.PORT || 3523;

console.log('Bots maintained by DaRealSh0T and keksbyte');

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server is running on port ${PORT}`);

function parsePT(pt) {
    var type = pt.toLowerCase();
    if (!['socks4', 'socks5', 'http'].includes(type))
        type = 'socks4';
    return type;
}

wss.on('listening', () => {
    console.log('WebSocket server is listening...');
    scrapeProxys(config.useProxyApi, parsePT(config.proxyType))
        .then(() => {
            console.log('Proxies scraped successfully');
        })
        .catch((err) => {
            console.error('Error while scraping proxies:', err);
        });
});

let clientCount = 0;

wss.on('connection', (ws, req) => {
    clientCount++;
    console.log(`Client connected. Total clients: ${clientCount}`);

    ws.Client = new Client(ws, req);

    ws.on('close', () => {
        clientCount--;
        console.log(`Client disconnected. Total clients: ${clientCount}`);
    });

    ws.on('error', (err) => {
        console.error('WebSocket client error:', err);
    });
});

wss.on('error', (error) => {
    console.error('WebSocket error:', error);
});

export function getConfig() {
    return config;
}
