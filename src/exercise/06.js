// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

const STATUSES = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

const Rejected = ({message}) => (
  <div role="alert">
    There was an error: <pre style={{whiteSpace: 'normal'}}>{message}</pre>
  </div>
)

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState(STATUSES.idle)

  React.useEffect(() => {
    if (pokemonName) {
      setPokemon(null)
      setError(null)
      setStatus(STATUSES.pending)
      fetchPokemon(pokemonName)
        .then(result => {
          setPokemon(result)
          setStatus(STATUSES.resolved)
        })
        .catch(err => {
          setError(err)
          setStatus(STATUSES.rejected)
        })
    }
  }, [pokemonName, setPokemon])

  switch (status) {
    case STATUSES.idle:
      return 'Submit a pokemon'
    case STATUSES.pending:
      return <PokemonInfoFallback name={pokemonName} />
    case STATUSES.resolved:
      return <PokemonDataView pokemon={pokemon} />
    case STATUSES.rejected:
      return <Rejected message={error.message} />
    default:
      return 'Invalid status'
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
