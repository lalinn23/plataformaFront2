<template>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <template>
              <card>
                <h4 slot="header" class="card-title">Agregar Actividad</h4>
                <form @submit.prevent="crearActividad">
                  <div class="mb-3" style="text-align: left;">
                    <label for="lider" class="form-label fw-normal" style="color: black;">Nombre del Lider:</label>
                    <input type="text" id="lider" v-model="lider" class="form-control" placeholder="Nombre del Lider"
                      required>
                  </div>
  
                  <div class="mb-3" style="text-align: left;">
                    <label for="user" class="form-label fw-normal" style="color: black;">Nombre del consultor:</label>
                    <p>{{ usuarioAutenticado.first_name }}</p>
                  </div>
  
                  <div class="mb-3" style="text-align: left;">
                    <label for="proyecto" class="form-label fw-normal" style="color: black;">Proyecto:</label>
                    <select v-model="proyectoSeleccionado" class="form-select">
                      <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">{{ proyecto.nombreP }}
                      </option>
                    </select>
                  </div>
  
                  <div class="mb-3" style="text-align: left;">
                    <label for="actividad" class="form-label fw-normal" style="color: black;">Actividad:</label>
                    <input type="text" id="actividad" v-model="actividad" class="form-control"
                      placeholder="Nombre de la actividad" required>
                  </div>
  
                  <div class="mb-3" style="text-align: left;">
                    <label for="fase" class="form-label fw-normal" style="color: black;">Fase:</label>
                    <select v-model="faseSeleccionada" class="form-select">
                      <option v-for="fase in fases" :key="fase.id" :value="fase.id">{{ fase.nombreF }}</option>
                    </select>
                  </div>
  
                  <div class="mb-3" style="text-align: left;">
                    <label for="etapa" class="form-label fw-normal" style="color: black;">Etapa:</label>
                    <select v-model="etapaSeleccionada" class="form-select">
                      <option v-for="etapa in etapas" :key="etapa.id" :value="etapa.id">{{ etapa.nombreE }}</option>
                    </select>
                  </div>
  
                  <div class="mb-3" style="text-align: left;">
                    <label for="descripcion" class="form-label fw-normal" style="color: black;">Descripción:</label>
                    <textarea class="form-control" id="descripcion" v-model="descripcion"
                      placeholder="Describe la actividad" rows="3" required></textarea>
                  </div>
  
                  <div class="mb-3" style="text-align: left;">
                    <label for="hora" class="form-label fw-normal" style="color: black;">Hora:</label>
                    <input type="number" id="hora" v-model="hora" class="form-control"
                      placeholder="Horas dedicadas a la actividad" required>
                  </div>
                  <br>
                  <div class="d-grid">
                    <button type="submit" class="btn btn-primary">Crear Actividad</button>
                  </div>
                  <br>
                  <div class="d-grid">
                    <button type="button" class="btn btn-success" v-on:click="salir()">Atras</button>
                  </div>
                  <br>
                  <br>
                </form>
              </card>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Card from "src/components/Cards/Card.vue";
  import axios from 'axios';
  
  export default {
    components: {
      Card,
    },
    data() {
      return {
        lider: '',
        usuarioAutenticado: {}, // Variable para almacenar el usuario autenticado
        proyectoSeleccionado: null,
        actividad: '',
        faseSeleccionada: null,
        etapaSeleccionada: null,
        descripcion: '',
        hora: '',
        proyectos: [],
        fases: [],
        etapas: []
      };
    },
    mounted() {
      this.fetchUsers();
      this.fetchProyectos();
      this.fetchFases();
      this.fetchEtapas();
    },
    methods: {
      fetchUsers() {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        // Verificar si el token existe
        if (!token) {
            console.error('No se encontró un token en el localStorage.');
            return Promise.reject(new Error('No se encontró un token en el localStorage.'));
        }

        // Configurar los headers con el token
        const config = {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        };

        return axios.get('http://127.0.0.1:8000/api/auth/me', config)
          .then(response => {
            // Asignar el usuario autenticado a la variable usuarioAutenticado
            this.usuarioAutenticado = response.data;
            console.log('Usuario autenticado:', response.data);
            return response.data; // Devolver los datos del usuario autenticado
            //console.log(response);
          })
          .catch((error) => {
            console.log('Error al obtener el usuario: ', error);
            return Promise.reject(error); // Devolver el error como una promesa rechazada
          });
      },
      fetchProyectos() {
        axios.get('http://127.0.0.1:8000/api/pro/proyectos/')
          .then(response => {
            this.proyectos = response.data;
            console.log('Proyecto: ', response.data);
          })
          .catch(error => {
            console.error('Error al obtener proyectos: ', error);
          });
      },
      fetchFases() {
        axios.get('http://127.0.0.1:8000/api/fase/fases/')
          .then(response => {
            this.fases = response.data;
            console.log('Fases: ', response.data);
          })
          .catch(error => {
            console.error('Error al obtener fases: ', error);
          });
      },
      fetchEtapas() {
        axios.get('http://127.0.0.1:8000/api/etapa/etapas/')
          .then(response => {
            this.etapas = response.data;
            console.log('Etapas: ', response.data);
          })
          .catch(error => {
            console.error('Error al obtener etapas: ', error);
          });
      },
      salir() {
        this.$router.push('actividadView');
      },
      crearActividad() {
  if (!this.lider || !this.proyectoSeleccionado || !this.actividad || !this.faseSeleccionada || !this.etapaSeleccionada || !this.descripcion || !this.hora) {
    alert('Por favor complete todos los campos');
    return;
  }

  const token = localStorage.getItem('token'); // Obtener el token del localStorage

  // Llamar a fetchUsers para obtener el usuario autenticado
  this.fetchUsers().then(() => {
    // Construir el objeto de actividad solo después de que se haya recuperado el usuario autenticado
    const actividad = {
      lider: this.lider,
      user: this.usuarioAutenticado.id, // Solo pasamos el ID del usuario
      proyecto_id: this.proyectoSeleccionado,
      actividad: this.actividad,
      fase_id: this.faseSeleccionada,
      etapa_id: this.etapaSeleccionada,
      descripcion: this.descripcion,
      hora: this.hora
    };

    axios.post('http://127.0.0.1:8000/api/act/actividad/', actividad, {
      headers: {
        'Authorization': `Bearer ${token}` // Incluir el token en el encabezado
      }
    })
    .then(response => {
      console.log('Actividad creada:', response.data);
      alert('Actividad creada exitosamente');
      // Aquí puedes redirigir a otra página o hacer cualquier otra acción después de crear la actividad
    })
    .catch(error => {
      console.error('Error al crear actividad: ', error);
      alert('Error al crear actividad');
    });
  }).catch(error => {
    console.error('Error al obtener usuario autenticado: ', error);
    alert('Error al obtener usuario autenticado');
  });
},

    }
  };
  </script>
  
  <style>
  /* Aquí puedes agregar tus estilos si es necesario */
  </style>