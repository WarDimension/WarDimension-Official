var cards = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "skip", "reverse", "+2", "wild", "+4"];
var colors = ["red", "yellow", "green", "blue"];

function randomCard(){
    var card_index = Math.floor(Math.random() * 15);

    var special = Math.floor(Math.random() * 2);

    if(card_index >= 12 && card_index <= 14 && special != 0){
        card_index = Math.floor(Math.random() * 12);
    }

    var card = "";

    if(card_index != 13 && card_index != 14){
        var color_index = Math.floor(Math.random() * 4);
        card = colors[color_index] + " ";
    }

    return card + cards[card_index];
}

function random7Cards(){
    var sevCards = [];
    for(i = 0; i < 7; i++){
        sevCards.push(randomCard());
    }

    return sevCards;
}

function randomName(ai_id){
    var ai_name = ai_names[Math.floor(Math.random() * ai_names.length)];
    switch(ai_id){
        case 1:
            while(ai_name == player_name){
                ai_name = ai_names[Math.floor(Math.random() * ai_names.length)];
            }
            break;
        case 2:
            while(ai_name == player_name || ai_name == ai_001_name){
                ai_name = ai_names[Math.floor(Math.random() * ai_names.length)];
            }
            break;
        case 3:
            while(ai_name == player_name || ai_name == ai_001_name || ai_name == ai_002_name){
                ai_name = ai_names[Math.floor(Math.random() * ai_names.length)];
            }
            break;
    }
    return ai_name;
}

var ai_names = ["AI-chan", "I'm a human, I swear", "I'm fine", "AI FTW", "._.)", "UNO_BOT", "Markdivider", "Javascript AI", "WarDimension"];
var player_name = "player_1";
var ai_001_name = "";
var ai_002_name = "";
var ai_003_name = "";

if(localStorage.getItem("player_name") != null){
    changeName(localStorage.getItem("player_name"));
}

var current_card = "";
var player_cards = "";
var ai_001_cards = "";
var ai_002_cards = "";
var ai_003_cards = "";

function cardDSP(cp_cards){
    for(i = 0; i < cp_cards.length; i++){
        cl_dsp.innerHTML += `[${i+1}] ${cp_cards[i]} `;
    }
}

function UNO_PRE(){
    localStorage.setItem("player_name", player_name);
    first_in = true;

    ai_001_name = randomName(1);
    ai_002_name = randomName(2);
    ai_003_name = randomName(3);

    current_card = randomCard();

    player_cards = random7Cards();
    ai_001_cards = random7Cards();
    ai_002_cards = random7Cards();
    ai_003_cards = random7Cards();

    cl_dsp.innerHTML = cl_dsp_head + "current_card: " + current_card + "<br/><br/>";
    cardDSP(player_cards);
    cl_dsp.innerHTML += "<br/><br/>[ex] exit";
    state = "play";
}

function UNO(){
    if(cl_in.value == "cls"){
        cl_dsp.innerHTML = cl_dsp_head + "current_card: " + current_card + "<br/><br/>";
        cardDSP(player_cards);
        cl_dsp.innerHTML += "<br/><br/>[ex] exit";
    }
    else if(cl_in.value == "ex"){
        cl_dsp.innerHTML = cl_dsp_head + cl_dsp_menu;
        state = "menu";
    }
    else{
        cl_dsp.innerHTML += "<br/>command not found.";
    }
}