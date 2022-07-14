const template = document.querySelector("template");

function addList(){
    const listWrapper = document.querySelectorAll(".list-wrapper");
    const list = template.content.cloneNode(true);
    const toggle = list.querySelector("#title-toggle");
    const more = list.querySelector(".more");
    const less = list.querySelector(".less");
    toggle.id = toggle.id + (listWrapper.length + 1);
    more.htmlFor = less.htmlFor = toggle.id;
    document.querySelector(".list-container").append(list);
}

addList();

function removeList(removeButton){
    removeButton.parentElement.remove();
}

function addTag(){
    if(!tags.value.match(/\|$/) && tags.value != ""){
        tags.value += "|";
    }
    tags.focus();
}

function removeTag(){
    tags.value = tags.value.replace(/((\|([^|]|)+$)|(^[^|]+$))/, "");
    tags.focus();
}

function copyResult(){
    navigator.clipboard.writeText(result.value);
    result.blur();
}

function list(listWrapper){
    let list = "";
    listWrapper.forEach((item, i) => {
        const title = item.querySelector(".title");
        const AniListTitle = item.querySelector(".AniListTitle");
        const MyAnimeListTitle = item.querySelector(".MyAnimeListTitle");
        const AniList = item.querySelector(".AniList");
        const MyAnimeList = item.querySelector(".MyAnimeList");
        const YouTube = item.querySelector(".YouTube");
        list +=
`{
                "title": "${title.value}"${AniListTitle.value != "" ? `,
                "AniListTitle": "${AniListTitle.value}"` : ""}${MyAnimeListTitle.value != "" ? `,
                "MyAnimeListTitle": "${MyAnimeListTitle.value}"` : ""}${AniList.value != "" ? `,
                "AniList": "${AniList.value}"` : ""}${MyAnimeList.value != "" ? `,
                "MyAnimeList": "${MyAnimeList.value}"` : ""}${YouTube.value != "" ? `,
                "YouTube": "${YouTube.value}"` : ""}
            }`;
        if(i < listWrapper.length - 1){
            list +=
`,
            `;
        }
    });

    return list;
}

const result = document.querySelector(".result");
const name = document.querySelector(".name");
const tags = document.querySelector(".tags");

function updateResult(){
    const listWrapper = document.querySelectorAll(".list-wrapper");
    result.value = "";
    result.value +=
`
    {
        "name": "${name.value}"${tags.value != "" ? `,
        "tags": ${JSON.stringify(tags.value.split("|"))}` : ""},
        "list": [
            ${list(listWrapper)}
        ]
    },`;
}

updateResult();