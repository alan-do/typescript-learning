"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const luckyNumbersGame_1 = __importDefault(require("./luckyNumbersGame"));
const randomScreenNameGenerator_1 = __importDefault(require("./randomScreenNameGenerator"));
const player_1 = __importDefault(require("./player"));
const port = 3000;
class App {
    constructor(port) {
        this.players = {};
        this.port = port;
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        app.use('/jquery', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/jquery/dist')));
        app.use('/bootstrap', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/bootstrap/dist')));
        this.server = new http_1.default.Server(app);
        this.io = socket_io_1.default(this.server);
        this.game = new luckyNumbersGame_1.default();
        this.randomScreenNameGenerator = new randomScreenNameGenerator_1.default();
        this.io.on('connection', (socket) => {
            console.log('a user connected : ' + socket.id);
            let screenName = this.randomScreenNameGenerator.generateRandomScreenName();
            this.players[socket.id] = new player_1.default(screenName);
            socket.emit("playerDetails", this.players[socket.id].player);
            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
                if (this.players && this.players[socket.id]) {
                    delete this.players[socket.id];
                }
            });
            socket.on('chatMessage', function (chatMessage) {
                socket.broadcast.emit('chatMessage', chatMessage);
            });
        });
    }
    Start() {
        this.server.listen(this.port);
        console.log(`Server listening on port ${this.port}.`);
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map