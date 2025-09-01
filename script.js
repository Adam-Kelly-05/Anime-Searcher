async function getAnimeByName(searchString, showOrMovie){
    let url = "https://api.jikan.moe/v4/anime?q=";
    try {
        const response = await fetch(url + searchString);
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

async function displayAnime(){
    document.getElementById("resultsContainer").innerHTML = "";

    let showOrMovie = document.getElementById("showOrMovie").value;
    let searchString = document.getElementById("animeInput").value;

    let anime = await getAnimeByName(searchString, showOrMovie);

    console.log(anime);

    if (anime != null){
        const animeCard = document.createElement("div");
        animeCard.className = "animeCard";

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

        animeCard.appendChild(animeInformation);
        const animeContainer = document.getElementById("resultsContainer");
        animeContainer.appendChild(animeCard);
    }
}