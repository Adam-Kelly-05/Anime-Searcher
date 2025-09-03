async function getAnimeByName(searchString, showOrMovie){
    let url = `https://api.jikan.moe/v4/anime?q=${searchString}`;
    try {
        const response = await fetch(url);
        const result = await response.json();

        let lowestPopularity = 99**9;
        let correctAnimeID = null;
        for (let i = 0; i < 5; i++){
            if (result.data[i] != null){
                let currentAnime = result.data[i];
                if (currentAnime.type == showOrMovie){
                    if (currentAnime.popularity <= lowestPopularity) {
                        lowestPopularity = currentAnime.popularity;
                        correctAnimeID = i;
                    }
                }
            }
        }

        if (correctAnimeID != null)
            return result.data[correctAnimeID];
        return correctAnimeID;
    } catch (error) {
        console.error(error);
    }
}

async function getCharacters(id){
    let url = `https://api.jikan.moe/v4/anime/${id}/characters`;
    try {
        const response = await fetch(url);
        const result = await response.json();

        let characters = [];
        for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].role == "Main") {
                characters.push(result.data[i]);
            }
            else {
                break;
            }
        }

        return characters;
    } catch (error) {
        console.error(error);
    }
}

async function displayAnime(){
    document.getElementById("animeContainer").innerHTML = "";
    document.getElementById("characterContainer").innerHTML = "";

    const animeContainer = document.getElementById("animeContainer");

    const animeHeader = document.createElement("h2");
    animeHeader.className = "header";
    animeHeader.textContent = "Anime";
    animeContainer.appendChild(animeHeader);

    let searchString = document.getElementById("animeInput").value;
    let showOrMovie = document.getElementById("showOrMovie").value;

    let anime = await getAnimeByName(searchString, showOrMovie);

    if (anime != null){
        const animeCard = document.createElement("div");
        animeCard.className = "card";

        const animeImage = document.createElement("img");
        animeImage.src = anime.images.jpg.large_image_url;
        animeCard.appendChild(animeImage);

        const animeInformation = document.createElement("div");

        const animeTitle = document.createElement("h3");
        animeTitle.textContent = anime.titles[0].title;
        animeInformation.appendChild(animeTitle);

        const animeLength = document.createElement("p");
        if (showOrMovie == "TV") 
            animeLength.textContent = `Episodes: ${anime.episodes}`;
        else if (showOrMovie == "Movie") 
            animeLength.textContent = `Duration: ${anime.duration}`;
        animeInformation.appendChild(animeLength);

        const animeSynopsis = document.createElement("p");
        animeSynopsis.textContent = anime.synopsis;
        animeInformation.appendChild(animeSynopsis);

        const characterButton = document.createElement("button");
        characterButton.textContent = "See Characters";
        characterButton.addEventListener("click", () => displayCharacters(anime.mal_id));
        animeInformation.appendChild(characterButton);

        animeCard.appendChild(animeInformation);
        animeContainer.className = "container";
        animeContainer.appendChild(animeCard);
    }
    else {
        const noResults = document.createElement("p");
        noResults.textContent = "No results found.";
        animeContainer.appendChild(noResults);
    }
}

async function displayCharacters(characterId) {
    document.getElementById("characterContainer").innerHTML = "";

    const characterContainer = document.getElementById("characterContainer");

    const characterHeader = document.createElement("h2");
    characterHeader.className = "header";
    characterHeader.textContent = "Main Characters";
    characterContainer.appendChild(characterHeader);

    let characters = await getCharacters(characterId);

    characters.forEach(character => {
        const characterCard = document.createElement("div");
        characterCard.className = "card";

        const characterImage = document.createElement("img");
        characterImage.src = character.character.images.jpg.image_url;
        characterCard.appendChild(characterImage);

        const characterInformation = document.createElement("div");

        const characterName = document.createElement("h3");
        characterName.textContent = character.character.name;
        characterInformation.appendChild(characterName);

        characterCard.appendChild(characterInformation);
        characterContainer.className = "container";
        characterContainer.appendChild(characterCard);
    });
}