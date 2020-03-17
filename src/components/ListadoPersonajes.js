import React, { Component } from 'react';

class ListadoPersonajes extends Component {
	// Inicializando el Estado de un Componente
	constructor (props) {
		super(props);
		this.state = {
			titulo: 'Listado de Personajes',
			personajes: [],
			cargando: true,
			siguientesPersonajes: '', 
			cargandoMas: false,
		}
	}

	// Ciclo de vida
	componentDidMount () {
		console.log('Pasó por el componentDidMount()');
		
		fetch('https://swapi.co/api/people/?format=json')
			.then(response => response.json())
			.then(data => {
				// Setear el estado
				this.setState({
					personajes: data.results, 
					cargando: false,
					siguientesPersonajes: data.next
				})
			})
			.catch(error => console.log(error));
	}
	
	componentDidUpdate () {
		console.log('Pasó por el componentDidUpdate()');
	}

	// Event Handlers
	cargarMasPersonajes () {
		this.setState({ cargandoMas: true });

		let { siguientesPersonajes, personajes } = this.state;
		if (siguientesPersonajes != null) {
			fetch(siguientesPersonajes)
				.then(response => response.json())
				.then(data => {
					// Setear el estado
					this.setState({
						personajes: [...personajes, ...data.results],
						siguientesPersonajes: data.next,
						cargandoMas: false,
					})
				})
				.catch(error => console.log(error));
		}
	}


	// Render de componente
	render() {
		let { titulo, personajes, cargando, siguientesPersonajes, cargandoMas } = this.state;
		return (
			<React.Fragment>
				<h4>{titulo}</h4>
				{
					cargando && personajes.length === 0
					?
					<div className="spinner-border text-primary" role="status">
						<span className="sr-only">cargando...</span>
					</div>
					:
					<React.Fragment>
						<table className="table my-5">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Full Name</th>
								<th scope="col">Gender</th>
								<th scope="col">URL</th>
							</tr>
						</thead>
						<tbody>
							{
								personajes.map((unPersonaje, indice) => {
									return (
										<tr key={indice}>
											<th scope="row">{indice + 1}</th>
											<td>{unPersonaje.name}</td>
											<td>{unPersonaje.gender}</td>
											<td>
												<a href={unPersonaje.url} target="_blank" rel="noopener noreferrer">
													Ver detalles
										</a>
											</td>
										</tr>
									)
								})
							}
							{ cargandoMas && (
								<div className="spinner-border text-warning" role="status">
									<span className="sr-only">cargando...</span>
								</div>
							)}
						</tbody>
					</table>
						<button 
							className={!siguientesPersonajes ? 'btn btn-primary disabled' : 'btn btn-primary' }
							onClick={ () => this.cargarMasPersonajes() }
							disabled={ !siguientesPersonajes ? true : null }
						>Siguiente</button>
						<hr/>
						{siguientesPersonajes && (
							<button
								className="btn btn-primary"
								onClick={() => this.cargarMasPersonajes()}
							>Más</button>
						)}
						<br/>
						
						{/* IF TERNARIO TE CONTRA CORTO */}
						<i className='my-5 d-block'> { this.state.siguientesPersonajes ?? 'llegó null' } </i>
					</React.Fragment>
				}
			</React.Fragment>
		);
	}
}

export default ListadoPersonajes;
