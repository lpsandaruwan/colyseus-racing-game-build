"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const colyseus_1 = require("colyseus");
const GameRoomState_1 = require("./schema/GameRoomState");
class GameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 2;
    }
    onCreate(options) {
        this.setState(new GameRoomState_1.GameRoomState());
        this.state.nextSpawnPosition.setValues(-110, 0.75, 220);
    }
    onJoin(client, options) {
        const newPlayer = new GameRoomState_1.Player();
        newPlayer.angularVelocity.setValues(0, 0.5, 0);
        newPlayer.spawnPosition.setObject(this.state.nextSpawnPosition);
        newPlayer.position.setObject(this.state.nextSpawnPosition);
        newPlayer.rotation.setValues(0, Math.PI / 2 + 0.35, 0);
        this.state.players.set(client.sessionId, newPlayer);
        console.log(client.sessionId, "joined!");
        if (newPlayer.position.x == -110) {
            this.state.nextSpawnPosition.setValues(-113, 0.75, 210);
        }
    }
    onLeave(client, consented) {
        const player = this.state.players.get(client.sessionId);
        this.state.nextSpawnPosition.setObject(player.spawnPosition);
        this.state.players.delete(client.sessionId);
        console.log(client.sessionId, "left!");
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
exports.GameRoom = GameRoom;
