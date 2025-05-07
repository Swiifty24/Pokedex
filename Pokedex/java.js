async function fetchData() {
    try {
        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if (!response.ok) {
            throw new Error("This Pokémon is not available.");
        }

        const data = await response.json();
        const pokemonSprite = data.sprites.front_default;

        const imgElement = document.getElementById("pokemonSprite");
        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";

        const pokemonListElement = document.getElementById("pokemonList");
        pokemonListElement.innerHTML = "";

        const card = document.createElement("div");
        card.classList.add("col-md-4", "col-sm-6", "col-12", "mb-4", "d-flex", "justify-content-center");

        card.innerHTML = `
            <div class="card h-100 text-center" data-pokemon-id="${data.id}">
                <img src="${pokemonSprite}" class="card-img-top" alt="${data.name}">
                <div class="card-body">
                    <h5 class="card-title text-capitalize">${data.name}</h5>
                    <p class="card-text"><strong>Type:</strong> ${data.types.map(type => type.type.name).join(', ')}</p>
                </div>
            </div>
        `;

        pokemonListElement.appendChild(card);

        card.addEventListener("click", () => openPokemonModal(data));

    } catch (error) {
        alert("This Pokémon is not available.");
        console.error(error);
    }
}

let currentPage = 1;
const limit = 12; 

document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonPage(currentPage);
    
    document.getElementById("prevButton").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchPokemonPage(currentPage);
        }
    });

    document.getElementById("nextButton").addEventListener("click", () => {
        currentPage++;
        fetchPokemonPage(currentPage);
    });
});

async function fetchPokemonPage(page) {
    try {
        const offset = (page - 1) * limit; 
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        const pokemonResults = data.results;

        const pokemonListElement = document.getElementById("pokemonList");
        pokemonListElement.innerHTML = ""; 

        for (let pokemon of pokemonResults) {
            const pokemonData = await fetch(pokemon.url);
            const pokemonDetails = await pokemonData.json();

            const card = document.createElement("div");
            card.classList.add("col-md-3", "mb-4");

            card.innerHTML = `
                <div class="card h-100">
                    <img src="${pokemonDetails.sprites.front_default}" class="card-img-top" alt="${pokemonDetails.name}">
                    <div class="card-body">
                        <h5 class="card-title text-capitalize">${pokemonDetails.name}</h5>
                        <p class="card-text">
                            <strong>Type:</strong> ${pokemonDetails.types[0].type.name}
                        </p>
                    </div>
                </div>
            `;

            card.addEventListener("click", () => openPokemonModal(pokemonDetails));

            pokemonListElement.appendChild(card);
        }

        document.getElementById("prevButton").disabled = (currentPage === 1);

    } catch (error) {
        console.error(error);
    }
}

function openPokemonModal(pokemon) {
   
    document.getElementById("modalPokemonName").textContent = pokemon.name;
    document.getElementById("modalPokemonType").textContent = pokemon.types.map(type => type.type.name).join(', ');
    document.getElementById("modalPokemonHeight").textContent = (pokemon.height / 10) + " m"; // Convert to meters
    document.getElementById("modalPokemonWeight").textContent = (pokemon.weight / 10) + " kg"; // Convert to kilograms
    document.getElementById("modalPokemonSprite").src = pokemon.sprites.front_default;

    const modal = new bootstrap.Modal(document.getElementById("pokemonModal"));
    modal.show();
}
