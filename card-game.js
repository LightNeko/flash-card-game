/*:
* @param Card List
* @type struct<CardList>[]
* @text Card List
*/

/*~struct~CardList:
 * @param name
 * @type text
 * @param image
 * @type file
 * @dir img/pictures/
 * @param type
 * @type text
 * @default chara
 * @param ap cost
 * @type number
 * @default 1
 * @param attack
 * @type number
 * @default 0
 * @param hp
 * @type number
 * @default 0
 * @param movement
 * @type number
 * @default 0
 * @param defense
 * @type number
 * @default 0
 * @param inDeck
 * @type boolean
 * @default true
 * @param description1
 * @type text
 * @param description2
 * @type text
 */

//--------------------CardAlbumFunctions--------------------

function goToCardAlbum() {
    SceneManager.push(cardAlbum);
};

function cardAlbum() {
    this.load_plugin_parameters();
    this.load_variables();
    this.initialize.apply(this, arguments);
    this.createBackground();
    this.createWindowLayer();
    this.initialize_cardList_windows();
    this.initialize_cardDetails_windows();
};

cardAlbum.prototype = Object.create(Scene_Base.prototype);
cardAlbum.prototype.constructor = cardAlbum;

cardAlbum.prototype.createBackground = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = ImageManager.loadBattleback1('Testbg');
    this.addChild(this._backSprite);
};

cardAlbum.prototype.load_plugin_parameters = function() {
    this.card_list = JSON.parse(PluginManager.parameters('Test')['Card List']);
}; 

cardAlbum.prototype.load_variables = function() {
    this.cardId = 0
    this.old_id = 0
}

cardAlbum.prototype.initialize_cardList_windows = function() {
    this._cardListWindow = new Window_CardList(0, 0, 300, Graphics.height);
    for (var n = 0; n < this.card_list.length; n++){
        this._cardListWindow.setHandler(JSON.parse(this.card_list[n])['name'], this.testHandler.bind(this));
    } 
    this.addWindow(this._cardListWindow);
};

cardAlbum.prototype.testHandler = function() { 

}

cardAlbum.prototype.initialize_cardDetails_windows = function() {
    this._cardDetailsWindow = new Window_CardDetails(300, 0, Graphics.width - 300, Graphics.height);
    this.addWindow(this._cardDetailsWindow);
    if (!this.use_window)
        this._cardDetailsWindow.opacity = 255;
};

cardAlbum.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    this.cardId = this._cardListWindow.index();
    if (this.cardId != this.old_id) {
        this._cardDetailsWindow.refresh(this.cardId);
        this.old_id = this.cardId;
    }
    this.setExitKey()
}

cardAlbum.prototype.setExitKey = function() {
    if (Input.isTriggered('escape')){
        SceneManager.pop();
    }
}

function Window_CardList() {
    this.initialize.apply(this, arguments);
};

Window_CardList.prototype = Object.create(Window_Command.prototype);
Window_CardList.prototype.constructor = Window_CardList;

Window_CardList.prototype.initialize = function(x, y, width, height) {
    this.wh = height;
    this.ww = width;
    this.card_list = JSON.parse(PluginManager.parameters('Test')['Card List']);
    this.deck_list = []
    for (let i = 1; i <= this.card_list.length; i++){
        this.deck_list.push($gameSwitches.value(100 + i))
    }
    Window_Command.prototype.initialize.call(this, x, y, width, height);
};

Window_CardList.prototype.makeCommandList = function() {
    for (var n = 0; n < this.deck_list.length; n++) {
        if (this.deck_list[n] == true){
            this.addCommand(JSON.parse(this.card_list[n])['name'], JSON.parse(this.card_list[n])['name']);
        } else {
            this.addCommand("??????", "N/A", false);
        }
    }
};

Window_CardList.prototype.windowHeight = function() {
    return this.wh;
};
Window_CardList.prototype.windowWidth = function() {
    return this.ww;
};

function Window_CardDetails() {
    this.initialize.apply(this, arguments);
};

Window_CardDetails.prototype = Object.create(Window_Base.prototype);
Window_CardDetails.prototype.constructor = Window_CardDetails;

Window_CardDetails.prototype.initialize = function(x, y, width, height) {
    this.wh = height;
    this.ww = width;
    this.card_right = []
    this.card_wrong = []
    this.card_list = JSON.parse(PluginManager.parameters('Test')['Card List']);
    this.deck_list = []
    for (let i = 1; i <= this.card_list.length; i++){
        this.deck_list.push($gameSwitches.value(100 + i))
    }
    for (let i = 1; i <= this.card_list.length; i++){
        this.card_right.push($gameVariables.value(200 + i))
    }
    for (let i = 1; i <= this.card_list.length; i++){
        this.card_wrong.push($gameVariables.value(300 + i))
    }
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh(0)
};

Window_CardDetails.prototype.refresh = function (id){
    if (this.deck_list[id] == true){
        this.contents.clear();
        this._cardBitmap = new Sprite();
        this._cardBitmap.bitmap = ImageManager.loadPicture(JSON.parse(this.card_list[id])['image'])
        this.addChild(this._cardBitmap);
        this._cardBitmap.x = 20;
        this._cardBitmap.y = 20;
        this.card_name = JSON.parse(this.card_list[id])['name'];
        this.card_attack = JSON.parse(this.card_list[id])['attack'];
        this.card_hp = JSON.parse(this.card_list[id])['hp'];
        this.card_movement = JSON.parse(this.card_list[id])['movement'];
        this.description1 = JSON.parse(this.card_list[id])['description1'];
        this.description2 = JSON.parse(this.card_list[id])['description2'];
        if (JSON.parse(this.card_list[id])['type'] == 'chara'){
            this.card_type = "Invocation"
        }
        if (JSON.parse(this.card_list[id])['type'] == 'action'){
            this.card_type = "Compétence"
        }
    
        this.drawText("Nom: " + this.card_name, 700, 0, this.width, 'left')
        this.drawText("Type: " + this.card_type, 700, 40, this.width, 'left')
        this.drawText("Attaque: " + this.card_attack, 700, 80, this.width, 'left')
        this.drawText("Pv: " + this.card_hp, 700, 120, this.width, 'left')
        this.drawText("Pm: " + this.card_movement, 700, 160, this.width, 'left')
    
        this.drawText("N. Significations Trouvées: " + this.card_right[id], 700, 200, this.width, 'left')
        this.drawText("N. Significations pas trouvées: " + this.card_wrong[id], 700, 240, this.width, 'left')
        this.drawText("Description", 700, 320, this.width, 'left')
        this.drawText(this.description1, 700, 360, this.width, 'left')
        this.drawText(this.description2, 700, 400, this.width, 'left')
    } else {
        this.contents.clear();
        this.removeChild(this._cardBitmap)
        this.drawText("Nom: ?????", 700, 0, this.width, 'left')
        this.drawText("Type: ?????", 700, 40, this.width, 'left')
        this.drawText("Attaque: ??", 700, 80, this.width, 'left')
        this.drawText("Pv: ??", 700, 120, this.width, 'left')
        this.drawText("Pm: ??", 700, 160, this.width, 'left')
    
        this.drawText("N. Significations Trouvées: ??", 700, 200, this.width, 'left')
        this.drawText("N. Significations pas trouvées: ??", 700, 240, this.width, 'left')
        this.drawText("Description", 700, 320, this.width, 'left')
        this.drawText("???????????", 700, 360, this.width, 'left')
        this.drawText("???????????", 700, 400, this.width, 'left')
    }
}

//--------------------Test--------------------

function goToTestRoom(board_i, enemy_i) {
    this.board_i = board_i
    this.enemy_i = enemy_i
    SceneManager.push(testRoom);
};

function testRoom() {
    this.initialize.apply(this, arguments);
    this.load_plugin_parameters();
    this.load_variables(board_i, enemy_i);
    this.create_background(enemy_i);
    this.refresh_dongboard_coordinates();
    this.refresh_dongboard_status();
    this.refresh_dongboard_content();
    this.create_dongboard();
    this.update_hand_coordinates();
    this.initialize_vocabulary();
    this.load_card_parameters();
    this.get_probability();
    this.create_hand_content();
    this.create_card_hands();
    this.createWindowLayer();
    this.load_player_parameters();
    this.load_enemy_parameters();
    this.create_stat_windows();
    this.create_details_window();
    this.create_buttons();
    this.load_invisible();
};

testRoom.prototype = Object.create(Scene_Base.prototype);
testRoom.prototype.constructor = testRoom;

testRoom.prototype.load_plugin_parameters = function() {
    this.card_list = JSON.parse(PluginManager.parameters('Test')['Card List']);
}; 

testRoom.prototype.load_variables = function(bId, eId) {
    this.is_card_picked = false;
    this.enemyDead = false;
    this.sorted_card = 0
    this.index = 0;
    this.phase = 0;
    this.page = 1;
    this.card_identifier = 0;
    this.creation_index = 0
    this.escape = 0;
    this.actionDeck = [];
    this.charaDeck = [];
    this.actionLevels = [];
    this.charaLevels = [];
    this.selected_list = [];
    this.saved_selection = [];
    this.x_selection = 0;
    this.y_selection = 0;
    this.board_id = bId
    this.enemy_id = eId
    if (this.board_id == 0){
        this.inactive = [[], [], [], []];
        this.cursor = [[], [], [], []];
        this.square = [[], [], [], []];
    }
    if (this.board_id == 1){
        this.inactive = [[], [], [], [], [], []];
        this.cursor = [[], [], [], [], [], []];
        this.square = [[], [], [], [], [], []];
    }
    this.set_delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
}; 

testRoom.prototype.load_card_parameters = function() {
    this.card_levels = []
    this.card_right = []
    this.card_wrong = []
    this.deck_list = []
    this.card_types = []
    this.card_names = []
    for (let i = 1; i <= this.card_list.length; i++){
        this.card_levels.push($gameVariables.value(100 + i))
    }
    for (let i = 1; i <= this.card_list.length; i++){
        this.card_right.push($gameVariables.value(200 + i))
    }
    for (let i = 1; i <= this.card_list.length; i++){
        this.card_wrong.push($gameVariables.value(300 + i))
    }
    for (let i = 1; i <= this.card_list.length; i++){
        this.deck_list.push($gameSwitches.value(100 + i))
    }
    for (let i = 0; i < this.card_list.length; i++){
        this.card_types.push(JSON.parse(this.card_list[i])['type'])
    }
    for (let i = 0; i < this.card_list.length; i++){
        this.card_names.push(JSON.parse(this.card_list[i])['name'])
    }
}

testRoom.prototype.create_background = function(id) {
    if (id == 0){
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadBattleback1('Testbg2');
        this.addChild(this._backSprite);
    }
    if (id == 1){
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadBattleback1('zone1');
        this.addChild(this._backSprite);
    }
    if (id == 2){
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadBattleback1('zone2');
        this.addChild(this._backSprite);
    }
    if (id == 3){
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadBattleback1('zone3');
        this.addChild(this._backSprite);
    }
    if (id == 4){
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadBattleback1('zone4');
        this.addChild(this._backSprite);
    }
    if (id == 5){
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadBattleback1('zone5');
        this.addChild(this._backSprite);
    }
    if (id == 'tutoriel'){
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadBattleback1('tuto');
        this.addChild(this._backSprite);
    }
    if (id == 'poisson'){
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadBattleback1('zone1');
        this.addChild(this._backSprite);
    }
};

testRoom.prototype.refresh_dongboard_coordinates = function() {
    if (this.board_id == 0){
        this.dongBoard = [
            [0, 0, 0, 0], //row 0
            [0, 0, 0, 0], //row 1
            [0, 0, 0, 0], //row 2
            [0, 0, 0, 0]  //row 3
        ]
    }
    if (this.board_id == 1){
        this.dongBoard = [
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0]  
        ]
    }
};

testRoom.prototype.refresh_dongboard_status = function() {
    if (this.board_id == 0){
        this.boardStatus = [
            [0, 0, 0, 0], //row 0
            [0, 0, 0, 0], //row 1
            [0, 0, 0, 0], //row 2
            [0, 0, 0, 0]  //row 3
        ]
    }
    if (this.board_id == 1){
        this.boardStatus = [
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0]  
        ]
    }
};

testRoom.prototype.refresh_dongboard_content = function() {
    if (this.board_id == 0){
        this.boardContent = [
            [0, 0, 0, 0], //row 0
            [0, 0, 0, 0], //row 1
            [0, 0, 0, 0], //row 2
            [0, 0, 0, 0]  //row 3
        ]
    }
    if (this.board_id == 1){
        this.boardContent = [
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0]  
        ]
    }
};

testRoom.prototype.update_hand_coordinates = function() {
    this.hand = [[0, 0, 0, 0, 0, 0]]
}

testRoom.prototype.create_hand_content = function() {
    this.handContent = [[0, 0, 0], [0, 0, 0]]
}

testRoom.prototype.create_dongboard = function() {
    this._dongBoard = new Sprite();
    this._dongBoard.bitmap = ImageManager.loadPicture('dongboard');
    this.addChild(this._dongBoard);
    if (this.board_id == 0){
        x = 723
        y = 302
        for (r = 0; r < this.dongBoard.length ; r++){
            for (c = 0; c < this.dongBoard[r].length ; c++){
                this.square[r][c] = new Sprite();
                this.square[r][c].bitmap = ImageManager.loadPicture("pointer_black")
                this.addChild(this.square[r][c]);
                this.square[r][c].x = x;
                this.square[r][c].y = y;
                this.square[r][c].scale.x = 0.53;
                this.square[r][c].scale.y = 0.535;
                this.square[r][c].opacity = 200;
                x = x + 119.5
            }
            x = 723
            y = y + 120
        }
    }
    if (this.board_id == 1){
        x = 724
        y = 303
        for (r = 0; r < this.dongBoard.length ; r++){
            for (c = 0; c < this.dongBoard[r].length ; c++){
                this.square[r][c] = new Sprite();
                this.square[r][c].bitmap = ImageManager.loadPicture("pointer_black")
                this.addChild(this.square[r][c]);
                this.square[r][c].x = x;
                this.square[r][c].y = y;
                this.square[r][c].scale.x = 0.345;
                this.square[r][c].scale.y = 0.342;
                this.square[r][c].opacity = 200;
                x = x + 99
            }
            x = 724
            y = y + 80.2
        }
    }
};

testRoom.prototype.get_probability = function() {
    this.probabilitized = new Probability({
        p: '35%',
        f: function (deck, levels) {
            return this.level0(deck, levels)
        }
    }, {
        p: '26%',
        f: function (deck, levels) {
            return this.level1(deck, levels)
        }
    }, {
        p: '16%',
        f: function (deck, levels) {
            return this.level2(deck, levels)
        }
    }, {
        p: '12%',
        f: function (deck, levels) {
            return this.level3(deck, levels)
        }
    }, {
        p: '6%',
        f: function (deck, levels) {
            return this.level4(deck, levels)
        }
    }, {
        p: '3%',
        f: function (deck, levels) {
            return this.level5(deck, levels)
        }
    }, {
        p: '1%',
        f: function (deck, levels) {
            return this.level6(deck, levels)
        }
    }, {
        p: '0.60%',
        f: function (deck, levels) {
            return this.level7(deck, levels)
        }
    }, {
        p: '0.25%',
        f: function (deck, levels) {
            return this.level8(deck, levels)
        }
    }, {
        p: '0.10%',
        f: function (deck, levels) {
            return this.level9(deck, levels)
        }
    }, {
        p: '0.05%',
        f: function (deck, levels) {
            return this.level10(deck, levels)
        }
    });
};

testRoom.prototype.level0 = function(deck, levels) {
    console.log("a")
    console.log("level0")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        console.log(levels[n])
        if (levels[n] <= 10){
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length); 
        this.creation_index = i
        this.sorted_card = arr[i]
    } else {
        this.probabilitized(deck, levels)
    }
}

testRoom.prototype.level1 = function(deck, levels) {
        console.log("level1")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] <= 20 && levels[n] > 10){
            console.log("push1")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length); 
        this.creation_index = i
        this.sorted_card = arr[i]
    } else {
        this.level0(deck, levels)
    }
}

testRoom.prototype.level2 = function(deck, levels) {
    console.log("level2")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] <= 30 && levels[n] > 20){
            console.log("push2")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length);
        this.creation_index = i 
        this.sorted_card = arr[i]
    } else {
        this.level1(deck, levels)
    }
}

testRoom.prototype.level3 = function(deck, levels) {
    console.log("level3")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] <= 40 && levels[n] > 30){
            console.log("push3")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length); 
        this.creation_index = i
        this.sorted_card = arr[i]
    } else {
        this.level2(deck, levels)
    }
}

testRoom.prototype.level4 = function(deck, levels) {
    console.log("level4")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] <= 50 && levels[n] > 40){
            console.log("push4")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length);
        this.creation_index = i 
        this.sorted_card = arr[i]
    } else {
        this.level3(deck, levels)
    }
}

testRoom.prototype.level5 = function(deck, levels) {
    console.log("level5")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] <= 60 && levels[n] > 50){
            console.log("push5")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length); 
        this.creation_index = i
        this.sorted_card = arr[i]
    } else {
        this.level4(deck, levels)
    }
}

testRoom.prototype.level6 = function(deck, levels) {
    console.log("level6")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] <= 70 && levels[n] > 60){
            console.log("push6")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length); 
        this.creation_index = i
        this.sorted_card = arr[i]
    } else {
        this.level5(deck, levels)
    }
}

testRoom.prototype.level7 = function(deck, levels) {
    console.log("level7")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] <= 90 && levels[n] > 70){
            console.log("push7")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length); 
        this.creation_index = i
        this.sorted_card = arr[i]
    } else {
        this.level6(deck, levels)
    }
}

testRoom.prototype.level8 = function(deck, levels) {
    console.log("level8")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] <= 95 && levels[n] > 90){
            console.log("push8")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length);
        this.creation_index = i 
        this.sorted_card = arr[i]
    } else {
        this.level7(deck, levels)
    }
}

testRoom.prototype.level9 = function(deck, levels) {
    console.log("level9")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] <= 99 && levels[n] > 95){
            console.log("push9")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length); 
        this.creation_index = i
        this.sorted_card = arr[i]
    } else {
        this.level8(deck, levels)
    }
}

testRoom.prototype.level10 = function(deck, levels) {
    console.log("level10")
    let arr = []
    for (let n = 0; n < deck.length; n++){
        if (levels[n] == 100){
            console.log("push10")
            arr.push(deck[n])
        }
    }
    if (arr != false){
        let i = Math.floor(Math.random() * arr.length); 
        this.creation_index = i
        this.sorted_card = arr[i]
    } else {
        this.level9(deck, levels)
    }
}

testRoom.prototype.initialize_vocabulary = function() {
    this.vocabulary = []
    for(let i = 0; i < this.card_list.length; i++){
        if (JSON.parse(this.card_list[i])['name'] != 'empty'){
            this.vocabulary.push(JSON.parse(this.card_list[i])['name'])
        }
    }
}

testRoom.prototype.create_buttons = function () {
    this._endTurnBtn = new Sprite();
    this._endTurnBtn.bitmap = ImageManager.loadPicture('end-turn-btn');
    this.addChild(this._endTurnBtn);
    this._endTurnBtn.scale.x = 0.5;
    this._endTurnBtn.scale.y = 0.5;
    this._endTurnBtn.x = 1350;
    this._endTurnBtn.y = 950;
    this._helpBtn = new Sprite();
    this._helpBtn.bitmap = ImageManager.loadPicture('help');
    this.addChild(this._helpBtn);
    this._helpBtn.scale.x = 0.5;
    this._helpBtn.scale.y = 0.5;
    this._helpBtn.x = 350;
    this._helpBtn.y = 950;
}

testRoom.prototype.load_invisible = function() {
    this._playerPointer = new Sprite_Base();
    this._playerPointer.bitmap = ImageManager.loadPicture('red_point');
    this.addChild(this._playerPointer);
    this._playerPointer.anchor.x = 0.5;
    this._playerPointer.anchor.y = 0.9; 
    this._playerPointer.opacity = 0;
    this._playerPointer.x = Graphics.width / 2;
    this._playerPointer.y = 1040; 
}

testRoom.prototype.active_end_turn_btn = function () {
    this.removeChild(this._endTurnBtn);
    this._endTurnBtnActive = new Sprite();
    this._endTurnBtnActive.bitmap = ImageManager.loadPicture('end-turn-btn-active');
    this.addChild(this._endTurnBtnActive);
    this._endTurnBtnActive.scale.x = 0.5;
    this._endTurnBtnActive.scale.y = 0.5;
    this._endTurnBtnActive.x = 1350;
    this._endTurnBtnActive.y = 950;
}

testRoom.prototype.active_help_btn = function () {
    this.removeChild(this._helpBtn);
    this._helpBtnActive = new Sprite();
    this._helpBtnActive.bitmap = ImageManager.loadPicture('help-active');
    this.addChild(this._helpBtnActive);
    this._helpBtnActive.scale.x = 0.5;
    this._helpBtnActive.scale.y = 0.5;
    this._helpBtnActive.x = 350;
    this._helpBtnActive.y = 950;
}

testRoom.prototype.create_card_hands = function() {
    for(let i = 0; i < this.deck_list.length; i++){
        if(this.deck_list[i] == true){
            if(JSON.parse(this.card_list[i])['type'] == 'action'){
                this.actionDeck.push(this.card_list[i])
                this.actionLevels.push(this.card_levels[i])
            }
            if(JSON.parse(this.card_list[i])['type'] == 'chara'){
                this.charaDeck.push(this.card_list[i])
                this.charaLevels.push(this.card_levels[i])
            }
        }
    }
    let x = 0
    x = 617.5
    for(let n = 0; n < 3; n++){
        if (this.handContent[0][n] == 0){
            this.probabilitized(this.actionDeck, this.actionLevels)
            console.warn("ACTION")
            console.log(this.sorted_card)
            console.log(this.actionDeck.indexOf(this.sorted_card))
            this.generate_player_card(this.handContent[0], n, this.actionDeck.indexOf(this.sorted_card), x, this.actionDeck)
        } else {
            this.generate_player_card(this.handContent[0], n, this.handContent[0][n].id, x, this.actionDeck)
        }
        if (this.handContent[1][n] == 0){
            this.probabilitized(this.charaDeck, this.charaLevels)
            console.warn("CHARA")
            console.log(this.sorted_card)
            console.log(this.charaDeck.indexOf(this.sorted_card))
            this.generate_player_card(this.handContent[1], n, this.charaDeck.indexOf(this.sorted_card), x + 400, this.charaDeck)
        } else {
            this.generate_player_card(this.handContent[1], n, this.handContent[1][n].id, x + 400, this.charaDeck)
        }
        x = x + 100
    }
    this.fullHand = [].concat(...this.handContent)
};

testRoom.prototype.generate_player_card = function (card_pointer, index, id, x, deck) {
    card_pointer[index] = new Dongba_Card();
    card_pointer[index].bitmap = ImageManager.loadPicture(JSON.parse(deck[id])['image'])
    this.addChild(card_pointer[index]);
    card_pointer[index].scale.x = 0.13;
    card_pointer[index].scale.y = 0.13;
    card_pointer[index].x = x;
    card_pointer[index].y = Graphics.height - 150;
    card_pointer[index].opacity = 120;
    card_pointer[index].type = JSON.parse(deck[id])['type'];
    card_pointer[index].name = JSON.parse(deck[id])['name'];
    card_pointer[index].movement = parseInt(JSON.parse(deck[id])['movement']);
    card_pointer[index].attack = parseInt(JSON.parse(deck[id])['attack']);
    card_pointer[index].defense = 0;
    card_pointer[index].maxhp = parseInt(JSON.parse(deck[id])['hp']);
    card_pointer[index].hp = parseInt(JSON.parse(deck[id])['hp']);
    card_pointer[index].ap = parseInt(JSON.parse(deck[id])['ap cost']);
    card_pointer[index].id = this.card_names.indexOf(card_pointer[index].name)
    card_pointer[index].isSummoned = true;
    card_pointer[index].isPlayer = true;
    //effects parameter
    card_pointer[index].buff = [];
    card_pointer[index].invincible = [false, 0];
    card_pointer[index].dodge = [0];
    card_pointer[index].blindness = 0;
    card_pointer[index].regen = [0, 0];
    card_pointer[index].poison = [0, 0];
    card_pointer[index].sleep = [false, 0];
    card_pointer[index].scare = [false, 0];
    card_pointer[index].damage = [0, 0];
    card_pointer[index].goitre = [false, 0];

};

testRoom.prototype.generate_enemy_card = function (id, deck, x, y) {
    this.enemyCard = new Dongba_Card();
    this.enemyCard.bitmap = ImageManager.loadPicture(JSON.parse(deck[id])['image'])
    this.addChild(this.enemyCard);
    if (this.board_id == 0){
        this.enemyCard.scale.x = -0.11;
        this.enemyCard.scale.y = -0.11;
        this.enemyCard.anchor.x = 0.5;
        this.enemyCard.anchor.y = -3.9;
    }
    if (this.board_id == 1){
        this.enemyCard.scale.x = -0.07;
        this.enemyCard.scale.y = -0.07;
        this.enemyCard.anchor.x = 0.5;
        this.enemyCard.anchor.y = -6.8;
    }
    this.enemyCard.id = id;
    this.enemyCard.x = x;
    this.enemyCard.y = y;
    this.enemyCard.type = JSON.parse(deck[id])['type'];
    this.enemyCard.name = JSON.parse(deck[id])['name'];
    this.enemyCard.movement = parseInt(JSON.parse(deck[id])['movement']);
    this.enemyCard.attack = parseInt(JSON.parse(deck[id])['attack']);
    this.enemyCard.defense = 0;
    this.enemyCard.maxhp = parseInt(JSON.parse(deck[id])['hp']);
    this.enemyCard.hp = parseInt(JSON.parse(deck[id])['hp']);
    this.enemyCard.ap = parseInt(JSON.parse(deck[id])['ap cost']);
    this.enemyCard.effect = parseInt(JSON.parse(deck[id])['effect']);
    this.enemyCard.isSummoned = true;
    this.enemyCard.isPlayer = false;
    //effects parameter
    this.enemyCard.buff = [];
    this.enemyCard.invincible = [false, 0];
    this.enemyCard.blindness = 0;
    this.enemyCard.regen = [0, 0];
    this.enemyCard.poison = [0, 0];
    this.enemyCard.sleep = [false, 0];
    this.enemyCard.scare = [false, 0];
    this.enemyCard.damage = [0, 0];
    this.enemyCard.goitre = [false, 0];
};

testRoom.prototype.testCard = function(){
    this._testCard = new Dongba_Card();
}

testRoom.prototype.generate_enemy = function (enemy_pointer, index) {
    enemy_pointer[index] = new Enemy_Test();
    enemy_pointer[index].bitmap = ImageManager.loadPicture('enemy-placeholder')
    enemy_pointer[index].x = 0
    enemy_pointer[index].y = 0
    enemy_pointer[index].hp = 3
}

testRoom.prototype.update = function () {
    Scene_Base.prototype.update.call(this);
    this.test_frame_count++;
    this.setInputKeys();
    switch (this.phase) {
        //eventually dialogues and tutorial
        case 0: 
            AudioManager.playBgm({name: "03_Endless_Battle", pan: 0, pitch: 100, volume: 100 });
            this.phase = 1
        break;
        //select card in your hands
        case 1:
            this.selection_length_x = this.fullHand.length - 1
            this.get_selection();
            break;
        //show word-guess game
        case 2:

        break;   
        //enable grid cursor  
        case 3:
            this.selection_length_x = this.dongBoard[0].length - 1
            this.selection_length_y = this.dongBoard.length - 1
            this.get_selection();
        break; 
        //end of turn
        case 4:

        break;  
        case 6:
            this.enemy_turn()
        break;   
        case 7:

        break
        case 98:
            this.phase = 105;
        break; 
        case 99:
            this.phase = 101;
        break;  
        case 100:
            this.selection_length_x = this.dongBoard[0].length - 1
            this.selection_length_y = this.dongBoard.length - 1
            this.get_selection();
        break;
        case 101:

        break;      
        case 102:
            this.selection_length_x = this.dongBoard[0].length - 1
            this.selection_length_y = this.dongBoard.length - 1
            this.get_selection();
        break;   
        case 103:
            this.selection_length_x = this.dongBoard[0].length - 1
            this.selection_length_y = this.dongBoard.length - 1
            this.get_selection();
        break;    
        case 104:
            this.selection_length_x = this.dongBoard[0].length - 1
            this.selection_length_y = this.dongBoard.length - 1
            this.get_selection();
        break;  
        case 105:

        break;  
    }
    if(this.enemyHp <= 0){

    }
    if(this.playerHp <= 0){
        console.log("You lost")
    }
}

testRoom.prototype.end_battle = function (win_condition) {
    if (win_condition == true) {
        for (let i = 0; i < this.card_list.length; i++){
            $gameVariables.setValue(101 + i, this.card_levels[i])
        }
        for (let i = 0; i < this.card_list.length; i++){
            $gameVariables.setValue(201 + i, this.card_right[i])
        }
        for (let i = 0; i < this.card_list.length; i++){
            $gameVariables.setValue(301 + i, this.card_wrong[i])
        }
        $gameSwitches.setValue(100 + this.enemySpriteId + 1, true)
        $gameSwitches.setValue(100, true)
        SceneManager.pop();
    } else {
        SceneManager.pop();
    }
}

testRoom.prototype.setInputKeys = function () {
    if (Input.isRepeated('left')){
        if (this.phase == 1){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.x_selection--;
            if (this.x_selection < 0){
                this.x_selection = 0;
                this.fullHand[this.x_selection].opacity = 120;
                this.active_help_btn();
                this.phase = 98;
            }
            this._detailsWindow.removeChildren()
            this._detailsWindow.refresh(this.fullHand[this.x_selection]);
        }
        if (this.phase == 2){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
        }
        if (this.phase == 3){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.x_selection--;
            if (this.x_selection < 0){
                this.x_selection = this.selection_length_x;
            }
        }
        if (this.phase == 100){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.x_selection--;
            if (this.x_selection < 0){
                this.x_selection = this.selection_length_x;
            }
            if (this.boardStatus[this.y_selection][this.x_selection] != 'occupied'){
                this._detailsWindow.removeChildren()
                if (this._hpWindow != undefined){
                    this._hpWindow.close()
                }
            }
            if (this.boardStatus[this.y_selection][this.x_selection] == 'occupied'){
                if (this._hpWindow != undefined){
                    this._hpWindow.close()
                }
                this._detailsWindow.removeChildren()
                this._detailsWindow.refresh(this.boardContent[this.y_selection][this.x_selection]);
                this.create_card_param_window();
            }
        }
        if (this.phase == 101){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.removeChild(this._endTurnBtn);
            this.create_buttons()
            this.x_selection = this.selection_length_x
            this._detailsWindow.removeChildren()
            this._detailsWindow.refresh(this.fullHand[this.x_selection]);
            this.phase = 1;
        }
    }
    if (Input.isRepeated('right')){
        if (this.phase == 1){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.x_selection++;
            if (this.x_selection > this.selection_length_x){
                this.x_selection = this.selection_length_x
                this.fullHand[this.x_selection].opacity = 120
                this.active_end_turn_btn();
                this.phase = 99;
            }
            this._detailsWindow.removeChildren()
            this._detailsWindow.refresh(this.fullHand[this.x_selection]);
        }
        if (this.phase == 2){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
        }
        if (this.phase == 3){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.x_selection++;
            if (this.x_selection > this.selection_length_x){
                this.x_selection = 0;
            }
        }
        if (this.phase == 100){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.x_selection++;
            if (this.x_selection > this.selection_length_x){
                this.x_selection = 0;
            }
            if (this.boardStatus[this.y_selection][this.x_selection] != 'occupied'){
                this._detailsWindow.removeChildren()
                if (this._hpWindow != undefined){
                    this._hpWindow.close()
                }
            }
            if (this.boardStatus[this.y_selection][this.x_selection] == 'occupied'){
                if (this._hpWindow != undefined){
                    this._hpWindow.close()
                }
                this._detailsWindow.removeChildren()
                this._detailsWindow.refresh(this.boardContent[this.y_selection][this.x_selection]);
                this.create_card_param_window();
            }
        }
        if (this.phase == 105){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.removeChild(this._helpBtn);
            this.create_buttons()
            this.x_selection = 0
            this._detailsWindow.removeChildren()
            this._detailsWindow.refresh(this.fullHand[this.x_selection]);
            this.phase = 1;
        }
    }
    if (Input.isRepeated('up')){
        if (this.phase == 1){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.y_selection = this.dongBoard.length;
            this.x_selection = 0;
            this._detailsWindow.removeChildren()
            this.phase = 100;
            this.activate_dongboard();
        };
        if (this.phase == 3 || this.phase == 100){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.y_selection--;
            if (this.y_selection < 0){
                this.y_selection = this.selection_length_y;
            };
        };
        if (this.phase == 100){
            if (this.boardStatus[this.y_selection][this.x_selection] != 'occupied'){
                this._detailsWindow.removeChildren()
                if (this._hpWindow != undefined){
                    this._hpWindow.close()
                }
            }
            if (this.boardStatus[this.y_selection][this.x_selection] == 'occupied'){
                if (this._hpWindow != undefined){
                    this._hpWindow.close()
                }
                this._detailsWindow.removeChildren()
                this._detailsWindow.refresh(this.boardContent[this.y_selection][this.x_selection]);
                this.create_card_param_window();
            }
        }
    };
    if (Input.isRepeated('down')){
        if (this.phase == 100){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.y_selection++;
            if (this.y_selection > this.selection_length_y){
                this.y_selection = 0;
                this.x_selection = 0;
                this._detailsWindow.refresh(this.fullHand[this.x_selection]);
                if (this._hpWindow != undefined){
                    this._hpWindow.close()
                }
                this.refresh_dongboard()
                this._detailsWindow.removeChildren()
                this._detailsWindow.refresh(this.fullHand[this.x_selection]);
                this.phase = 1;
            }
        }
        if (this.phase == 3){
            AudioManager.playSe({ name: 'Cursor1', pan: 0, pitch: 100, volume: 100 });
            this.y_selection++;
            if (this.y_selection > this.selection_length_y){
                this.y_selection = 0;
            }
        }
        if (this.phase == 100){
            if (this.boardStatus[this.y_selection][this.x_selection] != 'occupied'){
                this._detailsWindow.removeChildren()
                if (this._hpWindow != undefined){
                    this._hpWindow.close()
                }
            }
            if (this.boardStatus[this.y_selection][this.x_selection] == 'occupied'){
                this._detailsWindow.removeChildren()
                this._detailsWindow.refresh(this.boardContent[this.y_selection][this.x_selection]);
                if (this._hpWindow != undefined){
                    this._hpWindow.close()
                }
                this.create_card_param_window();
            }
        }
    }
    if (Input.isTriggered('ok')){
        if (this.phase == 1) {
            this.selected_card = this.fullHand[this.x_selection];
            if(this.selected_card.ap > this.playerPa){
                AudioManager.playSe({ name: 'Buzzer1', pan: 0, pitch: 100, volume: 100 });  
            } else {
                AudioManager.playSe({ name: 'Decision2', pan: 0, pitch: 100, volume: 100 });
                this.selected_card_index = this.fullHand.indexOf(this.selected_card)
                this.phase++;
                this.y_selection = this.dongBoard.length - 1;
                this.x_selection = 0;
                this.generate_quiz();
            }
        }
        if (this.phase == 100) {
            if (this.boardStatus[this.y_selection][this.x_selection] == 'active'){
                console.log("no card here")
            }
            if (this.boardStatus[this.y_selection][this.x_selection] == 'occupied'){
                console.log("here is a card")
            }
        }

        if (this.phase == 3) {
            if (this.boardStatus[this.y_selection][this.x_selection] == 'inactive' || this.boardStatus[this.y_selection][this.x_selection] == 'occupied'){
                AudioManager.playSe({ name: 'Buzzer2', pan: 0, pitch: 200, volume: 100 });
            } else {
                if (this.selected_card.type == 'chara'){
                    AudioManager.playSe({ name: 'Decision1', pan: 0, pitch: 100, volume: 100 });
                    this.fullHand.splice(this.selected_card_index, 1)
                    if (this.board_id == 0){
                        this.selected_card.x = this.cursor[this.y_selection][this.x_selection].x + 58;
                        this.selected_card.y = this.cursor[this.y_selection][this.x_selection].y + 511;
                        this.selected_card.scale.x = 0.11;
                        this.selected_card.scale.y = 0.11;
                        this.selected_card.anchor.x = 0.5;
                        this.selected_card.anchor.y = 4.7;
                    }
                    if (this.board_id == 1){
                        this.selected_card.x = this.cursor[this.y_selection][this.x_selection].x + 37;
                        this.selected_card.y = this.cursor[this.y_selection][this.x_selection].y + 496;
                        this.selected_card.scale.x = 0.07;
                        this.selected_card.scale.y = 0.07;
                        this.selected_card.anchor.x = 0.5;
                        this.selected_card.anchor.y = 7.2;
                    }
                    this.boardContent[this.y_selection][this.x_selection] = this.selected_card;
                    this.boardStatus[this.y_selection][this.x_selection] = 'occupied';
                    this.selected_card.x_position = this.x_selection;
                    this.selected_card.y_position = this.y_selection;
                    if (this.selected_card.id + 1 == 52){
                        this.selected_card.attack--
                        this.set_action_card_effect(this.selected_card.id + 1)
                    }
                    if (this.selected_card.id + 1 == 53){
                        this.selected_card.hp -= 2
                        this.set_action_card_effect(this.selected_card.id + 1)
                    }
                    if (this.selected_card.id + 1 == 54){
                        this.set_action_card_effect(this.selected_card.id + 1)
                        this.selected_card.defense = 0
                    }
                    if (this.selected_card.id + 1 == 55){
                        this.selected_card.regen = [2, 9999]
                    }
                    if (this.selected_card.id + 1 == 56){
                        this.set_action_card_effect(this.selected_card.id + 1)
                    }
                    if (this.selected_card.id + 1 == 67){
                        this.selected_card.dodge = 4
                    }
                    if (this.selected_card.id + 1 == 110){
                        this.set_action_card_effect(this.selected_card.id + 1)
                        this.selected_card.defense = 0
                    }
                    if (this.selected_card.id + 1 == 111){
                        this.selected_card.attack -= 3
                        this.set_action_card_effect(this.selected_card.id + 1)
                    }
                    if (this.selected_card.id + 1 == 112){
                        this.set_action_card_effect(this.selected_card.id + 1)
                    }
                    if (this.selected_card.id + 1 == 113){
                        this.selected_card.maxhp -= 3
                        this.set_action_card_effect(this.selected_card.id + 1)
                    }
                    if (this.selected_card.id + 1 == 115){
                        this.selected_card.dodge = 3
                    }
                    if (this.selected_card.id + 1 == 116){
                        this.selected_card.dodge = 3
                    }
                    if (this.selected_card.id + 1 == 117){
                        this.selected_card.dodge = 3
                    }
                } else if (this.selected_card.type == 'action'){
                    AudioManager.playSe({ name: 'Decision1', pan: 0, pitch: 100, volume: 100 });
                    this.fullHand.splice(this.selected_card_index, 1)
                    for (r = 0; r < this.dongBoard.length; r++){
                        for (c = 0; c < this.dongBoard[r].length; c++){
                            if (this.boardStatus[r][c] == 'active'){
                                this.boardStatus[r][c] = 'occupied'
                            }
                        }
                    }

                    this.removeChild(this.selected_card);
                    this.set_action_card_effect(this.selected_card.id + 1)
                }
                if (this.boardContent[this.y_selection][this.x_selection].hp <= 0){
                    this.removeChild(this.boardContent[this.y_selection][this.x_selection]);
                    this.boardContent[this.y_selection][this.x_selection] = 0;
                    this.boardStatus[this.y_selection][this.x_selection] = 'active';
                }
                this.refresh_dongboard();
                this.playerPa = this.playerPa - this.selected_card.ap
                this.card_right[this.selected_card.id]++
                this.card_levels[this.selected_card.id]++
                if (this.card_levels[this.selected_card.id] > 100){
                    this.card_levels[this.selected_card.id] = 100
                }
                this._playerWindow.refresh(this.playerMaxHp, this.playerHp, this.playerMaxPa, this.playerPa)
                this.x_selection = 0;
                this._detailsWindow.removeChildren()
                this._detailsWindow.refresh(this.fullHand[this.x_selection]);
                this.phase = 1;
            }
        }
        if (this.phase == 101) {
            AudioManager.playSe({ name: 'Cat', pan: 0, pitch: 100, volume: 100 });
            this.removeChild(this._endTurnBtn);
            this.create_buttons()
            this._detailsWindow.removeChildren()
            this.move_player_cards()
            this.phase = 4;
        }
        if (this.phase == 102) {
            if (this.boardStatus[this.y_selection][this.x_selection] == 'active'){
                AudioManager.playSe({ name: 'Buzzer2', pan: 0, pitch: 100, volume: 100 });
            }
            if (this.boardStatus[this.y_selection][this.x_selection] == 'occupied'){
                AudioManager.playSe({ name: 'Decision1', pan: 0, pitch: 100, volume: 100 });
                if (this.parameter == 'movement'){
                    this.boardContent[this.y_selection][this.x_selection].movement += this.value
                }
                if (this.parameter == 'attack'){
                    this.boardContent[this.y_selection][this.x_selection].attack += this.value
                }
                if (this.parameter == 'hp'){
                    this.boardContent[this.y_selection][this.x_selection].maxhp += this.value
                    this.boardContent[this.y_selection][this.x_selection].hp += this.value
                }
                if (this.parameter == 'precision'){
                    this.boardContent[this.y_selection][this.x_selection].blindness = this.value
                }
            }
            this.refresh_dongboard()
            this._detailsWindow.removeChildren()
            this._detailsWindow.refresh(this.fullHand[this.x_selection]);
            this.phase = 1
        }
        if (this.phase == 103) {
            if (this.boardStatus[this.y_selection][this.x_selection] == 'active'){
                AudioManager.playSe({ name: 'Buzzer2', pan: 0, pitch: 100, volume: 100 });
            }
            if (this.boardStatus[this.y_selection][this.x_selection] == 'occupied'){
                AudioManager.playSe({ name: 'Decision1', pan: 0, pitch: 100, volume: 100 });
                this.boardContent[this.y_selection][this.x_selection].hp -= this.value
            }
            this.refresh_dongboard()
            this._detailsWindow.removeChildren()
            this._detailsWindow.refresh(this.fullHand[this.x_selection]);
            this.phase = 1
        }
        if (this.phase == 104) {
            if (this.boardStatus[this.y_selection][this.x_selection] == 'active'){
                AudioManager.playSe({ name: 'Buzzer2', pan: 0, pitch: 100, volume: 100 });
            }
            if (this.boardStatus[this.y_selection][this.x_selection] == 'occupied'){
                AudioManager.playSe({ name: 'Decision1', pan: 0, pitch: 100, volume: 100 });
                this.boardContent[this.y_selection][this.x_selection].hp += this.value
                if (this.boardContent[this.y_selection][this.x_selection].hp > this.boardContent[this.y_selection][this.x_selection].maxhp) {
                    this.boardContent[this.y_selection][this.x_selection].hp = this.boardContent[this.y_selection][this.x_selection].maxhp
                }
            }
            this.refresh_dongboard()
            this._detailsWindow.removeChildren()
            this._detailsWindow.refresh(this.fullHand[this.x_selection]);
            this.phase = 1
        }
        if (this.phase == 105) {
            console.log("ok")
            console.log(this.page)
            if (this.page == 1){
                this._page1 = new Sprite();
                this._page1.bitmap = ImageManager.loadPicture('page1');
                this.addChild(this._page1);
                this._page1.x = Graphics.width / 2;
                this._page1.y = Graphics.height / 2;
                this._page1.anchor.x = 0.5
                this._page1.anchor.y = 0.5
                this.page++
            } else if(this.page == 2){
                this.removeChild(this._page1);
                this._page2 = new Sprite();
                this._page2.bitmap = ImageManager.loadPicture('page2');
                this.addChild(this._page2);
                this._page2.x = Graphics.width / 2;
                this._page2.y = Graphics.height / 2;
                this._page2.anchor.x = 0.5
                this._page2.anchor.y = 0.5
                this.page++
            } else if(this.page == 3){
                this.removeChild(this._page2);
                this._page3 = new Sprite();
                this._page3.bitmap = ImageManager.loadPicture('page3');
                this.addChild(this._page3);
                this._page3.x = Graphics.width / 2;
                this._page3.y = Graphics.height / 2;
                this._page3.anchor.x = 0.5
                this._page3.anchor.y = 0.5
                this.page++
            } else if(this.page == 4){
                this.removeChild(this._page3);
                this._page4 = new Sprite();
                this._page4.bitmap = ImageManager.loadPicture('page4');
                this.addChild(this._page4);
                this._page4.x = Graphics.width / 2;
                this._page4.y = Graphics.height / 2;
                this._page4.anchor.x = 0.5
                this._page4.anchor.y = 0.5
                this.page++
            } else if(this.page == 5){
                this.removeChild(this._page4);
                this._page5 = new Sprite();
                this._page5.bitmap = ImageManager.loadPicture('page5');
                this.addChild(this._page5);
                this._page5.x = Graphics.width / 2;
                this._page5.y = Graphics.height / 2;
                this._page5.anchor.x = 0.5
                this._page5.anchor.y = 0.5
                this.page++
            } else if(this.page == 6){
                this.removeChild(this._page5);
                this.page = 1
            }
        }
        if (this.phase == 106) {
            console.log("ok")

        }
        if (this.phase == 107) {
            this.removeChild(this._page2);
            this._page2 = new Sprite();
            this._page2.bitmap = ImageManager.loadPicture('page2');
            this.addChild(this._page1);
            this._page2.x = Graphics.width / 2;
            this._page2.y = Graphics.height / 2;
            this._page2.anchor.x = 0.5
            this._page2.anchor.y = 0.5
        }
    }
    if (Input.isTriggered('escape')){
        if (this.phase == 2) {
            AudioManager.playSe({ name: 'Cancel1', pan: 0, pitch: 100, volume: 100 });
            this._answerWindow.close();
            this.escape = 1
            this.phase--
        }
        if (this.phase == 3){
            AudioManager.playSe({ name: 'Cancel1', pan: 0, pitch: 100, volume: 100 });
            this.refresh_dongboard();
            this.x_selection = this.fullHand.indexOf(this.selected_card);
            this._detailsWindow.removeChildren()
            this._detailsWindow.refresh(this.fullHand[this.x_selection]);
            this.phase = 1;
        } else {
            console.log("phase: " + this.phase);
            console.log("dongBoard: ");
            console.log(this.dongBoard);
            console.log("boardStatus: ");
            console.log(this.boardStatus);
            console.log("boardContent: ");
            console.log(this.boardContent);
            console.log("selectedCard: ");
            console.log(this.selected_card);
            console.log("full hand")
            console.log(this.fullHand)
            console.log("selected")
            console.log(this.selected_card)
            console.log("card list")
            console.log(this.card_list)
            console.log("levels")
            console.log(this.card_levels)
            console.log("names")
            console.log(this.card_names)
            console.log("indeck")
            console.log(this.deck_list)
        }
    }
}

testRoom.prototype.put_card_on_board = function () {
    if (this.selected_card.type == "chara"){
        for (r = 0; r < this.dongBoard.length; r++){
            for (c = 0; c < this.dongBoard[r].length ; c++){
                if (r != this.dongBoard.length - 1){
                    this.boardStatus[r][c] = 'inactive'
                } else {
                    if (this.boardStatus[this.dongBoard.length - 1][c] != 'occupied'){
                        this.boardStatus[this.dongBoard.length - 1][c] = 'active'   
                    } 
                }
            } 
        }
    }

    if (this.selected_card.type == "action"){
        for (r = 0; r < this.dongBoard.length ; r++){
            for (c = 0; c < this.dongBoard[r].length ; c++){
                if (this.boardStatus[r][c] == 'occupied'){
                    this.boardStatus[r][c] = 'active'
                } else {
                    this.boardStatus[r][c] = 'inactive'
                }
            }
        }
    }
    this.x_selection = 0;
    this.get_dongboard_cursors();
}

testRoom.prototype.activate_dongboard = function () {
    for (let r = 0; r < this.dongBoard.length; r++){
        for (let c = 0; c < this.dongBoard[r].length; c++){
            if (this.boardStatus[r][c] != 'occupied'){
                this.boardStatus[r][c] = 'active';
            }
        }
    }
    this.get_dongboard_cursors()
}

testRoom.prototype.get_selection = function () {
    if (this.phase == 1){
        this.update_hand_coordinates();
        this.hand[this.x_selection] = 1;
        for (let i = 0; i < this.fullHand.length; i++){
            if (this.hand[i] == 1){
                this.fullHand[i].opacity = 255
            } else {
                this.fullHand[i].opacity = 120
            }
        }
    }  

    if (this.phase == 3 || this.phase == 100){
        this.refresh_dongboard_coordinates();
        this.dongBoard[this.y_selection][this.x_selection] = 1;
        for (r = 0; r < this.dongBoard.length ; r++){
            for (c = 0; c < this.dongBoard[r].length ; c++){
                if (this.dongBoard[r][c] == 1){
                    this.cursor[r][c].opacity = 255
                } else {
                    this.cursor[r][c].opacity = 0
                }
            }
        }
    }
}

testRoom.prototype.get_dongboard_cursors = function () {
    if (this.board_id == 0){
        x = 723
        y = 302
        for (r = 0; r < this.dongBoard.length ; r++){
            for (c = 0; c < this.dongBoard[r].length ; c++){
                if (this.boardStatus[r][c] == 'inactive'){
                    this.inactive[r][c] = new Sprite();
                    this.inactive[r][c].bitmap = ImageManager.loadPicture("pointer_inactive")
                    this.addChild(this.inactive[r][c]);
                    this.inactive[r][c].opacity = 200;
                    this.inactive[r][c].x = x;
                    this.inactive[r][c].y = y;
                    this.inactive[r][c].scale.x = 0.53;
                    this.inactive[r][c].scale.y = 0.535;
                    this.cursor[r][c] = new Sprite();
                    this.cursor[r][c].bitmap = ImageManager.loadPicture("pointer_red")
                    this.addChild(this.cursor[r][c]);
                    this.cursor[r][c].x = x;
                    this.cursor[r][c].y = y;
                    this.cursor[r][c].scale.x = 0.53;
                    this.cursor[r][c].scale.y = 0.535;
                }
                if (this.boardStatus[r][c] == 'active'){
                    this.cursor[r][c] = new Sprite();
                    this.cursor[r][c].bitmap = ImageManager.loadPicture("pointer_green")
                    this.addChild(this.cursor[r][c]);
                    this.cursor[r][c].x = x;
                    this.cursor[r][c].y = y;
                    this.cursor[r][c].scale.x = 0.53;
                    this.cursor[r][c].scale.y = 0.535;
                }
                if (this.boardStatus[r][c] == 'occupied' && this.phase != 100){
                    this.cursor[r][c] = new Sprite();
                    this.cursor[r][c].bitmap = ImageManager.loadPicture("pointer_red")
                    this.addChild(this.cursor[r][c]);
                    this.cursor[r][c].x = x;
                    this.cursor[r][c].y = y;
                    this.cursor[r][c].scale.x = 0.53;
                    this.cursor[r][c].scale.y = 0.535;
                }
                if (this.boardStatus[r][c] == 'occupied' && this.phase == 100){
                    this.cursor[r][c] = new Sprite();
                    this.cursor[r][c].bitmap = ImageManager.loadPicture("pointer_green")
                    this.addChild(this.cursor[r][c]);
                    this.cursor[r][c].x = x;
                    this.cursor[r][c].y = y;
                    this.cursor[r][c].scale.x = 0.53;
                    this.cursor[r][c].scale.y = 0.535;
                }
                x = x + 119.5
            }
            x = 723
            y = y + 120
        }
    }
    if (this.board_id == 1){
        x = 724
        y = 303
        for (r = 0; r < this.dongBoard.length ; r++){
            for (c = 0; c < this.dongBoard[r].length ; c++){
                if (this.boardStatus[r][c] == 'inactive'){
                    this.inactive[r][c] = new Sprite();
                    this.inactive[r][c].bitmap = ImageManager.loadPicture("pointer_inactive")
                    this.addChild(this.inactive[r][c]);
                    this.inactive[r][c].opacity = 200;
                    this.inactive[r][c].x = x;
                    this.inactive[r][c].y = y;
                    this.inactive[r][c].scale.x = 0.345;
                    this.inactive[r][c].scale.y = 0.342;
                    this.cursor[r][c] = new Sprite();
                    this.cursor[r][c].bitmap = ImageManager.loadPicture("pointer_red")
                    this.addChild(this.cursor[r][c]);
                    this.cursor[r][c].x = x;
                    this.cursor[r][c].y = y;
                    this.cursor[r][c].scale.x = 0.345;
                    this.cursor[r][c].scale.y = 0.342;
                }
                if (this.boardStatus[r][c] == 'active'){
                    this.cursor[r][c] = new Sprite();
                    this.cursor[r][c].bitmap = ImageManager.loadPicture("pointer_green")
                    this.addChild(this.cursor[r][c]);
                    this.cursor[r][c].x = x;
                    this.cursor[r][c].y = y;
                    this.cursor[r][c].scale.x = 0.345;
                    this.cursor[r][c].scale.y = 0.342;
                }
                if (this.boardStatus[r][c] == 'occupied' && this.phase != 100){
                    this.cursor[r][c] = new Sprite();
                    this.cursor[r][c].bitmap = ImageManager.loadPicture("pointer_red")
                    this.addChild(this.cursor[r][c]);
                    this.cursor[r][c].x = x;
                    this.cursor[r][c].y = y;
                    this.cursor[r][c].scale.x = 0.345;
                    this.cursor[r][c].scale.y = 0.342;
                }
                if (this.boardStatus[r][c] == 'occupied' && this.phase == 100){
                    this.cursor[r][c] = new Sprite();
                    this.cursor[r][c].bitmap = ImageManager.loadPicture("pointer_green")
                    this.addChild(this.cursor[r][c]);
                    this.cursor[r][c].x = x;
                    this.cursor[r][c].y = y;
                    this.cursor[r][c].scale.x = 0.345;
                    this.cursor[r][c].scale.y = 0.342;
                }
                x = x + 99
            }
            x = 724
            y = y + 80.2
        }
    }
}

testRoom.prototype.refresh_dongboard = function () {
    for (r = 0; r < this.dongBoard.length ; r++){
        for (c = 0; c < this.dongBoard[r].length ; c++){
            if (this.boardStatus[r][c] == 'inactive'){
                this.removeChild(this.inactive[r][c]);
                this.removeChild(this.cursor[r][c]);
                if (this.boardContent[r][c] != 0){
                    this.boardStatus[r][c] = 'occupied';
                } else{
                    this.boardStatus[r][c] = 0;
                }
            }
            if (this.boardStatus[r][c] == 'active'){
                this.removeChild(this.cursor[r][c]);
                this.boardStatus[r][c] = 0;
            }
            if (this.boardStatus[r][c] == 'occupied'){
                this.removeChild(this.cursor[r][c]);
            }
        }
    }
}

testRoom.prototype.generate_quiz = function () {
    if (this.selected_list.includes(this.selected_card) == false) {
        this.selected_list.push(this.selected_card);
        this.initialize_vocabulary();
        this.word_selection = []
        this.word_selection.push(this.selected_card.name)
        for (n = 0; n < 9; n++){
            this.generate_vocabulary()
        }
        for (let i = this.word_selection.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            this.temp = this.word_selection[i];
            this.word_selection[i] = this.word_selection[j];
            this.word_selection[j] = this.temp;
        }
        this.saved_selection.push(this.word_selection)

    } else {
        this.escape = 0
        this.word_selection = this.saved_selection[this.selected_list.indexOf(this.selected_card)];
    }

    this._answerWindow = new Window_Select_Answer(Graphics.boxWidth/2 - 750, 840, 1500, 75, this.word_selection);
    for (let i = 0; i < this.word_selection.length; i++){
        if (this.word_selection[i] == this.selected_card.name){
            this._answerWindow.setHandler(this.word_selection[i], this.rightChoice.bind(this));
        } else {
            this._answerWindow.setHandler(this.word_selection[i], this.wrongChoice.bind(this));
        }
    }
    this.addWindow(this._answerWindow);
    if (!this.use_window)
        this._answerWindow.opacity = 255; 
}

testRoom.prototype.generate_vocabulary = function () {
    let i = Math.floor(Math.random() * this.vocabulary.length);
    if (this.vocabulary[i] != this.selected_card.name){
        this.word_selection.push(this.vocabulary[i])
        this.vocabulary.splice(i, 1);
    } else {
        this.generate_vocabulary()
    }
}

testRoom.prototype.rightChoice = function () {
    if (this.selected_card.ap <= this.playerPa){
        AudioManager.playSe({ name: 'Decision1', pan: 0, pitch: 100, volume: 100 });
        if (this.selected_card.id + 1 == 22 || this.selected_card.id + 1 == 32 || this.selected_card.id + 1 == 35 || this.selected_card.id + 1 == 93 || this.selected_card.id + 1 == 94 || this.selected_card.id + 1 == 95 || this.selected_card.id + 1 == 96){
            this.fullHand.splice(this.selected_card_index, 1)
            this.set_action_card_effect(this.selected_card.id + 1)
            this.removeChild(this.selected_card);
            this._detailsWindow.removeChildren()
            this._detailsWindow.refresh(this.fullHand[this.x_selection]);
            this.phase = 1
            this.playerPa = this.playerPa - this.selected_card.ap
            this.card_right[this.selected_card.id]++
            this.card_levels[this.selected_card.id]++
            if (this.card_levels[this.selected_card.id] > 100){
                this.card_levels[this.selected_card.id] = 100
            }
            this._playerWindow.refresh(this.playerMaxHp, this.playerHp, this.playerMaxPa, this.playerPa)
            this.selected_list = [];
            this.saved_selection = [];
            this._answerWindow.close();
        } else {
            this.put_card_on_board();
            this.phase++
            this.selected_list = [];
            this.saved_selection = [];
            this._answerWindow.close();
        }
    } else {
        AudioManager.playSe({ name: 'Buzzer2', pan: 0, pitch: 100, volume: 100 });
        this._answerWindow.activate();
    }

}

testRoom.prototype.wrongChoice = function () {
    this.playerPa--
    this.card_wrong[this.selected_card.id]++
    this.card_levels[this.selected_card.id]--
    if (this.card_levels[this.selected_card.id] < 0){
        this.card_levels[this.selected_card.id] = 0
    }
    this._playerWindow.refresh(this.playerMaxHp, this.playerHp, this.playerMaxPa, this.playerPa)
    AudioManager.playSe({ name: 'Buzzer1', pan: 0, pitch: 100, volume: 100 });
    this._answerWindow.activate();
    if (this.playerPa < 0){
        this.playerPa = 0
        this._playerWindow.refresh(this.playerMaxHp, this.playerHp, this.playerMaxPa, this.playerPa)
    }
}

testRoom.prototype.create_stat_windows = function () {
    this._enemyWindow = new Window_Enemy(Graphics.width - 750, 100, 300, 70);
    this.addChild(this._enemyWindow);
    this._enemyWindow.refresh(this.enemyMaxHp, this.enemyHp);
    if (!this.use_window)
        this._enemyWindow.opacity = 255; 
    this._playerWindow = new Window_Player(Graphics.width - 650, Graphics.height - 375, 300, 110);
    this.addChild(this._playerWindow);
    this._playerWindow.refresh(this.playerMaxHp, this.playerHp, this.playerMaxPa, this.playerPa)
    if (!this.use_window)
        this._playerWindow.opacity = 255; 
}

testRoom.prototype.move_player_cards = async function () {
    for (r = 0; r < this.dongBoard.length; r++){
        for (c = 0; c < this.dongBoard[r].length; c++){
            let theCard = this.boardContent[r][c];
            if (theCard != 0){
                if (theCard.y_position != 0){
                    this.check_forward = this.boardContent[theCard.y_position - 1][theCard.x_position]
                }  
            }
            if (theCard != 0 && theCard.type == 'chara' && theCard.isPlayer == true && theCard.isSummoned == false && theCard.sleep[0] == false){
                let remaining_steps = theCard.movement
                let hasNotAttacked = true
                for (m = 1; m <= theCard.movement; m++){
                    if (this.boardContent[r - m] != undefined){
                        if (theCard.y_position != 0){
                            this.check_forward = this.boardContent[theCard.y_position - 1][theCard.x_position]
                        }
                        if(this.check_forward != 0 && theCard.y_position != 0 && this.check_forward.isPlayer == false && hasNotAttacked == true && theCard.scare[0] == false){
                            this.attack_enemy_card(theCard, this.check_forward)
                            hasNotAttacked = false
                            await this.set_delay(1000)
                        }
                        if (theCard.y_position != 0){
                            this.check_forward = this.boardContent[theCard.y_position - 1][theCard.x_position]
                        }
                        if (remaining_steps > 0 && this.check_forward == 0){
                            if (this.board_id == 0){
                                theCard.y = theCard.y - 120
                            }
                            if (this.board_id == 1){
                                theCard.y = theCard.y - 80.2
                            }
                            theCard.y_position--
                            remaining_steps--
                            this.boardContent[theCard.y_position][theCard.x_position] = theCard;
                            this.boardStatus[theCard.y_position][theCard.x_position] = 'occupied';
                            this.boardContent[theCard.y_position + 1][theCard.x_position] = 0
                            this.boardStatus[theCard.y_position + 1][theCard.x_position] = 0
                            await this.set_delay(500)
                        }

                    } 
                    if(theCard.y_position == 0 && theCard.scare[0] == false){
                        this.attack_enemy_boss(theCard)
                        await this.set_delay(500)
                        break;
                    }
                }
            } 
            if (theCard != 0) {
                theCard.isSummoned = false
            }
            if (this.enemyDead == true){
                break
            }
        }
         if (this.enemyDead == true){
            break
        }
    }
    await this.set_delay(1500)
    if (this.enemyDead == false){
        this.enemy_turn(4)
    }
}

testRoom.prototype.move_enemy_cards = async function () {
    for (r = this.dongBoard.length - 1; r >= 0; r--){
        for (c = this.dongBoard[r].length - 1; c >= 0; c--){
            let theCard = this.boardContent[r][c];     
            if (theCard != 0){
                if (theCard.y_position != this.dongBoard.length - 1){
                    this.check_forward = this.boardContent[theCard.y_position + 1][theCard.x_position]
                }  
            }
            if (theCard != 0 && theCard.type == 'chara' && theCard.isPlayer == false && theCard.isSummoned == false && theCard.sleep[0] == false){
                let remaining_steps = theCard.movement
                let hasNotAttacked = true
                for (m = 1; m <= theCard.movement; m++){
                    if (this.boardContent[r + m] != undefined){
                        if (theCard.y_position != this.dongBoard.length - 1){
                            this.check_forward = this.boardContent[theCard.y_position + 1][theCard.x_position]
                        }
                        if(this.check_forward != 0 && theCard.y_position != this.dongBoard.length - 1 && this.check_forward.isPlayer == true && hasNotAttacked == true && theCard.scare[0] == false){
                            this.attack_player_card(theCard, this.check_forward)
                            hasNotAttacked = false
                            await this.set_delay(1000)
                        }
                        if (theCard.y_position != this.dongBoard.length - 1){
                            this.check_forward = this.boardContent[theCard.y_position + 1][theCard.x_position]
                        }
                        if (remaining_steps > 0 && this.check_forward == 0){
                            if (this.board_id == 0){
                                theCard.y = theCard.y + 120
                            }
                            if (this.board_id == 1){
                                theCard.y = theCard.y + 80.2
                            }
                            theCard.y_position++
                            remaining_steps--
                            this.boardContent[theCard.y_position][theCard.x_position] = theCard;
                            this.boardStatus[theCard.y_position][theCard.x_position] = 'occupied';
                            this.boardContent[theCard.y_position - 1][theCard.x_position] = 0
                            this.boardStatus[theCard.y_position - 1][theCard.x_position] = 0
                            await this.set_delay(500)
                        }
                    } 
                    if(theCard.y_position == this.dongBoard.length - 1 && theCard.scare[0] == false){
                        this.attack_player(theCard)
                        await this.set_delay(500)
                        break;
                    }
                }
            }
            if (theCard != 0) {
                theCard.isSummoned = false
            }
        }
    }
    await this.set_delay(1)
    this.turn_ends()
}

testRoom.prototype.attack_enemy_card = async function (attacker, attacked) {
    attacked.startAnimation($dataAnimations[111], false, 0);
    let damage = attacker.attack - attacked.defense;
    if (damage < 0) {
        damage = 0
    }
    attacked.hp = attacked.hp - damage
    await this.set_delay(1000)
    if (attacker.id + 1 == 59){
        attacked.hp++
        this.turn_damage(attacked, 1, 2)
    }
    if (attacker.id + 1 == 64){
        attacked.hp++
        this.turn_damage(attacked, 1, 3)
    }
    if (attacked.hp <= 0){
        this.removeChild(attacked);
        this.boardContent[attacked.y_position][attacked.x_position] = 0; 
        this.boardStatus[attacked.y_position][attacked.x_position] = 0;
        await this.set_delay(500)
    } else {
        if (attacker.invincible[0] == false){
            attacker.startAnimation($dataAnimations[1], false, 0);
            damage = attacked.attack
            attacker.hp = attacker.hp - damage
            await this.set_delay(1000)
            if (attacker.hp <= 0){
                this.kill_card(attacker)
            }
        } else {
            AudioManager.playSe({ name: 'Evasion1', pan: 0, pitch: 100, volume: 100 });
            console.log("counter attack dodged")
        }
    }
}

testRoom.prototype.attack_player_card = async function (attacker, attacked) {
    if (attacked.invincible[0] == false && attacker.blindness == 0 && attacked.dodge == 0){
        attacked.startAnimation($dataAnimations[1], false, 0);
        let damage = attacker.attack - attacked.defense;
        if (damage < 0) {
            damage = 0
        }
        attacked.hp = attacked.hp - damage
        await this.set_delay(1000)
        if (attacked.hp <= 0){
            this.removeChild(attacked);
            this.boardContent[attacked.y_position][attacked.x_position] = 0; 
            this.boardStatus[attacked.y_position][attacked.x_position] = 0;
            await this.set_delay(500)
        } else {
            attacker.startAnimation($dataAnimations[111], false, 0);
            damage = attacked.attack
            attacker.hp = attacker.hp - damage
            await this.set_delay(1000)
            if (attacker.hp <= 0){
                this.kill_card(attacker)
            }
        }
    } else if (attacker.blindness != 0) {
        console.log("precison ok")
        let n = Math.floor(Math.random() * attacker.blindness);
        if (n + 1 == attacker.blindness){
            attacked.startAnimation($dataAnimations[1], false, 0);
            let damage = attacker.attack - attacked.defense;
            if (damage < 0) {
                damage = 0
            }
            attacked.hp = attacked.hp - damage
            await this.set_delay(1000)
            if (attacked.hp <= 0){
                this.removeChild(attacked);
                this.boardContent[attacked.y_position][attacked.x_position] = 0; 
                this.boardStatus[attacked.y_position][attacked.x_position] = 0;
                await this.set_delay(500)
            } else {
                attacker.startAnimation($dataAnimations[111], false, 0);
                damage = attacked.attack
                attacker.hp = attacker.hp - damage
                await this.set_delay(1000)
                if (attacker.hp <= 0){
                    this.kill_card(attacker)
                }
            }
        } else {
            AudioManager.playSe({ name: 'Evasion1', pan: 0, pitch: 100, volume: 100 });
            console.log("the card dodged")          
        }
    } else if (attacked.dodge != 0) {
        console.log("monkey dodge!")
        let n = Math.floor(Math.random() * attacked.dodge);
        console.warn("n: " + n + 1)
        console.log("dodge value")
        console.log(attacked.dodge)
        if (n + 1 != attacked.dodge){
            attacked.startAnimation($dataAnimations[1], false, 0);
            let damage = attacker.attack - attacked.defense;
            if (damage < 0) {
                damage = 0
            }
            attacked.hp = attacked.hp - damage
            await this.set_delay(1000)
            if (attacked.hp <= 0){
                this.removeChild(attacked);
                this.boardContent[attacked.y_position][attacked.x_position] = 0; 
                this.boardStatus[attacked.y_position][attacked.x_position] = 0;
                await this.set_delay(500)
            } else {
                attacker.startAnimation($dataAnimations[111], false, 0);
                damage = attacked.attack
                attacker.hp = attacker.hp - damage
                await this.set_delay(1000)
                if (attacker.hp <= 0){
                    this.kill_card(attacker)
                }
            }
        } else {
            AudioManager.playSe({ name: 'Evasion1', pan: 0, pitch: 100, volume: 100 });
            console.log("the card dodged")          
        }
    } else{
        AudioManager.playSe({ name: 'Evasion1', pan: 0, pitch: 100, volume: 100 });
        console.log("the card dodged")
    }

}

testRoom.prototype.kill_card = function(card) {
    this.removeChild(card);
    this.boardContent[card.y_position][card.x_position] = 0;
    this.boardStatus[card.y_position][card.x_position] = 0;
}

testRoom.prototype.attack_enemy_boss = async function (attacker) {
    this._enemySprite.startAnimation($dataAnimations[111], false, 0);
    let damage = attacker.attack;
    this.enemyHp = this.enemyHp - damage
    this._enemyWindow.refresh(this.enemyMaxHp, this.enemyHp)
    await this.set_delay(500)
    if (this.enemyHp <= 0){
        this.enemyDead = true
        this.end_battle(true)
    }
}

testRoom.prototype.turn_ends = function () {
    this.check_card_status()
    this.check_player_status()
    this.refresh_hand()
    this.playerPa = this.playerMaxPa
    this._playerWindow.refresh(this.playerMaxHp, this.playerHp, this.playerMaxPa, this.playerPa)
    this._detailsWindow.removeChildren()
    this._detailsWindow.refresh(this.fullHand[this.x_selection]);
    this.phase = 1;
}
testRoom.prototype.check_card_status = function () {
    for (r = 0; r < this.dongBoard.length; r++){
        for (c = 0; c < this.dongBoard[r].length; c++){
            let buffedCard = this.boardContent[r][c]
            if (buffedCard != 0){
                for (b = this.boardContent[r][c].buff.length - 1; b >= 0 ; b--){
                    let buffParameter = this.boardContent[r][c].buff[b][0]
                    let buffValue = this.boardContent[r][c].buff[b][1]
                    if (buffParameter != false && this.boardContent[r][c].buff[b][2] == 1){
                        console.log("no more buff")
                        if (buffParameter == 'movement'){
                            buffedCard.movement -= buffValue
                        }
                        if (buffParameter == 'attack'){
                            buffedCard.attack -= buffValue
                        }
                        if (buffParameter == 'hp'){
                            buffedCard.maxhp -= buffValue
                            buffedCard.hp -= buffValue
                        }
                        if (buffParameter == 'ap'){
                            this.playerMaxPa -= buffValue
                        }
                        if (buffParameter == 'precision'){
                            buffedCard.blindness = buffValue
                        }
                        this.boardContent[r][c].buff.splice(this.boardContent[r][c].buff.indexOf(this.boardContent[r][c].buff[b], 1))
                    } else if (buffParameter != false && this.boardContent[r][c].buff[2] > 1){
                        this.boardContent[r][c].buff[2]--
                    }
                }
                if (this.boardContent[r][c].invincible[0] == true && this.boardContent[r][c].invincible[1] == 1){
                    this.boardContent[r][c].invincible[0] = false
                    this.boardContent[r][c].invincible[1] = 0
                } else if (this.boardContent[r][c].invincible[0] == true && this.boardContent[r][c].invincible[1] > 1){
                    this.boardContent[r][c].invincible[1]--
                }
                if (this.boardContent[r][c].damage[0] != 0 && this.boardContent[r][c].damage[1] == 1){
                    this.boardContent[r][c].hp -= this.boardContent[r][c].damage[0]
                    if (this.boardContent[r][c].hp <= 0){
                        this.removeChild(this.boardContent[r][c]);
                        this.boardContent[r][c] = 0; 
                        this.boardStatus[r][c] = 0;
                    }
                    if (this.boardContent[r][c] != 0){
                        this.boardContent[r][c].damage[0] = 0
                        this.boardContent[r][c].damage[1] = 0
                    }
                } else if (this.boardContent[r][c].damage[0] != 0 && this.boardContent[r][c].damage[1] > 1){
                    this.boardContent[r][c].hp -= this.boardContent[r][c].damage[0]
                    if (this.boardContent[r][c].hp <= 0){
                        this.removeChild(this.boardContent[r][c]);
                        this.boardContent[r][c] = 0; 
                        this.boardStatus[r][c] = 0;
                    }
                    if (this.boardContent[r][c] != 0){
                        this.boardContent[r][c].damage[1]--
                    }
                }
                console.warn("10 Mar: GLIITCH! While meeting AEMALTT")
                console.log("this.boardContent[r][c]")
                console.log(this.boardContent[r][c])
                console.log("this.boardContent[r][c].sleep")
                console.log(this.boardContent[r][c].sleep)
                if (this.boardContent[r][c].sleep[0] == true && this.boardContent[r][c].sleep[1] == 1){
                    this.boardContent[r][c].sleep[0] = false
                    this.boardContent[r][c].sleep[1] = 0
                } else if (this.boardContent[r][c].sleep[0] == true && this.boardContent[r][c].sleep[1] > 1){
                    this.boardContent[r][c].sleep[1]--
                }
                console.warn(this.boardContent[r][c].regen[1])
                if (this.boardContent[r][c].regen[0] != 0 && this.boardContent[r][c].regen[1] == 1){
                    console.log("regen end")
                    this.boardContent[r][c].hp += this.boardContent[r][c].regen[0]
                    if (this.boardContent[r][c].hp >= this.boardContent[r][c].maxhp){
                        this.boardContent[r][c].hp = this.boardContent[r][c].maxhp
                    }
                    this.boardContent[r][c].regen[0] = 0
                    this.boardContent[r][c].regen[1] = 0
                } else if (this.boardContent[r][c].regen[0] != 0 && this.boardContent[r][c].regen[1] > 1){
                    console.log("regen - 1 turn")
                    this.boardContent[r][c].hp += this.boardContent[r][c].regen[0]
                    if (this.boardContent[r][c].hp >= this.boardContent[r][c].maxhp){
                        this.boardContent[r][c].hp = this.boardContent[r][c].maxhp
                    }
                    this.boardContent[r][c].regen[1]--
                }
                if (this.boardContent[r][c].scare[0] == true && this.boardContent[r][c].scare[1] == 1){
                    this.boardContent[r][c].scare[0] = false
                    this.boardContent[r][c].scare[1] = 0
                } else if (this.boardContent[r][c].scare[0] == true && this.boardContent[r][c].scare[1] > 1){
                    this.boardContent[r][c].scare[1]--
                }
                if (this.boardContent[r][c].goitre[0] == true && this.boardContent[r][c].goitre[1] == 1){
                    this.boardContent[r][c].hp -= 20
                    if (this.boardContent[r][c].hp <= 0){
                        this.removeChild(this.boardContent[r][c]);
                        this.boardContent[r][c] = 0; 
                        this.boardStatus[r][c] = 0;
                    }
                } else if (this.boardContent[r][c].goitre[0] == true && this.boardContent[r][c].goitre[1] > 1){
                    this.boardContent[r][c].goitre[1]--
                }
            }
        }
    }
}

testRoom.prototype.check_player_status = function () {
    let buffParameter = this.playerBuff[0]
    let buffValue = this.playerBuff[1]
    if (buffParameter != false && this.playerBuff[2] == 1){
        if (buffParameter == 'attack'){
            buffedCard.attack -= buffValue
        }
        if (buffParameter == 'hp'){
            buffedCard.maxhp -= buffValue
            buffedCard.hp -= buffValue
        }
        if (buffParameter == 'ap'){
            this.playerMaxPa -= buffValue
        }
        this.playerBuff = [false, 0, 0]
    } else if (buffParameter != false && this.playerBuff[2] > 1){
        this.playerBuff[2]--
    }
}

testRoom.prototype.refresh_hand = function () {
    this.newActionContent = [0, 0, 0]
    this.newCharaContent = [0, 0, 0]
    let n = 0
    for(let i = 0; i < this.fullHand.length; i++){
        if (this.fullHand[i].type == 'action'){
            this.newActionContent[i] = this.fullHand[i];
            n++
        } 
        if (this.fullHand[i].type == 'chara'){
            this.newCharaContent[i - n] = this.fullHand[i];
        } 
    }
    this.newHandContent = this.newActionContent.concat(...this.newCharaContent)
    this.newActionContent = [0, 0, 0]
    this.newCharaContent = [0, 0, 0]
    this.refresh_card_hands()
}

testRoom.prototype.refresh_card_hands = async function () {

    for(let n = 0; n < this.newHandContent.length; n++){
        if (this.newHandContent[n] != 0 && this.newHandContent[n].type == 'action'){
            this.newHandContent[n].x = 617.5 + 100 * n
        }
        if (this.newHandContent[n] != 0 && this.newHandContent[n].type == 'chara'){
            this.newHandContent[n].x = 717.5 + 100 * n
        }
        if (this.newHandContent[n] == 0 && n < 3){
            this.probabilitized(this.actionDeck, this.actionLevels)
            console.warn("ACTION")
            console.log(this.sorted_card)
            console.log(this.actionDeck.indexOf(this.sorted_card))
            this.generate_player_card(this.newHandContent, n, this.actionDeck.indexOf(this.sorted_card), 617.5 + 100 * n, this.actionDeck)
        }    
        if (this.newHandContent[n] == 0 && n >= 3){
            this.probabilitized(this.charaDeck, this.actionLevels)
            console.warn("CHARA")
            console.log(this.sorted_card)
            console.log(this.charaDeck.indexOf(this.sorted_card))
            this.generate_player_card(this.newHandContent, n, this.charaDeck.indexOf(this.sorted_card), 717.5 + 100 * n, this.charaDeck)
        }
    }
    this.fullHand = this.newHandContent
    this.newHandContent = [0, 0, 0, 0, 0, 0]
}

testRoom.prototype.enemy_turn = function (ap) {
    let action_rolls = this.getEnemyActions(ap)
    let last_row = this.checkLastRow()
    this.attacking = async () => {
        for (let i = 0; i < action_rolls.length; i++) {
            if (action_rolls[i] == 0){
                let attack_roll = this.selectTarget(last_row)
                if (last_row[attack_roll] == false){

                }
                if (last_row[attack_roll] != false){
                    if (attack_roll != 'player'){
                        this.enemy_attack_player_card(attack_roll, this.enemyAttack)
                        await this.set_delay(500)
                        if (this.boardContent[0][attack_roll].hp <= 0){
                            this.removeChild(this.boardContent[0][attack_roll]);
                            this.boardContent[0][attack_roll] = 0;
                            this.boardStatus[0][attack_roll] = 0;
                            last_row = this.checkLastRow()
                            await this.set_delay(500)
                        }
                    } 
                }
            }
            if (action_rolls[i] == 1){
                if (last_row.some(element => element == -1)){
                    let card_position = this.selectCardPosition(last_row)
                    this.enemy_play_card(card_position)
                    last_row = this.checkLastRow()
                    await this.set_delay(500)
                } else {
                    console.log("do nothing")
                }
            }
        }
        this.move_enemy_cards()
    }
    this.attacking()
}

testRoom.prototype.getEnemyActions = function (ap) {
    let action_rolls = []
    for (let i = 0; i < ap; i++){
        let n = Math.floor(Math.random() * 2);
        action_rolls.push(n)
    }
    return action_rolls
}

testRoom.prototype.checkLastRow = function () {
    let last_row = []
    for (let c = 0; c < this.dongBoard[0].length; c++){
        if (this.boardContent[0][c].isPlayer == true){
            last_row.push(this.boardContent[0][c].attack)
        } else if (this.boardContent[0][c].isPlayer == false){
            last_row.push(-2)
        } else {
            last_row.push(-1)
        }
    }
    return last_row
}

testRoom.prototype.selectTarget = function (targets) {
    let attack_roll = null
    if (targets.some(element => element >= 0)){
        let t = Math.max(...targets)
        attack_roll = targets.indexOf(t)
    } else {
        attack_roll = 'player'
    }
    return attack_roll
}

testRoom.prototype.selectCardPosition = function (row0) {
    let free_position = []
    for (let i = 0; i < row0.length; i++){
        if (row0[i] == -1){
            free_position.push(i)
        }
    }
    n = Math.floor(Math.random() * free_position.length);
    return free_position[n]
}

testRoom.prototype.attack_player = function (attacker) {
    if (attacker.blindness == 0){
        this._playerPointer.startAnimation($dataAnimations[1], false, 0);
        let damage = attacker.attack;
        this.playerHp = this.playerHp - damage
        this._playerWindow.refresh(this.playerMaxHp, this.playerHp, this.playerMaxPa, this.playerPa)
    } else if (attacker.blindness != 0) {
        console.warn("precison ok")
        console.log(attacker.blindness)
        let n = Math.floor(Math.random() * attacker.blindness);
        console.log("n: " + n)
        if (n + 1 == attacker.blindness){
            this._playerPointer.startAnimation($dataAnimations[1], false, 0);
            let damage = attacker.attack;
            this.playerHp = this.playerHp - damage
            this._playerWindow.refresh(this.playerMaxHp, this.playerHp, this.playerMaxPa, this.playerPa)
        } else {
            AudioManager.playSe({ name: 'Evasion1', pan: 0, pitch: 100, volume: 100 });
            console.log("the card dodged")          
        }
    }
}

testRoom.prototype.enemy_attack_player_card = function (attacked, enemyAttack) {
    if (this.boardContent[0][attacked].invincible[0] == false){
        let attackedCard = this.boardContent[0][attacked]
        attackedCard.startAnimation($dataAnimations[1], false, 0);
        console.warn("attack vs defense")
        console.log(enemyAttack)
        console.log(attacked.defense)
        let damage = enemyAttack - attackedCard.defense;
        if (damage < 0) {
            damage = 0
        }
        attackedCard.hp = attackedCard.hp - damage
    } else {
        AudioManager.playSe({ name: 'Evasion1', pan: 0, pitch: 100, volume: 100 });
        console.log("enemy attack dodged")
    }
}

testRoom.prototype.enemy_play_card = function (position) {
    let i = Math.floor(Math.random() * this.enemyDeck.length);
    if (this.board_id == 0){
        if (position == 0){
            this.generate_enemy_card(this.enemyDeck[i], this.card_list, 780, 834)
        } else {
            this.generate_enemy_card(this.enemyDeck[i], this.card_list, 780 + 120 * position, 834)
        }
    }
    if (this.board_id == 1){
        if (position == 0){
            this.generate_enemy_card(this.enemyDeck[i], this.card_list, 761.5, 840)
        } else {
            this.generate_enemy_card(this.enemyDeck[i], this.card_list, 761.5 + 99 * position, 840)
        }
    }
    this.boardStatus[0][position] = 'occupied'
    this.boardContent[0][position] = this.enemyCard
    this.enemyCard.x_position = position
    this.enemyCard.y_position = 0
    if (this.enemyBoost == 1){
        this.enemyCard.maxhp += 2
        this.enemyCard.hp = this.enemyCard.maxhp
    }
    if (this.enemyBoost == 2){
        this.enemyCard.defense += 1
    }
    if (this.enemyBoost == 3){
        this.enemyCard.attack += 3
    }
    if (this.enemyBoost == 4){
        this.enemyCard.movement += 2
    }
    if (this.enemyBoost == 5){
        this.enemyCard.maxhp += 2
        this.enemyCard.hp = this.enemyCard.maxhp
        this.enemyCard.defense += 2
        this.enemyCard.attack += 2
        this.enemyCard.movement += 2
    }
}

testRoom.prototype.create_details_window = function () {
    this._detailsWindow = new Window_Card_Details(0, 0, 580, 815);
    this.addChild(this._detailsWindow);
    this._detailsWindow.refresh(this.fullHand[0]);
    if (!this.use_window)
        this._detailsWindow.opacity = 0; 
}

testRoom.prototype.create_card_param_window = function () {
    let theCard = this.boardContent[this.y_selection][this.x_selection]
    this._hpWindow = new Window_Card_Hp(60, 810, 460, 200);
    this.addChild(this._hpWindow);
    this._hpWindow.refresh(theCard.maxhp, theCard.hp, theCard.attack, theCard.movement, theCard.defense);
    if (!this.use_window)
        this._hpWindow.opacity = 255; 
}

testRoom.prototype.load_player_parameters = function () {
    this.playerMaxPa = 4;
    this.playerPa = this.playerMaxPa;
    this.playerMaxHp = 120;
    this.playerHp = this.playerMaxHp;
    this.playerBuff = [false, 0, 0]
}

testRoom.prototype.load_enemy_sprite = function () {
    this._enemySprite = new Sprite_Base();
    let addLeadingZeros = function (num) {
        return String(num).padStart(3, '0');
    }
    let n = Math.floor(Math.random() * this.zoneDeck.length);
    this.enemySpriteId = this.zoneDeck[n]
    this._enemySprite.bitmap = ImageManager.loadPicture(`ennemi${addLeadingZeros(this.enemySpriteId + 1)}`)
    this.addChild(this._enemySprite);
    this._enemySprite.x = (Graphics.width / 2);
    this._enemySprite.y = 670;
    this._enemySprite.scale.x = 0.4
    this._enemySprite.scale.y = 0.4
    this._enemySprite.anchor.x = 0.5
    this._enemySprite.anchor.y = 1.8
}

testRoom.prototype.load_tutorial_sprite = function () {
    this._enemySprite = new Sprite_Base();
    this._enemySprite.bitmap = ImageManager.loadPicture(`ennemi${addLeadingZeros(this.enemySpriteId + 1)}`)
    this.addChild(this._enemySprite);
    this._enemySprite.x = (Graphics.width / 2);
    this._enemySprite.y = 670;
    this._enemySprite.scale.x = 0.4
    this._enemySprite.scale.y = 0.4
    this._enemySprite.anchor.x = 0.5
    this._enemySprite.anchor.y = 1.8
}

testRoom.prototype.load_enemy_parameters = function () {
    if(this.enemy_id == 0){
        this.enemyMaxHp = 10;
        this.enemyHp = this.enemyMaxHp;
        this.enemyAttack = 5
        this.enemyPa = 4;
        this.zoneDeck = [0, 54, 1, 58, 2, 66, 3, 68, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 28, 38]
        this.enemyDeck = [0, 54, 1, 58, 2, 66, 3, 68]
        this.load_enemy_sprite();
    }
    if(this.enemy_id == 1){

        this.enemyMaxHp = 20;
        this.enemyHp = this.enemyMaxHp;
        this.enemyAttack = 3
        this.enemyPa = 4;
        this.enemyBoost = 1 // boost pv +2
        this.zoneDeck = [0, 54, 1, 58, 2, 66, 3, 68, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 28, 38]
        this.enemyDeck = [0, 54, 1, 58, 2, 66, 3, 68]
        this.load_enemy_sprite();
    }
    if(this.enemy_id == 2){
        this.enemyMaxHp = 30;
        this.enemyHp = this.enemyMaxHp;
        this.enemyAttack = 3
        this.enemyPa = 3;
        this.enemyBoost = 2 // defense +1
        this.zoneDeck = [65, 52, 4, 61, 67, 5, 6, 7, 25, 26, 27, 32, 34, 35, 36, 37, 39, 40, 56, 57]
        this.enemyDeck = [65, 52, 4, 61, 67, 5, 6, 7]
        this.load_enemy_sprite();
    }
    if(this.enemy_id == 3){
        this.enemyMaxHp = 50;
        this.enemyHp = this.enemyMaxHp;
        this.enemyAttack = 5
        this.enemyPa = 3;
        this.enemyBoost = 3
        this.zoneDeck = [51, 53, 59, 60, 63, 55, 13, 69, 73, 74, 76, 77, 80, 85, 86, 88, 89, 99, 105, 106]
        this.enemyDeck = [51, 53, 59, 60, 63, 55, 13, 69]
        this.load_enemy_sprite();
        // attack +3
    }
    if(this.enemy_id == 4){
        this.enemyMaxHp = 100;
        this.enemyHp = this.enemyMaxHp;
        this.enemyAttack = 6
        this.enemyPa = 3;
        this.enemyBoost = 4
        this.zoneDeck = [8, 9, 10, 11, 12, 64, 62, 91, 24, 29, 30, 31, 33, 70, 75, 78, 79, 82, 83, 84]
        this.enemyDeck = [8, 9, 10, 11, 12, 64, 62, 91]
        this.load_enemy_sprite();
        // movement +2
    }
    if(this.enemy_id == 5){
        this.enemyMaxHp = 150;
        this.enemyHp = this.enemyMaxHp;
        this.enemyAttack = 10
        this.enemyPa = 4;
        this.enemyBoost = 5
        this.zoneDeck = [109, 110, 111, 112, 113, 114, 115, 116, 81, 92, 93, 94, 95, 96, 97, 98, 87, 90, 72, 71, 117]
        this.enemyDeck = [109, 110, 111, 112, 113, 114, 115, 116]
        this.load_enemy_sprite();
        // all stats +1
    }
    if(this.enemy_id == 'tutoriel'){
        this.enemyMaxHp = 15;
        this.enemyHp = this.enemyMaxHp;
        this.enemyAttack = 3
        this.enemyPa = 4;
        this.enemyBoost = 1
        this.enemyDeck = [0, 1, 2, 3]
        this._enemySprite = new Sprite_Base();
        this._enemySprite.bitmap = ImageManager.loadPicture(`ennemi002`)
        this.addChild(this._enemySprite);
        this._enemySprite.x = (Graphics.width / 2);
        this._enemySprite.y = 670;
        this._enemySprite.scale.x = 0.4
        this._enemySprite.scale.y = 0.4
        this._enemySprite.anchor.x = 0.5
        this._enemySprite.anchor.y = 1.8
        // all stats +1
    }
    if(this.enemy_id == 'poisson'){
        this.enemyMaxHp = 30;
        this.enemyHp = this.enemyMaxHp;
        this.enemyAttack = 3
        this.enemyPa = 4;
        this.enemyBoost = 1 // boost pv +2
        this.enemyDeck = [0, 54, 1, 58, 2, 66, 3, 68]
        this._enemySprite = new Sprite_Base();
        this._enemySprite.bitmap = ImageManager.loadPicture(`ennemi055`)
        this.addChild(this._enemySprite);
        this._enemySprite.x = (Graphics.width / 2);
        this._enemySprite.y = 670;
        this._enemySprite.scale.x = 0.4
        this._enemySprite.scale.y = 0.4
        this._enemySprite.anchor.x = 0.5
        this._enemySprite.anchor.y = 1.8
        // all stats +1
    }
}

testRoom.prototype.set_action_card_effect = function (effectId){
    let boostedCard = this.boardContent[this.y_selection][this.x_selection]
    switch (effectId) {
        case 15: 
            this.buff(boostedCard, 'movement', 1) //ok
        break;
        case 16: 
            this.heal(boostedCard, 8)
            this.limited_buff(boostedCard, 'movement', -3, 1) //TEST
        break;
        case 17: 
            this.invincible(boostedCard, 1) //ok
        break;
        case 18: 
            this.invincible(boostedCard, 1) //ok
        break;
        case 19: 
            this.limited_buff(boostedCard, 'attack', 4, 2) //ok
        break;
        case 20: 
            this.buff(boostedCard, 'attack', -2) //ok
        break;
        case 21: 
            this.magic_damage(boostedCard, 5) //ok
        break;
        case 22: 
            this.limited_buff(boostedCard, 'ap', 2, 2) //ok -retest
        break;
        case 23: 
            this.magic_damage(boostedCard, 2) //ok
            this.buff(boostedCard, 'movement', -1) //ok
        break;
        case 24: 
            this.magic_damage(boostedCard, 4) //ok
        break;
        case 25: 
            this.magic_damage(boostedCard, 8) //ok
        break;
        case 26: 
            this.heal(boostedCard, 4) //ok
        break;
        case 27: 
            this.buff(boostedCard, 'movement', 1) //ok
        break;
        case 28: 
            this.buff(boostedCard, 'movement', 1)
        break;
        case 29: 
            this.magic_damage(boostedCard, 4)
        break;
        case 30: 
            this.magic_damage(boostedCard, 8)
        break;
        case 31: 
            this.buff(boostedCard, 'precision', 2) //ok
        break;
        case 32: 
            this.limited_buff(boostedCard, 'ap', 2, 2) //ok -retest
        break;
        case 33: 
            this.turn_damage(boostedCard, 2, 3) //ok
        break;
        case 34: 
            this.sleep(boostedCard, 1) //ok
        break;
        case 35: 
            this.limited_buff(boostedCard, 'ap', 1, 2) //ok
        break;
        case 36: 
            this.buff(boostedCard, 'defense', 2) //ok
        break;
        case 37: 
            this.heal(boostedCard, 4) //ok
        break;
        case 38: 
            this.regen(boostedCard, 2, 3) //ok
        break;
        case 39: 
            this.magic_damage(boostedCard, 4) //ok
            this.limited_buff(boostedCard, 'movement', -1, 1) //ok
        break;
        case 40: 
            this.magic_damage(boostedCard, 5)
        break;
        case 41: 
            this.magic_damage(boostedCard, 3)
            this.buff(boostedCard, 'movement', -1)
        break;
        case 52: 
            this.buff_all_ally('attack', 1) //ok
        break;
        case 53: 
            this.heal_all_ally(2) //ok
        break;
        case 54: 
            this.buff_all_ally('defense', 1) //ok
        break; 
        case 55: 
            //ok
        break;
        case 56: 
            this.buff_all_ally('movement', 1)
        break;
        case 57: 
            this.buff(boostedCard, 'attack', 2)
        break;
        case 58: 
            this.buff(boostedCard, 'hp', 2)
        break;
        case 59: 

        break;
        case 60: 
            this.buff_all_ally('hp', 1)
        break;
        case 61: 
            this.damage_all_enemy(3)
        break;
        case 63: 
            this.damage_all_enemy(4)
        break;
        case 64: 
            //ok
        break;
        case 65: 
            this.buff_all_ally('movement', 1)
        break;
        case 66: 
            this.heal_all_ally(1)
        break;
        case 67: 
            //ok
        break;
        case 69: 
            this.damage_all_enemy(2)
        break;
        case 70: 
            this.buff_all_ally('defense', 2)
        break;
        case 71: 
            this.buff(boostedCard, 'attack', -4)
        break;
        case 72: 
            this.buff(boostedCard, 'attack', boostedCard.attack) //ok
        break;
        case 73: 
            this.buff(boostedCard, 'attack', 6)
        break;
        case 74: 
            this.heal(boostedCard, 6) 
        break;
        case 75: 
            this.buff(boostedCard, 'attack', 10) 
            this.buff(boostedCard, 'precision', 4) //test
        break;
        case 76: 
            this.buff(boostedCard, 'movement', 2)
        break;
        case 77: 
            this.buff(boostedCard, 'attack', 3)
            this.buff(boostedCard, 'movement', 1)
        break;
        case 78: 
            this.magic_damage(boostedCard, 4)
            this.limited_buff(boostedCard, 'movement', -1, 1)
        break;
        case 79: 
            this.scare(boostedCard, 2) //ok
        break;
        case 80: 
            this.buff(boostedCard, 'movement', -2)
        break;
        case 81: 
        this.turn_damage(boostedCard, 2, 4)
        break;
        case 82: 
            this.scare(boostedCard, 3)
        break;
        case 83: 
            this.magic_damage(boostedCard, 30)
        break;
        case 84: 
            this.buff(boostedCard, 'hp', 7)
        break;
        case 85: 
            this.buff(boostedCard, 'hp', 5)
            this.buff(boostedCard, 'attack', 2)
        case 86: 
            let randomStat = Math.floor(Math.random() * 4)
            console.warn(randomStat)
            if (randomStat == 0){
                console.log("movement check")
                boostedCard.movement -= 1
            }
            this.buff(boostedCard, randomStat, 2) //ok
        break;
        case 87:
            this.buff(boostedCard, 'attack', 2)
            this.buff(boostedCard, 'hp', 2)
            this.buff(boostedCard, 'movement', 1)
        break;
        case 88: 
            this.goitre(boostedCard, 2) //ok
        break;
        case 89: 
            this.buff(boostedCard, 'attack', -2)
        break;
        case 90: 
            this.buff(boostedCard, 'attack', 2)
            this.buff(boostedCard, 'hp', 2)
        break;
        case 91: 
            this.buff(boostedCard, 'hp', boostedCard.hp) //test
        break;
        case 92: 
            this.buff_all_ally('defense', 2)
        break;
        case 93: 
            this.buff_all_ally('attack', 3) //ok
        break;
        case 94: 
            this.buff_all_ally('defense', 2) //ok
        break;
        case 95: 
            this.damage_all_enemy(6) //ok
        break;
        case 96: 
            this.damage_all_enemy(boostedCard, 4)
            this.debuff_all_enemy('movement', -1)
        break;
        case 97: 
            this.limited_buff(boostedCard, 'ap', 1, 4) // 4 tours
        break;
        case 98: 
            this.regen_all(2, 9999)
        break;
        case 99: 
            this.sleep_all(1)
        break;
        case 100: 
            this.turn_damage(boostedCard, 5, 2) //2 tours
        break;
        case 106: 
            this.regen(boostedCard, 2, 9999)
        break;
        case 107: 
            this.heal(boostedCard, 3)
        break;
        case 110: 
            this.buff_all_ally('defense', 3)
        break;
        case 111: 
            this.buff_all_ally('attack', 3)
        break;
        case 112: 
         this.damage_all_enemy(boostedCard, 5)
        break;
        case 113: 
            this.buff_all_ally('hp', 3)
        break;
        case 114: 
            this.heal_all_ally(5)
        break;
        case 115: 
            this.dodge(boostedCard)
        break;
        case 116: 
            this.dodge(boostedCard)
        break;
        case 117: 
            this.dodge(boostedCard)
        break;
        case 118: 
            this.buff(boostedCard, 'attack', 3)
            this.buff(boostedCard, 'hp', 3)
            this.buff(boostedCard, 'defense', 2)
        break;
    }
}

testRoom.prototype.heal = function (target, value) {
    target.hp += value
    if (target.hp > target.maxhp) {
        target.hp = target.maxhp
    }
}

testRoom.prototype.heal_all_ally = function (value) {
    for (r = 0; r < this.dongBoard.length; r++){
        for (c = 0; c < this.dongBoard[r].length; c++){
            if (this.boardContent[r][c].isPlayer == true){
                this.boardContent[r][c].hp += value
                if (this.boardContent[r][c].hp > this.boardContent[r][c].maxhp) {
                    this.boardContent[r][c].hp = this.boardContent[r][c].maxhp
                }
            }
        }
    }
}

testRoom.prototype.buff = function (target, parameter, value) {
    if (parameter == 'movement' || parameter == 0){
        target.movement += value
    }
    if (parameter == 'attack' || parameter == 1){
        target.attack += value
    }
    if (parameter == 'defense' || parameter == 2){
        target.defense = value
    }
    if (parameter == 'hp' || parameter == 3){
        target.maxhp += value
        target.hp += value
    }
    if (parameter == 'ap'){
        this.playerMaxPa += value
        this.playerPa += value
    }
    if (parameter == 'precision'){
        target.blindness = value
    }
}

testRoom.prototype.buff_all_ally = function (parameter, value) {
    console.log("buffall")
    for (r = 0; r < this.dongBoard.length; r++){
        for (c = 0; c < this.dongBoard[r].length; c++){
            if (this.boardContent[r][c].isPlayer == true){
                if (parameter == 'movement'){
                    this.boardContent[r][c].movement += value
                }
                if (parameter == 'attack'){
                    this.boardContent[r][c].attack += value
                }
                if (parameter == 'defense'){
                    this.boardContent[r][c].defense = value
                }
                if (parameter == 'hp'){
                    this.boardContent[r][c].maxhp += value
                    this.boardContent[r][c].hp += value
                }
                if (parameter == 'ap'){
                    this.boardContent[r][c].playerMaxPa += value
                }
                if (parameter == 'precision'){
                    this.boardContent[r][c].blindness = value
                }
            }
        }
    }
}

testRoom.prototype.debuff_all_enemy = function (parameter, value) {
    for (r = 0; r < this.dongBoard.length; r++){
        for (c = 0; c < this.dongBoard[r].length; c++){
            if (this.boardContent[r][c].isPlayer == false){
                if (parameter == 'movement'){
                    this.boardContent[r][c].movement += value
                }
                if (parameter == 'attack'){
                    this.boardContent[r][c].attack += value
                }
                if (parameter == 'hp'){
                    this.boardContent[r][c].maxhp += value
                    this.boardContent[r][c].hp += value
                }
                if (parameter == 'precision'){
                    this.boardContent[r][c].blindness = value
                }
            }
        }
    }
}

testRoom.prototype.limited_buff = function (target, parameter, value, turns) {
    if (parameter == 'movement'){
        target.movement += value
        target.buff.push([parameter, value, turns])
    }
    if (parameter == 'attack'){
        target.attack += value
        target.buff.push([parameter, value, turns])
    }
    if (parameter == 'hp'){
        target.maxhp += value
        target.hp += value
        target.buff.push([parameter, value, turns])
    }
    if (parameter == 'ap'){
        this.playerMaxPa += value
        this.playerPa += value
        this.playerBuff = [parameter, value, turns]
    }
    if (parameter == 'precision'){
        target.blindness = value
        target.buff = [parameter, value, turns]
    }
}

testRoom.prototype.buff_select = function (parameter, value) {
    this.parameter = parameter
    this.value = value
    this.y_selection = this.dongBoard.length;
    this.x_selection = 0;
    this.phase = 102;
    this.activate_dongboard();
}

testRoom.prototype.regen = function (target, value, turns) {
    target.hp += value
    turns--
    target.regen = [value, turns]
}

testRoom.prototype.regen_all = function (value, turns) {
    for (r = 0; r < this.dongBoard.length; r++){
        for (c = 0; c < this.dongBoard[r].length; c++){
            if (this.boardContent[r][c].isPlayer == true){
                this.boardContent[r][c].hp += value
                turns--
                this.boardContent[r][c].regen = [value, turns]
            } 
        }
    }
}

testRoom.prototype.sleep_all = function (turns) {
    for (r = 0; r < this.dongBoard.length; r++){
        for (c = 0; c < this.dongBoard[r].length; c++){
            if (this.boardContent[r][c].isPlayer == false){
                this.boardContent[r][c].sleep = [true, turns]
            }
        }
    }
}

testRoom.prototype.poison = function (target, value) {
    target.poison = [0, 0]
}

testRoom.prototype.sleep = function (target, turns) {
    target.sleep = [true, turns]
}

testRoom.prototype.scare = function (target, turns) {
    target.scare = [true, turns]
}

testRoom.prototype.goitre = function (target, turns) {
    target.goitre = [true, turns]
}

testRoom.prototype.magic_damage = function (target, value) {
    target.hp -= value
}

testRoom.prototype.turn_damage = function (target, value, turns) {
    target.hp -= value
    turns--
    target.damage = [value, turns]
}

testRoom.prototype.damage_all_enemy = function (value) {
    for (r = 0; r < this.dongBoard.length; r++){
        for (c = 0; c < this.dongBoard[r].length; c++){
            if (this.boardContent[r][c].isPlayer == false){
                this.boardContent[r][c].hp -= value
                if (this.boardContent[r][c].hp <= 0){
                    this.removeChild(this.boardContent[r][c]);
                    this.boardContent[r][c] = 0; 
                    this.boardStatus[r][c] = 0;
                }
            }
        }
    }
}

testRoom.prototype.attack_select = function (value) {
    this.value = value
    this.y_selection = this.dongBoard.length;
    this.x_selection = 0;
    this.phase = 103;
    this.activate_dongboard();
}

testRoom.prototype.invincible = function (target, turns) {
    target.invincible = [true, turns]
}

testRoom.prototype.invincible = function (target, turns) {
    target.dodge = [turns]
}

function Dongba_Card() {
    this.initialize.apply(this, arguments);
}

Dongba_Card.prototype = Object.create(Sprite_Base.prototype);
Dongba_Card.prototype.constructor = Dongba_Card;

Dongba_Card.prototype.initialize = function () {
    Sprite_Base.prototype.initialize.call(this);
};

function Enemy_Test() {
    this.initialize.apply(this, arguments);
}

Enemy_Test.prototype = Object.create(Sprite.prototype);
Enemy_Test.prototype.constructor = Enemy_Test;

Enemy_Test.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
};

function Window_Select_Answer() {
    this.initialize.apply(this, arguments);
};

Window_Select_Answer.prototype = Object.create(Window_Command.prototype);
Window_Select_Answer.prototype.constructor = Window_Select_Answer;

Window_Select_Answer.prototype.initialize = function(x, y, width, height, arr) {
    this.wh = height;
    this.ww = width;
    this.word_selection = arr
    Window_Command.prototype.initialize.call(this, x, y, width, height);

};

Window_Select_Answer.prototype.makeCommandList = function() {
    for (let i = 0; i < this.word_selection.length; i++){
        this.addCommand(this.word_selection[i], this.word_selection[i]);
    }
};

Window_Select_Answer.prototype.numVisibleRows = function() {
    return 1;
    };
    Window_Select_Answer.prototype.maxCols = function() {
        return 10;
        };
    Window_Select_Answer.prototype.itemTextAlign = function() {
    return 'center';
    };

Window_Select_Answer.prototype.windowHeight = function() {
    return this.wh;
};
Window_Select_Answer.prototype.windowWidth = function() {
    return this.ww;
};

Window_Select_Answer.prototype.playOkSound = function() {
    // SoundManager.playOk();      <-----Prevent CommandWindow to play sounds
};

function Window_Abandon() {
    this.initialize.apply(this, arguments);
};

Window_Abandon.prototype = Object.create(Window_Command.prototype);
Window_Abandon.prototype.constructor = Window_Abandon;

Window_Abandon.prototype.initialize = function(x, y, width, height, arr) {
    this.wh = height;
    this.ww = width;
    this.word_selection = arr
    Window_Command.prototype.initialize.call(this, x, y, width, height);

};

Window_Abandon.prototype.makeCommandList = function() {
    for (let i = 0; i < this.word_selection.length; i++){
        this.addCommand(this.word_selection[i], this.word_selection[i]);
    }
};

Window_Abandon.prototype.numVisibleRows = function() {
    return 1;
    };
    Window_Abandon.prototype.maxCols = function() {
        return 10;
        };
        Window_Abandon.prototype.itemTextAlign = function() {
    return 'center';
    };

    Window_Abandon.prototype.windowHeight = function() {
    return this.wh;
};
Window_Abandon.prototype.windowWidth = function() {
    return this.ww;
};

function Window_Enemy() {
    this.initialize.apply(this, arguments);
};

Window_Enemy.prototype = Object.create(Window_Base.prototype);
Window_Enemy.prototype.constructor = Window_Enemy;

Window_Enemy.prototype.initialize = function(x, y, width, height) {
    this.wh = height;
    this.ww = width;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh(0, 0)

};

Window_Enemy.prototype.refresh = function (maxPv, pv){
    this.contents.clear();
    this.drawText("PV      " + pv + "/" + maxPv, 0, 0, this.width, 'left')
}

Window_Player.prototype = Object.create(Window_Base.prototype);
Window_Player.prototype.constructor = Window_Player;

Window_Player.prototype.initialize = function(x, y, width, height) {
    this.wh = height;
    this.ww = width;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh(0, 0, 0, 0)
};

function Window_Player() {
    this.initialize.apply(this, arguments);
};

Window_Player.prototype.refresh = function (maxPv, pv, maxPa, pa){
    this.contents.clear();
    this.drawText("PV      " + pv + "/" + maxPv, 0, 0, this.width, 'left')
    this.drawText("PA      " + pa + "/" + maxPa, 0, 40, this.width, 'left')
}

Window_Card_Details.prototype = Object.create(Window_Base.prototype);
Window_Card_Details.prototype.constructor = Window_Card_Details;

Window_Card_Details.prototype.initialize = function(x, y, width, height) {
    this.wh = height;
    this.ww = width;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh(0)
};

function Window_Card_Details() {
    this.initialize.apply(this, arguments);
};

Window_Card_Details.prototype.refresh = function (card){
    this.contents.clear();
    if (card == 0){

    } else {
        this._cardBitmap = new Sprite();
        this._cardBitmap.bitmap = card.bitmap;
        this.addChild(this._cardBitmap);
        this._cardBitmap.scale.x = 0.7;
        this._cardBitmap.scale.y = 0.7;
        this._cardBitmap.x = 290;
        this._cardBitmap.y = 470;
        this._cardBitmap.anchor.x = 0.5;
        this._cardBitmap.anchor.y = 0.5;
    }
}

Window_Card_Hp.prototype = Object.create(Window_Base.prototype);
Window_Card_Hp.prototype.constructor = Window_Card_Hp;

Window_Card_Hp.prototype.initialize = function(x, y, width, height) {
    this.wh = height;
    this.ww = width;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh(0, 0, 0, 0 ,0)
};

function Window_Card_Hp() {
    this.initialize.apply(this, arguments);
};

Window_Card_Hp.prototype.refresh = function (cardMaxPv, cardPv, cardAtt, cardMov, cardDef){
    this.contents.clear();
    this.drawText("PV           " + cardPv + "/" + cardMaxPv, 0, 0, this.width, 'left')
    this.drawText("Attaque      " + cardAtt, 0, 40, this.width, 'left')
    this.drawText("Mouvement    " + cardMov, 0, 80, this.width, 'left')
    this.drawText("Defense      " + cardDef, 0, 120, this.width, 'left')
}