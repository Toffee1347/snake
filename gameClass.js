module.exports = class {
    constructor(gameType, gameSpeed) {
        this.type = gameType;
        this.players = [];
        this.playerIds = [];
        this.state = 0;
        this.playerCount = 0;
        this.gameSpeed = gameSpeed;
    };
    emit(func, data) {
        this.players.forEach((el) => {
            el.emit(func, data);
        });
    };
    addPlayer(id, emit, name) {
        switch (this.state) {
            case 0:
                this.players[0] = {
                    id: id,
                    emit: emit,
                    name: name
                };
                this.playerIds[0] = id;
                this.playerCount++;
                emit('admin');
                this.state = 1;
            break;
            case 1:
                this.players.push({
                    id: id,
                    emit: emit,
                    name: name
                });
                this.playerIds.push(id);
                this.playerCount++;
        };
    };
};