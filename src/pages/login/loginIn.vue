<template>
    <section class="bg-light py-3 py-md-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div class="card border border-light-subtle rounded-3 shadow">
              <!-- Agregué la clase "shadow" para aplicar sombreado -->
              <div class="card-body p-3 p-md-4 p-xl-5">
                <div class="text-center mb-3">
                  <a href="#!">
                    <img src="../data2.png" alt="Data Logo" width="350" height="150">
                  </a>
                </div>
                <h2 class="fs-6 fw-normal text-center text-secondary mb-4">Plataforma de planeación y seguimiento laboral
                </h2>

                <form v-on:submit.prevent="login" action="#!">
                  <div class="row gy-2 overflow-hidden">
                    <div class="col-12">
                      <div class="form-floating mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" name="login" id="login" v-model="email"
                          placeholder="name@example.com" required>
                      </div>
                    </div>
  
                    <div class="col-12">
                      <div class="form-floating mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" name="password" id="password" value=""
                          v-model="password" placeholder="Password" >
                      </div>
                    </div>
  
                    <div class="col-12">
                      <div class="d-grid my-3">
                        <button class="btn btn-primary btn-lg" type="submit">Log in</button>
                      </div>
                    </div>
                    <div class="col-12">
                      <p class="m-0 text-secondary text-center">Don't have an account? <a href="/"
                          class="link-primary text-decoration-none">Sign up</a></p>
                    </div>
                  </div>
                </form>
                <div class="alert alert-danger mt-3" role="alert" v-if="error">
                    {{ error_msg }}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  

<script>
import axios from 'axios';
export default {
    comments: {

    },
    data: function(){
        return {
            email : "",
            password : "",
            error: false,
            error_msg: "",
        }
    },
    methods:{
        login(){
            let json = {
                "email" : this.email,
                "password" : this.password
            };
            axios.post('http://127.0.0.1:8000/api/auth/login', json)
             .then( data => {
                console.log(data);
                if(data.status == 200 ){
                    localStorage.token = data.data.access; //almacenamos el token
                   this.$router.push('/admin/overview');
                   console.log("todo bien");
                }else{
                    this.error = true;
                    this.error_msg = data.status;
                    console.log(error_msg);
                }

             })
        }
    }
}
</script>

<style>

</style>