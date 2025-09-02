async function getAnimeByName(searchString, showOrMovie){
    let url = `https://api.jikan.moe/v4/anime?q=${searchString}`;
    try {
        const response = await fetch(url);
        const result = await response.json();

        let lowestPopularity = result.data[0].popularity;
        let correctAnimeID = null;
        for (let i = 0; i < 5; i++){
            let currentAnime = result.data[i];
            if (currentAnime.type == showOrMovie){
                if (currentAnime.popularity <= lowestPopularity) {
                    lowestPopularity = currentAnime.popularity;
                    correctAnimeID = i;
                }
            }
        };
        if (correctAnimeID != null)
            return result.data[correctAnimeID];
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

    let showOrMovie = document.getElementById("showOrMovie").value;
    let searchString = document.getElementById("animeInput").value;

    let anime = await getAnimeByName(searchString, showOrMovie);

    console.log(anime);

    if (anime != null){
        const animeCard = document.createElement("div");
        animeCard.className = "card";

        const animeImage = document.createElement("img");
        animeImage.src = anime.images.jpg.large_image_url;
        animeCard.appendChild(animeImage);

        const animeInformation = document.createElement("div");
        animeInformation.className = "animeInformation";

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
        const animeContainer = document.getElementById("animeContainer");
        animeContainer.appendChild(animeCard);
    }
}

async function displayCharacters(characterId) {
    document.getElementById("characterContainer").innerHTML = "";

    const characterHeader = document.createElement("h2");
    characterHeader.id = "mainCharactersHeader";
    characterHeader.textContent = "Main Characters";
    document.getElementById("characterContainer").appendChild(characterHeader);

    let characters = await getCharacters(characterId);

    console.log(characters);

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

        characterCard.appendChild(characterInformation)
        document.getElementById("characterContainer").appendChild(characterCard);
    });
}