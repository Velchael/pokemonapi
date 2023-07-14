

  const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;
  const generatePokemonPromises = () => Array(150).fill().map((_, index) =>
    (fetch(getPokemonUrl(index + 1)).then(response => response.json()))
  );
  
  const generateHTML = pokemons => {
    return pokemons.reduce((accumulator, { name, id, types }) => {
      const elementTypes = types.map(typeInfo => typeInfo.type.name);
  
      accumulator += `
        <li class="card ${elementTypes[0]}">
          <img class="card-image" alt="${name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"></img>
          <h2 class="card-title">${id}. ${name}</h2>
          <p class="card-subtitle">${elementTypes.join(" | ")}</p>
        </li>
      `;
      return accumulator;
    }, "");
  };
  
  const insertPokemonsIntoPage = pokemons => {
    const ul = document.querySelector('[data-js="pokedex"]');
    ul.innerHTML = pokemons;
  };
  
  const pokemonPromises = generatePokemonPromises();
  
  const generatePage = (pokemons, page) => {
    const start = (page - 1) * 9;
    const end = start + 9;
    const pokemonsPage = pokemons.slice(start, end);
    const pokemonsHTML = generateHTML(pokemonsPage);
    insertPokemonsIntoPage(pokemonsHTML);
  };
  
  const paginationButtons = document.querySelector('[data-js="pagination"]');
  let currentPage = 1;
  
  Promise.all(pokemonPromises)
    .then(pokemons => {
      generatePage(pokemons, currentPage);
  
      const totalPages = Math.ceil(pokemons.length / 9);
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerHTML = i;
        button.addEventListener('click', () => {
          currentPage = i;
          generatePage(pokemons, currentPage);
        });
        paginationButtons.appendChild(button);
      }
    });
  


