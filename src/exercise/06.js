// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  state = {error: null}

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {error}
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return  <Rejected message={this.state.error}>
    }

    return this.props.children
  }
}

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

const updateState = nextState => prevState => ({...prevState, ...nextState})

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: STATUSES.idle,
    error: null,
    pokemon: null,
  })

  React.useEffect(() => {
    if (pokemonName) {
      setState(updateState({status: STATUSES.pending}))
      fetchPokemon(pokemonName)
        .then(pokemon => {
          setState(updateState({status: STATUSES.resolved, pokemon}))
        })
        .catch(error => {
          setState(updateState({status: STATUSES.rejected, error}))
        })
    }
  }, [pokemonName, setState])

  switch (state.status) {
    case STATUSES.idle:
      return 'Submit a pokemon'
    case STATUSES.pending:
      return <PokemonInfoFallback name={pokemonName} />
    case STATUSES.resolved:
      return <PokemonDataView pokemon={state.pokemon} />
    case STATUSES.rejected:
      throw state.error
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
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
