const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const mainCard = document.querySelector('main')


const pokemonFetch = () => {
fetch(TRAINERS_URL)
.then(response => response.json())
.then(trainers => renderTrainers(trainers))
}

const renderTrainers = (trainers) => {
    trainers.forEach(trainer => {
        renderTrainer(trainer)
    })
}

const renderTrainer = (trainer) => {
    const cardDiv = document.createElement('div')
    cardDiv.className = "card"
    cardDiv.dataset.id = trainer.id

    cardDiv.innerHTML = `
    <p>${trainer.name}</p>
  <button class="add-pokemon" data-trainer-id=${trainer.id}>Add Pokemon</button>  
    `
    const pokemonUl = document.createElement('ul')

    trainer.pokemons.forEach(pokemon => {
        const pokemonLi = document.createElement('li')
        pokemonLi.innerHTML = `
        ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button>
        `
        pokemonUl.append(pokemonLi)
    })

    cardDiv.append(pokemonUl)
    mainCard.append(cardDiv)
}

mainCard.addEventListener('click', event => {
    if(event.target.matches('.add-pokemon')){
        const pokemonCard = event.target.parentNode 
        const pokemonUl = pokemonCard.querySelector('ul')
        const pokemonCount = pokemonUl.childElementCount
       
        if(pokemonCount < 6){
            const post = {
                method: "POST", 
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({'trainer_id':`${pokemonCard.dataset.id}`})
            }

            fetch(POKEMONS_URL, post)
            .then(response => response.json())
            .then(newPokemon => {
                const pokemonCard = document.querySelector(`[data-id="${newPokemon.trainer_id}"]`)
                
                const pokemonUl = pokemonCard.querySelector('ul')
                const pokemonLi = document.createElement('li')
                console.log(pokemonUl)
                pokemonLi.innerHTML = `
                ${newPokemon.nickname} (${newPokemon.species}) <button class="release" data-pokemon-id=${newPokemon.id}>Release</button>
                `
                pokemonUl.append(pokemonLi)
            }) 
        }else {
            alert("No more Pokemon for you!🤪")
        }

    }else if (event.target.matches('.release')){
        const button = event.target
        const pokemonId = button.dataset.pokemonId
       
        const deleteFetch = {
            method: "DELETE"
        }

        fetch(`${POKEMONS_URL}/${pokemonId}`, deleteFetch)
        .then(response => response.json())
        .then(removePokemon => {
            const pokeButton = button.parentNode
            pokeButton.remove()
        })
    }
})



pokemonFetch()