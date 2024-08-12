<script setup>
import { ref, onMounted   } from "vue";
import { useRoute } from "vue-router";
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import axios from 'axios';


const route = useRoute();
const shortId = route.query.k;

const fetchFormData = async () => {
  try {
    const response = await axios.get(`https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/${shortId}`);
    certificadoData.value = response.data;
  } catch (error) {
    console.error("Error al obtener los datos del formulario:", error);
  }
};


const certificadoData = ref({
  cod_programa: "",
  nombre: "",
  cod_asesor: ""
});

const fondoCertificado = ref(null);
const profesiones = ref([]);
const institucionesEgreso = ref([]);
const gradosAcademicos = ref([]);
const ciudadesResidencia = ref([]);
const asesores = ref([]);
const generoC = ref(["F","M"])


const nombre = ref("");
const apellido = ref("");
const nroCarnet = ref("");
const genero = ref("");
const fechaNacimiento = ref("");
const gradoAcademico = ref("");
const profesion = ref("");
const ciudadResidencia = ref("");
const institucionEgreso = ref("");
const asesor = ref(certificadoData.value.cod_asesor);
const domicilio = ref("");
const celular = ref("");
const correo = ref("");

const errors = ref({
  nombre: "",
  apellido: "",
  nroCarnet: "",
  genero: "",
  fechaNacimiento: "",
  gradoAcademico: "",
  profesion: "",
  ciudadResidencia: "",
  institucionEgreso: "",
  asesor: "",
  domicilio: "",
  celular: "",
  correo: ""
});


// limpiar los campos
const limpiarCampos = () => {
  nombre.value = "";
  apellido.value = "";
  nroCarnet.value = "";
  genero.value = "";
  fechaNacimiento.value = "";
  gradoAcademico.value = "";
  profesion.value = "";
  ciudadResidencia.value = "";
  institucionEgreso.value = "";
  domicilio.value = "";
  celular.value = "";
  correo.value = "";
  errors.value = {};
};

const validate = () => {
  errors.value = {};
  if (!nombre.value) errors.value.nombre = "El nombre es obligatorio";
  if (!apellido.value) errors.value.apellido = "El apellido es obligatorio";
  if (!nroCarnet.value) errors.value.nroCarnet = "El número de carnet es obligatorio";
  if (!genero.value) errors.value.genero = "El género es obligatorio";
  if (!fechaNacimiento.value) errors.value.fechaNacimiento = "La fecha de nacimiento es obligatoria";
  if (!gradoAcademico.value) errors.value.gradoAcademico = "El grado académico es obligatorio";
  if (!profesion.value) errors.value.profesion = "La profesión es obligatoria";
  if (!ciudadResidencia.value) errors.value.ciudadResidencia = "La ciudad de residencia es obligatoria";
  if (!institucionEgreso.value) errors.value.institucionEgreso = "La institución de egreso es obligatoria";
  if (!domicilio.value) errors.value.domicilio = "El domicilio es obligatorio";
  if (!celular.value) errors.value.celular = "El celular es obligatorio";
  if (!correo.value) errors.value.correo = "El correo es obligatorio";
  return Object.keys(errors.value).length === 0;
};
const validateNumber = (event) => {
  const value = event.target.value.replace(/\D/g, '');
  event.target.value = value;
};
const validateEmail = (event) => {
  const value = event.target.value;
  const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!pattern.test(value)) {
    errors.value.correo = "Introduce un correo válido";
  } else {
    errors.value.correo = "";
  }
};

// Mensajes
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");

// carga las profesiones
const cargarProfesiones = async () => {
  try {
    //const response = await axios.get('http://localhost:3000/api/profesiones');
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/profesiones');

    profesiones.value = response.data;
  } catch (error) {
    console.error('Error al cargar las profesiones', error);
  }
};

// carga las instituciones de egreso
const cargarInstitucionesEgreso = async () => {
  try {
    //const response = await axios.get('http://localhost:3000/api/institucion_egreso');
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/institucion_egreso');

    institucionesEgreso.value = response.data;
  } catch (error) {
    console.error('Error al cargar las instituciones de egreso', error);
  }
};

// carga los grados académicos
const cargarGradosAcademicos = async () => {
  try {

    //const response = await axios.get('http://localhost:3000/api/grado_academico');
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/grado_academico');

    gradosAcademicos.value = response.data;

  } catch (error) {
    console.error('Error al cargar los grados académicos', error);
  }
};

// carga los grados académicos
const cargarCiudadResidencia = async () => {
  try {
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/ciudad_residencia');
    //const response = await axios.get('http://localhost:3000/api/ciudad_residencia');
    ciudadesResidencia.value = response.data;
  } catch (error) {
    console.error('Error al cargar los grados académicos', error);
  }
};
// carga los grados académicos
const cargarAsesores = async () => {
  try {
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/asesores');
    //const response = await axios.get('http://localhost:3000/api/asesores');
    asesores.value = response.data;
  } catch (error) {
    console.error('Error al cargar los grados académicos', error);
  }
};
//busca la portada del programa y lo muestra
const buscarFondoCertificado = async () => {
  console.log("portada",certificadoData.value.cod_programa)
  try {
    const response = await axios.get('https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/portada_programa',
   // const response = await axios.get('http://localhost:3000/api/portada_programa', 
    {
      params: { Cod_Programa: certificadoData.value.cod_programa },
     
    });
    fondoCertificado.value = response.data;
  } catch (error) {
    console.error('Eroor no se encontró la portada del programa', error);
  }
};

const submit = async () => {
  if (!validate()) {
    snackbarMessage.value = "Por favor, completa todos los campos requeridos";
    snackbarColor.value = "red";
    snackbar.value = true;
    return;
  }
  const personData  = {
    num_doc: nroCarnet.value,
    nombres: nombre.value,
    apellidos: apellido.value,
    genero: genero.value,
    fecha_nac: fechaNacimiento.value,
    domicilio: domicilio.value,
    telefono: celular.value,
    correo: correo.value,
    cod_ciudad_r: ciudadResidencia.value,
    cod_grado_a: gradoAcademico.value,
    cod_institucion_e: institucionEgreso.value,
    cod_profesion: profesion.value,
    cod_programa: certificadoData.value.cod_programa,
    cod_asesor: certificadoData.value.cod_asesor,
  };
  try {
    const response = await axios.post("https://esammarketingapi-36cc8f6bb2a2.herokuapp.com/api/add_person_and_inscription", personData);
    //const response = await axios.post("http://localhost:3000/api/add_person_and_inscription", personData);
    console.log("Datos insertados con éxito:", response.data);
    snackbarMessage.value = "Datos guardados con éxito";
    snackbarColor.value = "green";
    limpiarCampos();
  } catch (error) {
    console.error("Error al insertar los datos:", error);
    snackbarMessage.value = "Error al guardar los datos";
    snackbarColor.value = "red";

  }
  snackbar.value = true;

};
const handleClick = () => {
  console.log("Botón de reservar plaza clicado");
  //submit();
};

onMounted(() => {
  fetchFormData().then(() => {
    buscarFondoCertificado();
  });
  fetchFormData();
  buscarFondoCertificado();
  cargarProfesiones();
  cargarInstitucionesEgreso();
  cargarGradosAcademicos();
  cargarCiudadResidencia();
  cargarAsesores();
});

</script>
    
<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <h2>FORMULARIO DE REGISTRO</h2>
    </v-col>
  </v-row>


  <v-row>

    <v-col cols="12" md="12" >
      <v-card elevation="3" max-width="800" flat class="card mx-auto my-10">

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
                :error-messages="errors.nombre"
                ></v-text-field>
            </v-col>
            <!-- Apellido -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="apellido"
                label="Apellidos"
                variant="outlined"
                persistent-hint
                :error-messages="errors.apellido"
                ></v-text-field>
            </v-col>
            <!-- Numero de carnet -->
            <v-col md="6" cols="12">
              <v-text-field
              v-model="nroCarnet"
                label="Documento de identidad"
                variant="outlined"
                persistent-hint
                :error-messages="errors.nroCarnet"
                @input="validateNumber"

              ></v-text-field>
              
            </v-col>
            <!-- Numero de Genero -->
            <v-col md="6" cols="12">
              <v-select
                label="Genero"
                :items="generoC"
                variant="outlined"
                persistent-hint
                 v-model="genero"
                 :error-messages="errors.genero"
              ></v-select>
            </v-col>
            <!-- Fecha de nacimiento -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="fechaNacimiento"
                label="Fecha de nacimiento"
                variant="outlined"
                persistent-hint
                :error-messages="errors.fechaNacimiento"
              ></v-text-field>
            </v-col>
            <!-- Grado academico -->
            <v-col md="6" cols="12">
              <v-select
                v-model="gradoAcademico"
                :items="gradosAcademicos"
                item-value="cod_grado_a"
                item-title="grado_academico"
                label="Grado académico"
                variant="outlined"
                persistent-hint
                :error-messages="errors.gradoAcademico"
              ></v-select>
            </v-col>
            <!-- Profesion -->
            <v-col md="6" cols="12">
              <v-select
              v-model="profesion"
                :items="profesiones"
                item-value="cod_profesion"
                item-title="nombre_profesion"
                label="Profesión"
                variant="outlined"
                persistent-hint
                :error-messages="errors.profesion"
              ></v-select>
            </v-col>
            <!-- Ciudad de recidencia -->
            <v-col md="6" cols="12">
              <v-select
              v-model="ciudadResidencia"
                :items="ciudadesResidencia"
                item-value="cod_ciudad_r"
                item-title="nombre_ciudad"
                label="Ciudad de residencia"
                variant="outlined"
                persistent-hint
                :error-messages="errors.ciudadResidencia"
              ></v-select>
            </v-col>
            <!-- Institución de egreso -->
            <v-col md="6" cols="12">
              <v-select
              v-model="institucionEgreso"
                :items="institucionesEgreso"
                item-value="cod_institucion_e"
                item-title="nombre_institucion"
                label="Institución de egreso"
                variant="outlined"
                persistent-hint
                :error-messages="errors.institucionEgreso"
              ></v-select>
            </v-col>
            <!-- Domicilio/direccion: -->
            <v-col md="6" cols="12">
              <v-text-field
                v-model="domicilio"
                label="Domicilio/direccion:"
                variant="outlined"
                persistent-hint
                :error-messages="errors.domicilio"
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
                :error-messages="errors.celular"
                @input="validateNumber"

              ></v-text-field>
            </v-col>
            <!-- Correo -->
            <v-col md="6" cols="12">
              <v-text-field
                type="email"
                v-model="correo"
                label="Correo"
                variant="outlined"
                persistent-hint
                :error-messages="errors.correo"
                @input="validateEmail"

              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <!-- Guardar los datos del Formulario -->
    <v-col cols="12" class="d-flex justify-center align-center">
      <v-btn @click="handleClick">Registrar</v-btn>
    </v-col>
  </v-row>
        <v-snackbar v-model="snackbar" top right :color="snackbarColor" :timeout="3000">
        {{ snackbarMessage }}
        <v-btn color="white" text @click="snackbar = false"> Cerrar </v-btn>
      </v-snackbar>

</template>
<style>

.text-span-asesor
{
  font-size: 18px;
  color: #162D4B;
  font-weight: bold;
}
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

