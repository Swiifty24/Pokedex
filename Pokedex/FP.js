document.addEventListener("DOMContentLoaded", displayFeaturedPokemon);

async function displayFeaturedPokemon() {
    const featured = ["regigigas", "gengar", "alakazam", "machamp", "groudon", "kyogre"]; 
    const featuredContainer = document.getElementById("pokemonList");

    for (let name of featured) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
            const pokemon = await response.json();

            const card = document.createElement("div");
            card.classList.add("col-md-4", "mb-4");

            card.innerHTML = `
                <div class="card col-md-10 col-10 mb-10 shadow rounded">
                    <img src="${pokemon.sprites.front_default}" class="card-img-top p-3" alt="${pokemon.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title text-capitalize fw-bold">${pokemon.name}</h5>
                        <p class="card-text"><strong>Type:</strong> ${pokemon.types[0].type.name}</p>
                    </div>
                </div>
            `;

            featuredContainer.appendChild(card);
        } catch (error) {
            console.error(`Error fetching ${name}:`, error);
        }
    }
}

