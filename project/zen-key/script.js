const typingData = [
    {
        "text": "{明日[あした]}{古[ふる]}びたコトバ{繰[く]}り{返[かえ]}しつぶやいてみる\n{伸[の]}ばしたままの{爪[つめ]}{痕[あと]}はほら{消[き]}えないよ",
        "source": "{花[はな]}{残[のこ]}り{月[つき]} by nano.RIPE"
    },
    {
        "text": "にゃにゃめにゃにゃじゅうにゃにゃどのにゃらびでにゃくにゃくいにゃにゃくにゃにゃはんにゃにゃだいにゃんにゃくにゃらべてにゃがにゃがめ",
        "source": "{化[ばけ]}{物[もの]}{語[がたり]}"
    },
    {
        "text": "{斜[なな]}め{七[なな]}{十[じゅう]}{七[なな]}{度[ど]}の{並[なら]}びで{泣[な]}く{泣[な]}く{嘶[いなな]}くナナハン{七[なな]}{台[だい]}{難[なん]}なく{並[なら]}べて{長[なが]}{眺[なが]}め",
        "source": "{早[はや]}{口[くち]}{言[こと]}{葉[ば]}"
    }
];

// TO DO: make stats progress works, then detect if progress is 100% and make the complete typing works

const typingTarget = document.querySelector(".typing-target");
const flexContainer = document.querySelector(".flex-container");
const typingInput = document.querySelector("textarea");

function convertText(text){
    charArray = text.split("");

    let id = 0;
    let type = "kana base";

    let newSpan = document.createElement("span");
    let newRT = document.createElement("rt");
    let newRuby = document.createElement("ruby");
    let newText = document.createElement("p");

    charArray.forEach(char => {
        newRuby.className = "typing-target-ruby";
        newRuby.id = id;
        switch(char){
            case "{":
                type = "kanji base";
                break;
            case "[":
                const newRP1 = document.createElement("rp");
                newRP1.innerHTML = "(";
                newRuby.appendChild(newRP1);

                type = "kana furigana";
                break;
            case "]":
                newRuby.appendChild(newRT);
                newRT = document.createElement("rt");

                const newRP2 = document.createElement("rp");
                newRP2.innerHTML = ")";
                newRuby.appendChild(newRP2);
                break;
            case "}":
                newText.appendChild(newRuby);
                newRuby = document.createElement("ruby");

                type = "kana base";
                break;
            case "\n":
                newSpan.innerHTML = "<i class='material-icons'>keyboard_return</i>";
                newSpan.className = type;
                newRuby.appendChild(newSpan);
                newSpan = document.createElement("span");
                newText.appendChild(newRuby);
                newRuby = document.createElement("ruby");
                newSpan = document.createElement("span");
                newText.appendChild(document.createElement("br"));
                break;
            default:
                newSpan.innerHTML = char;
                newSpan.className = type;
                switch(type){
                    case "kanji base":
                        newRuby.appendChild(newSpan);
                        newSpan = document.createElement("span");
                        break;
                    case "kana furigana":
                        newRT.appendChild(newSpan);
                        newSpan = document.createElement("span");
                        break;
                    default:
                        if(char === " " || char === "　") newRuby.classList.add("space");
                        newRuby.appendChild(newSpan);
                        newSpan = document.createElement("span");
                        newText.appendChild(newRuby);
                        newRuby = document.createElement("ruby");
                        break;
                }
                break;
        }
        
        if(type === "kana base"){
            id++;
        }
    });

    newText.appendChild(newRuby);

    return newText;
}

let stats = {
    "CPM": 0,
    "SPM": 0,
    "correctKanji": 0,
    "totalKanji": 0,
    "correctKana": 0,
    "totalKana": 0,
    "correctFurigana": 0,
    "totalFurigana": 0,
    "progress": 0,
    "totalText": 0
};

const statsReset = {
    ...stats
};

function setStats(){
    stats = statsReset;

    stats.totalKanji = typingTarget.querySelectorAll(".kanji").length;
    stats.totalKana = typingTarget.querySelectorAll(".kana.base").length;
    stats.totalFurigana = typingTarget.querySelectorAll(".furigana").length;
    stats.totalText = typingTarget.querySelectorAll(".base").length;
}

function updateStats(){
    stats.correctKanji = typingTarget.querySelectorAll(".correct .kanji").length;
    stats.correctKana = typingTarget.querySelectorAll(".correct .kana.base").length;
    stats.correctFurigana = typingTarget.querySelectorAll(".correct .furigana, .furigana.correct").length;
    stats.progress = typingTarget.querySelectorAll("typing-target-ruby.correct").length;

    const kanjiMultiplier = 0.25 * (stats.correctKanji / stats.totalKanji);
    const furiganaMultiplier = 0.25 * (stats.correctFurigana / stats.totalFurigana);
    const kanaMultiplier = 0.5 * (stats.correctKana / stats.totalKana);
    const totalPercentage = (kanjiMultiplier + furiganaMultiplier + kanaMultiplier) * 100;
    const totalPercentageRound = Math.round((totalPercentage + Number.EPSILON) * 100) / 100;
    console.log(totalPercentageRound + "%");
}

/*
SCORE NOTE

Percentage:
- correct kanji = 0.25 * (correct kanji / total kanji)
- correct furigana = 0.25 * (correct furigana / total furigana)
- correct kana = 0. * (correct kana / total furigana)
- total = (correct kanji + correct furigana + correct kana) * 100%
*/

let previousRandom = -1;

function getRandomText(){
    let randomIndex = Math.floor(Math.random() * typingData.length);
    while(randomIndex == previousRandom){
        randomIndex = Math.floor(Math.random() * typingData.length);
    }
    previousRandom = randomIndex;
    typingTarget.innerHTML = convertText(typingData[randomIndex].text).innerHTML;
    
    setStats();
}

getRandomText();

function setCaret(arrayElement, index){
    if(arrayElement[index+1]){
        arrayElement[index+1].classList.add("caret");
        arrayElement[index].classList.remove("caret");
    }
    else{
        arrayElement[index].classList.add("caret-right");
    }
}

function removeCaret(arrayElement, index){
    if(arrayElement[index+1]){
        arrayElement[index+1].classList.remove("caret");
    }
    else{
        arrayElement[index].classList.remove("caret-right");
    }
}

/*function setKanjiCaret(element){
    if(element.className.includes("furigana") && element.className.includes("caret") && element.matches(":first-child")){
        element.classList.remove("caret");
        element.parentElement.parentElement.querySelector(".kanji").classList.add("caret");
    }
    else if(element.className.includes("furigana") && element.matches(":first-child")){
        element.parentElement.parentElement.querySelector(".kanji").classList.remove("caret");
    }
}*/

function scrollNextIntoView(arrayElement, index){
    if(arrayElement[index+1]){
        arrayElement[index+1].scrollIntoView({ block: "center" });
    }
    else{
        arrayElement[index].scrollIntoView({ block: "center" });
    }
}

let startTime = null;

function update(input, e){
    if(startTime == null && e.inputType != null){
        startTyping();
    }


    const arrayRuby = typingTarget.querySelectorAll(".typing-target-ruby");
    let checkInput = input.replace("\n", "⏎");

    if(input == ""){
        flexContainer.scrollTo(0, 0);
        arrayRuby[0].classList.add("caret");
    }

    arrayRuby.forEach((ruby, i) => {
        const arrayBase = ruby.querySelectorAll(".base");
        const arrayFurigana = ruby.querySelectorAll(".furigana");

        let currentRubyCheckInput = checkInput;

        let kanaCorrect = kanaIncorrect = 0;
        let arrayChar = arrayFurigana;

        if(arrayChar.length == 0) arrayChar = arrayBase;

        arrayChar.forEach((char, j) => {
            if(currentRubyCheckInput[0] == null){
                char.classList.remove("correct");
                char.classList.remove("incorrect");
                ruby.classList.remove("correct");
                ruby.classList.remove("semi-correct");
                ruby.classList.remove("incorrect");
                if(arrayBase[j]){
                    arrayBase[j].classList.remove("correct");
                    arrayBase[j].classList.remove("incorrect");
                }
            }
            else if(currentRubyCheckInput[0] === char.innerText.replace("keyboard_return", "⏎") && !(ruby.classList.contains("correct") && arrayFurigana.length > 0)){
                if(arrayFurigana.length > 0){
                    char.classList.add("correct");
                    char.classList.remove("incorrect");

                    setCaret(arrayFurigana, j);
                }
                else{
                    ruby.classList.add("correct");
                    ruby.classList.remove("incorrect");
                }
                kanaCorrect++;
            }
            else{
                if(arrayFurigana.length > 0){
                    char.classList.remove("correct");
                    char.classList.add("incorrect");

                    setCaret(arrayFurigana, j);
                }
                else{
                    ruby.classList.remove("correct");
                    ruby.classList.add("incorrect");
                }
                kanaIncorrect++;
            }

            currentRubyCheckInput = currentRubyCheckInput.slice(1);
        });

        let kanjiCorrect = kanjiIncorrect = 0;

        if(kanaCorrect == 0 && kanaIncorrect > 0 && arrayFurigana.length > 0){
            currentRubyCheckInput = checkInput;

            arrayBase.forEach(char => {
                if(currentRubyCheckInput[0] === char.innerText){
                    char.classList.add("correct");
                    char.classList.remove("incorrect");
                    kanjiCorrect++;
                }
                else{
                    char.classList.remove("correct");
                    char.classList.add("incorrect");
                    kanjiIncorrect++;
                }

                currentRubyCheckInput = currentRubyCheckInput.slice(1);
            });
        }
        else if(kanaCorrect > 0 && kanaIncorrect == 0 && arrayFurigana.length > 0){
            arrayBase.forEach(char => {
                char.classList.remove("incorrect");
            });
        }

        if(kanjiIncorrect > 0){
            let incorrectDiff = kanaIncorrect - kanjiIncorrect;
            currentRubyCheckInput = currentRubyCheckInput.slice(incorrectDiff);
        }

        checkInput = currentRubyCheckInput;

        if(arrayFurigana.length > 0 && kanaCorrect == arrayChar.length){
            ruby.classList.add("semi-correct");
            ruby.classList.remove("incorrect");
        }
        else if(arrayFurigana.length > 0 && kanaIncorrect > 0){
            ruby.classList.add("incorrect");
        }

        if(arrayFurigana.length > 0 && kanjiCorrect == arrayBase.length){
            ruby.classList.add("correct");
            ruby.classList.remove("semi-correct");
            ruby.classList.remove("incorrect");
        }

        if(ruby.classList.contains("correct") || ((ruby.classList.contains("semi-correct") || ruby.classList.contains("incorrect")) && arrayFurigana.length == 0)){
            setCaret(arrayRuby, i);
        }
        else if(kanaCorrect + kanaIncorrect > 0 && arrayFurigana.length > 0){
            ruby.classList.remove("caret");
        }
        else{
            removeCaret(arrayRuby, i);
        }

        let allCaret = typingTarget.querySelectorAll(".caret, .caret-right");

        if(allCaret.length > 1){
            allCaret.forEach(caret => {
                allCaret = typingTarget.querySelectorAll(".caret, .caret-right");
                if(caret.classList.contains("furigana") && allCaret.length > 1){
                    caret.classList.remove("caret");
                    caret.classList.remove("caret-right");
                }
            });
        }
        
        if(ruby.classList.contains("correct") || ruby.classList.contains("semi-correct") || ruby.classList.contains("incorrect")) scrollNextIntoView(arrayRuby, i);
    });

    updateStats();

    computeCPM(input);

    if(e.inputType === "insertLineBreak"){
        typingComplete();
    }
    console.table(stats);
}

update("", {"inputType": null});

function startTyping(){
    startTime = new Date();
    console.log("start");
}

function countSmallKana(str){
    const smallKanaRegex = /[ぁぃぅぇぉゃゅょっァィゥェォャュョッ]/g;
    const matches = str.match(smallKanaRegex);
    return matches ? matches.length : 0;
}

function computeCPM(input){
    const kanaCount = input.length;
    const smallKanaCount = countSmallKana(input);
    const elapsedTime = new Date() - startTime;
    const CPM = Math.round((((kanaCount / elapsedTime) * 60000) + Number.EPSILON) * 100) / 100;
    const SPM = Math.round(((((kanaCount - smallKanaCount) / elapsedTime) * 60000) + Number.EPSILON) * 100) / 100;

    if(CPM != 0){
        stats.CPM = CPM;
        stats.SPM = SPM;
    }

    //console.log("CPM: " + stats.CPM + ", SPM: " + stats.SPM);
}

let enterToConfirm = false;

function typingComplete(){
    const incorrectCount = typingTarget.querySelectorAll(".kana.incorrect").length;
    const progressCount = typingTarget.querySelectorAll(".kana.correct, .kana.incorrect").length;
    const kanaCount = typingTarget.querySelectorAll(".kana").length;

    if(progressCount == kanaCount && (incorrectCount == 0 || enterToConfirm)){
        countCorrectKanji();
        //console.log(stats);
        getRandomText();
        typingInput.value = "";
        update("", {"inputType": null});
        startTime = null;
        enterToConfirm = false;
    }
    else if(progressCount == kanaCount){
        enterToConfirm = true;
    }
}

typingInput.addEventListener("keydown", function(e) {
    this.setSelectionRange(this.value.length, this.value.length);
    this.scrollTo(0, this.scrollHeight);
    if((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "v")){
        e.preventDefault();
    }
});

typingInput.addEventListener("keyup", function(e) {
    if(e.code === "Enter"){
        //typingComplete();
    }
});