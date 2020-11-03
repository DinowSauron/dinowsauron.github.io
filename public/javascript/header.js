var repo = {};
var updatedItems = false;
const defultPath = "./projects/";

getRepositories(archives.length - 1);
/* faça a seleção dos itens dos itens de escolha, sla*/

function setRepo() {
    /* Depois otimiza */
    updateHeader();
    // console.log(repo);
    if(!updatedItems)
        updateItems();
}


/* name, text, linkRep, linkSite, videos, images, tags, index */
function getRepositories(index) {
    loadJSON(
        defultPath + archives[index] + "/config.json",
        (data) => {
            repo = data;
            repo.index = index;
            setRepo();
        },
        (e) => {
            console.log("Erro ao obter os repositorios: ") + e;
        }
    );
}

function updateItems(){
    const itemContainer = document.querySelector(".items");
    for(var i = archives.length - 1;i >= 0;i--){
        createItem(archives[i], i);
    }
    updatedItems = true;

    function createItem(archive, index){
        // console.log(archive)
        const boxElement = document.createElement("div");
        const textElement = document.createElement("h3");
        const imageElement = document.createElement("img");
        const listElement = document.createElement("ul");
        loadJSON(defultPath + archive + "/config.json", (data) => {
            const imagePath = defultPath + archive;
            listElement.setAttribute("class", "tags");
            data.tags.forEach((tag) => {
                const tagElement = document.createElement("li");
                tagElement.setAttribute("class", "tag");
                tagElement.innerHTML = tag;
                listElement.appendChild(tagElement);
            });
            textElement.innerHTML = data.name;
            imageElement.setAttribute("src", imagePath + data.images[0]);
            boxElement.setAttribute("class", "itemBox");
            boxElement.setAttribute("onclick", "getRepositories("+ index + ")")
            boxElement.appendChild(textElement);
            boxElement.appendChild(imageElement);
            boxElement.appendChild(listElement);
            itemContainer.appendChild(boxElement);
        });
    }
}

function updateHeader() {
    const imagePath = defultPath + archives[repo.index];
    const titleElement = document.querySelector(".description h1 span");
    const textElement = document.querySelector(".description .textarea");
    const mainImage = document.querySelector(".image img");
    const iframeImages = document.querySelector(".image iframe");

    const getRepo = document.querySelector(".description #btn-repo");
    const getSite = document.querySelector(".description #btn-site");


    titleElement.innerHTML = repo.name;
    textElement.innerHTML = repo.text + "<br>".repeat(4);
    mainImage.setAttribute("src", imagePath + repo.images[0]);
    resolveIframe();
    resolveLinks();

    blockGrab();


    function resolveIframe(){
        try{
            createIframe();
        }catch{
            iframeImages.onload = createIframe;
        }
        function createIframe(){
            const iframeContent = iframeImages.contentWindow.document.body.querySelector(".container");
            iframeContent.innerHTML = "";

            repo.images.forEach((img, index) => {
                var divPhoto = iframeImages.contentWindow.document.createElement("div");
                var photo = iframeImages.contentWindow.document.createElement("img");
                
                
                photo.setAttribute("src", imagePath + img);
                divPhoto.setAttribute("class", index == 0 ? "photo active" : "photo");
                divPhoto.setAttribute("onclick", "parent.changePicture('"+ imagePath + img +"')");
                divPhoto.appendChild(photo);
                iframeImages.contentWindow.document.body.querySelector("div.container").appendChild(divPhoto);    
            });
        }
    }

    function resolveLinks(){
        getRepo.setAttribute("href", repo.linkRep);
        getSite.setAttribute("href", repo.linkSite);
        if(repo.linkSite == "#"){
            getSite.setAttribute("class", "active");
            getSite.setAttribute("target", "");
        }else{
            getSite.setAttribute("class", "");
            getSite.setAttribute("target", "_blank");
        }
    }
}

function changePicture(picPath){
    setImage();
    setActivePicture();


    function setActivePicture(){
        const iframeImages = document.querySelector(".image iframe");
        const images = iframeImages.contentWindow.document.body.querySelectorAll(".container div.photo");
        images.forEach(img => {
            img.setAttribute("class", "photo");
            if(img.querySelector("img").getAttribute("src") == picPath){
                img.classList.toggle("active");
            }
        });
    }
    
    function setImage(){
        const mainImage = document.querySelector(".image img");
        mainImage.setAttribute("src", picPath);
    }
}

function filterItem(filter, useName = false){
    const boxTags = document.querySelectorAll(".itemBox");
    filter = filter.toLowerCase();
    setFilterSelected();

    if(filter == "all"){
        boxTags.forEach(boxTag => {filterThis(boxTag)});
        return;
    }
    if(!useName){
        boxTags.forEach((boxTag) => {
            boxTag.setAttribute("style", "width: 0; height: 0; position: absolute; left: 5px; border: none; opacity: 0;");
            boxTag.querySelectorAll("ul li").forEach((tag) => {
                if(filter == tag.innerHTML.toLowerCase()){
                    filterThis(boxTag);
                    return;
                }
            })
        });

    }

    function filterThis(element){
        element.setAttribute("style", "");
    }

    function setFilterSelected(){
        const optionElements = document.querySelectorAll(".selection li.list");
        optionElements.forEach(option => {
            option.setAttribute("class", "list");
            if(option.innerHTML.toLocaleLowerCase() == filter)
                option.setAttribute("class", "list active");
        });
    }
}

