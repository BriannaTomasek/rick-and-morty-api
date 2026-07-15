document.querySelector("#searchBtn").addEventListener("click", searchCharacter);

document.querySelector("#randomBtn").addEventListener("click", randomCharacter);

document.querySelector("#characterName").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchCharacter();
    }
});


function searchCharacter() {
    const name = document.querySelector("#characterName").value.trim();

    document.querySelector("#error").textContent = "";
    document.querySelector("#result").innerHTML = "";

    if (name === "") {
        document.querySelector("#error").textContent =
            "Please enter a character name.";
        return;
    }

    document.querySelector("#result").textContent = "Opening a portal...";

    fetch("https://rickandmortyapi.com/api/character/?name=" +
        encodeURIComponent(name))
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Character not found");
            }

            return response.json();
        })
        .then(function(data) {
            const character = data.results[0];
            displayCharacter(character);
        })
        .catch(function() {
            document.querySelector("#result").innerHTML = "";
            document.querySelector("#error").textContent =
                "Wubba Lubba Dub Dub! Character not found.";
        });
}


function randomCharacter() {
    const randomId = Math.floor(Math.random() * 826) + 1;

    document.querySelector("#characterName").value = "";
    document.querySelector("#error").textContent = "";
    document.querySelector("#result").textContent =
    "Traveling to another dimension...";

    fetch("https://rickandmortyapi.com/api/character/" + randomId)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Character could not be loaded");
            }

            return response.json();
        })
        .then(function(character) {
            displayCharacter(character);
        })
        .catch(function() {
            document.querySelector("#result").innerHTML = "";
            document.querySelector("#error").textContent =
                 "Wubba Lubba Dub Dub! Unable to load a random character.";
        });
}


function displayCharacter(character) {
    document.querySelector("#result").innerHTML = `
        <div class="character-card">
            <img src="${character.image}" alt="${character.name}">
            <h2>${character.name}</h2>
            <p><strong>Status:</strong> ${character.status}</p>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Origin:</strong> ${character.origin.name}</p>
        </div>
    `;
}