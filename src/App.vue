<template>
	<div id="app" class="container">
		<h1>UDS</h1>
		<b-card>
			<b-alert variant="danger" dismissible show v-model="showErrorAlert">Preencha o tamanho e o sabor!</b-alert>
			<b-alert variant="danger" dismissible show v-model="showExtraErrorAlert">Selecione um adicional!</b-alert>
			<div class="row">
				<div class="col-md-6">
					<b-form-group label="Selecione o Tamanho">
						<b-form-select v-model="selectedTamanho" :options="tamanhos" :disabled="isPizzaSelected" />
					</b-form-group>
				</div>
				<div class="col-md-6">
					<b-form-group label="Selecione o Sabor">
						<b-form-select v-model="selectedSabor" :options="sabores" :disabled="isPizzaSelected" />
					</b-form-group>
				</div>
			</div>
			<b-button class="col-md-12 mb-2" @click="selectPizza()" variant="primary" :disabled="isPizzaSelected">Selecionar</b-button>
			<div class="row">
				<div class="col-md-6">
					<b-form-group label="Adicional?">
						<b-form-select v-model="selectedExtra" :options="extras" :disabled="isDone"/>
					</b-form-group>
				</div>
				<div class="col-md-6">
					<b-form-group label=".">
						<b-button @click="addExtra(selectedExtra)" variant="success" class="col-md-12" :disabled="isDone">Adicionar Extra</b-button>
					</b-form-group>
				</div>
			</div>
			<b-list-group class="mb-4">
				<b-list-group-item v-for="(extra, id) in addExtras" :key="id">
					<strong>Extra: </strong>{{ extra }}<br/>
				</b-list-group-item>
			</b-list-group>
			<b-button v-b-modal.resumoModal variant="info" class="col-md-12" :disabled="isDone" @click="done()">Resumo</b-button>
			<b-button variant="danger" class="col-md-12 mt-4" v-if="isNew" @click="newPedido()">Novo Pedido</b-button>
			<b-modal id="resumoModal" title="Pedido Finalizado">
				<p>Tamanho: {{ selectedTamanho }}</p>
				<p>Sabor: {{ selectedSabor }}</p>
				<p>Valor da pizza: R${{ precoTamanho | toReal }}</p>
				<div v-for="(extra, id) in addExtras" :key="id">
					<p>{{ extra }}</p>
				</div>
				<p>Valor dos adicionais: R${{ total - precoTamanho | toReal }}</p>
				<p>Total a pagar: R${{ total | toReal }}</p>
				<p>Tempo de preparo: {{ tempo }} minutos</p>
			</b-modal>
		</b-card>
		<div class="footer">Desenvolvido por André Machida</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tamanhos: [],
			selectedTamanho: null,
			selectedExtra: null,
			selectedSabor: null,
			sabores: [],
			extras: [],
			addExtras: [],
			isPizzaSelected: false,
			isDone: true,
			total: 0,
			tempo: 0,
			showErrorAlert: false,
			showExtraErrorAlert: false,
			isNew: false,

			precoTamanho: 0

		}
	},
	methods: {
		addExtra(extra) {
			if (this.selectedExtra == null) {
				this.showExtraErrorAlert = true
				return
			}
			this.addExtras.push(extra)
			this.selectedExtra = null
		},
		selectPizza() {
			if (this.selectedTamanho == null || this.selectedSabor == null) {
				this.showErrorAlert = true
				return
			}
			this.isPizzaSelected = true
			this.isDone = false
		},
		done() {
			this.isDone = true
			this.tamanhos.filter(res => {
				if (res.text === this.selectedTamanho) {
					this.total += res.price
					this.tempo += res.time
					this.precoTamanho = res.price
				}
			})
			this.sabores.filter(res => {
				if (res.text === this.selectedSabor) {
					this.tempo += res.time
				}
			})
			this.extras.filter(res => {
				for (let i = 0; i < this.addExtras.length; i++) {
					if (res.text == this.addExtras[i]) {
						this.total += res.price
						this.tempo += res.time
					}
				}
			})
			this.isNew = true;
		},
		limpar() {
			this.isNew = false
			this.isDone = false
			this.isPizzaSelected = false
			this.selectedTamanho = null
			this.selectedExtra = null
			this.selectedSabor = null
			this.addExtras = []
			this.total = 0
			this.tempo = 0
			this.showErrorAlert = false
			this.showExtraErrorAlert = false
		},
		newPedido() {
			this.limpar()
		}
	},
	created() {
		this.$http('pizza-extra')
			.then(resp => {
				this.extras = resp.data
			})

		this.$http('pizza-size')
			.then(resp => {
				this.tamanhos = resp.data
			})

		this.$http('pizza-flavour')
			.then(resp => {
				this.sabores = resp.data
			})
	}
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	font-size: 1.5rem;
}

#app h1 {
	text-align: center;
	margin: 50px;
}

.footer {
	display: flex;
	flex: 1;
	justify-content: center;
	margin: 20px;
	font-size: 20px;
}
</style>
