<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <card class="strpied-tabled-with-hover shadow">
            <div class="card-body text-left">
              <h1 class="card-title">Actualizar <span class="resaltado">Cliente</span></h1>
              <br>
              <form>
                <div class="form-group " >
                  <label for="nombreC" class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="nombreC" placeholder="Ingrese su nombre">
                </div>
                <br>
                <div class="d-grid gap-2 mb-2" >
                  <button type="button" class="btn btn-primary" v-on:click="editarCliente()">Editar</button>
                  <button type="button" class="btn btn-success" v-on:click="salir()">Atras</button>
                </div>
              </form>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from 'src/components/Cards/Card.vue'


export default {
    components: {
    Card
  },
  data: function(){
    return {
        form: {
            "id": "",
            "nombreC": ""
        }
    };
  },
  methods: {
    salir(){
        this.$router.push('/admin/clienteView');
    },
    async obtenerCliente(id) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cliente/clientes/${id}/`);
        if (!response.ok) {
          throw new Error('Error al obtener el cliente');
        }
        const data = await response.json();
        this.form.id = data.id;
        this.form.nombreC = data.nombreC;
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
  },


}
</script>

<style>

</style>