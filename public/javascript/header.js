var repo = {};
const defultPath = "./projects/";
const archives = ["mousetester"];
getRepositories(0);

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


function updateHeader() {
    const imagePath = defultPath + archives[repo.index];
    const titleElement = document.querySelector(".description h1 span");
    const textElement = document.querySelector(".description textarea");
    const mainImage = document.querySelector(".image img");
    const iframeImages = document.querySelector(".image iframe");

    const getRepo = document.querySelector(".description #btn-repo");
    const getSite = document.querySelector(".description #btn-site");


    titleElement.innerHTML = repo.name;
    textElement.innerHTML = repo.text;
    mainImage.setAttribute("src", imagePath + repo.images[0]);
    resolveIframe();
    resolveLinks();


    function resolveIframe(){
        iframeImages.onload = () => {
            for(var i = 0; i < repo.images.length; i++){
                var divPhoto = iframeImages.contentWindow.document.createElement("div");
                var photo = iframeImages.contentWindow.document.createElement("img");
        
                photo.setAttribute("src", imagePath + repo.images[i]);
                divPhoto.setAttribute("class", "photo");
                divPhoto.setAttribute("onclick", "parent.changePicture('"+ imagePath + repo.images[i] +"')");
                divPhoto.appendChild(photo);
                iframeImages.contentWindow.document.body.querySelector("div.container").appendChild(divPhoto);
            }}
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
    const mainImage = document.querySelector(".image img");
    mainImage.setAttribute("src", picPath);
}

function setRepo() {
    /* Depois otimiza */
    updateHeader();
    console.log(repo);
}
