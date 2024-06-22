<script setup>
import { ref  } from "vue";
import { useRoute } from "vue-router";
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import axios from 'axios';

const route = useRoute();

const certficadoData = ref({
  Cod_Programa:route.query.Cod_Programa,
  Nombre: route.query.Nombre,
  
});

const nombre = ref("");
const apellido = ref("");
const nroCarnet = ref("");
const genero = ref("");
const fechaNacimiento = ref("");
const gradoAcademico = ref("");
const profesion = ref("");
const ciudadResidencia = ref("");
const institucionEgreso = ref("");
const domicilio = ref("");
const celular = ref("");
const correo = ref("");
const ciudades = ["Ciudad 1", "Ciudad 2", "Ciudad 3"];
</script>
    

<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <h2>FORMULARIO DE PRE INSCRIPCIÓN</h2>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="text-center">
      <h2>
        {{ certficadoData.Nombre }}      </h2>
      <v-span>Asesor: xxxxx</v-span>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6" class="d-flex flex-column"> 
      <img src="@/assets/images/dip. edu.jpeg">
    
    </v-col>
    <v-col cols="6" >
      <v-card elevation="3" max-width="800" flat class="card mx-auto my-10">
        <v-snackbar v-model="snackbar" top right color="green" :timeout="3000">
          {{ snackbarMessage  }}
          <v-btn color="white" text @click="snackbar = false"> Cerrar </v-btn>
        </v-snackbar>
        <v-card-title class="font-weight-bold" tag="h6">
          Datos Personales
        </v-card-title>

        <v-col cols="12">
          <v-span class="text-campos-obligatorios"> Los campos con un asterisco(*) son obligatorios </v-span>
          <VDivider />
          <v-row>
            <!-- Nombre -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="nombre"
                label="Nombres"
                variant="outlined"
                persistent-hint
              ></v-text-field>
            </v-col>
            <!-- Apellido -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="apellido"
                label="Apellidos"
                variant="outlined"
                persistent-hint
              ></v-text-field>
            </v-col>
            <!-- Numero de carnet -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="nroCarnet"
                label="Documento de identidad"
                variant="outlined"
                persistent-hint
              ></v-text-field>
            </v-col>
            <!-- Numero de Genero -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="nroCarnet"
                label="Genero"
                variant="outlined"
                persistent-hint
              ></v-text-field>
            </v-col>
            <!-- Fecha de nacimiento -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="nroCarnet"
                label="Fecha de nacimiento"
                variant="outlined"
                persistent-hint
              ></v-text-field>
            </v-col>
            <!-- Grado academico -->
            <v-col md="6" cols="12">
              <v-select
                v-model="ciudadR"
                label="Grado académico"
                :items="ciudades"
                outlined
                variant="outlined"
                persistent-hint
              ></v-select>
            </v-col>
            <!-- Profesion -->
            <v-col md="6" cols="12">
              <v-select
                v-model="ciudadR"
                label="Profesión"
                :items="ciudades"
                outlined
                variant="outlined"
                persistent-hint
              ></v-select>
            </v-col>
            <!-- Ciudad de recidencia -->
            <v-col md="6" cols="12">
              <v-select
                v-model="ciudadR"
                label="Ciudad de recidencia"
                :items="ciudades"
                outlined
                variant="outlined"
                persistent-hint
              ></v-select>
            </v-col>
            <!-- Institución de egreso -->
            <v-col md="6" cols="12">
              <v-select
                v-model="ciudadR"
                label="Institución de egreso"
                :items="ciudades"
                outlined
                variant="outlined"
                persistent-hint
              ></v-select>
            </v-col>
            <!-- Domicilio/direccion: -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="email"
                label="Domicilio/direccion:"
                variant="outlined"
                persistent-hint
              ></v-text-field>
            </v-col>
          
            <v-col md="12" cols="12" class="text-datos-contacto">
            <v-spam class="text-datos-contacto">
            Datos Contacto
            </v-spam>
            </v-col>
            <!-- Celular -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="celular"
                label="Celular"
                variant="outlined"
                persistent-hint
              ></v-text-field>
            </v-col>
            <!-- Correo -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="celular"
                label="Correo"
                variant="outlined"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col md="12" cols="12" class="text-datos-contacto d-flex justify-center align-center" >
            <v-spam class="text-regularizar">
              RECUERDE QUE TIENE UN LAPSO DE 72 HORAS PARA REGULARIZAR LA DOCUMENTACIÓN PARA SU INSCRIPCION.
            </v-spam>
            </v-col>
            <v-col md="12" cols="12" class="d-flex justify-center align-center">
            <v-spam class="text-completar-insc">
              Para completar su inscripción debe comunicarse con su asesor el cual le guiará con los siguientes pasos que debe realizar para regularizar sus documentos y definir su plan de pagos.            </v-spam>
            </v-col>
  </v-row>
  <v-row>
    <!-- Guardar los datos del Formulario -->
    <v-col cols="12" class="d-flex justify-center align-center">
      <v-btn @click="submit">Reservar plaza</v-btn>
    </v-col>
  </v-row>
</template>
<style>
.v-card-title
{
  background-color: #162D4B;
  font-size: 18px;
  color: white;
 
}
.text-campos-obligatorios
{
  font-size: 16px;
  color: red;
}
.text-datos-contacto
{
  background-color: #162D4B;
  font-size: 18px;
  color: white;
  font-weight: bold;
}
.text-regularizar
{
  background-color: #162D4B;
  font-size: 16px;
  color: white;
  font-weight: bold;
}
.text-completar-insc
{
  font-size: 16px;
  color: red;
}
</style>

