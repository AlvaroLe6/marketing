<script setup>
import axios from 'axios';
import { ref } from "vue";

const snackbar = ref(false);
const snackbarMessage = ref("");
const nombrePrograma = ref("");

const portadaUrl = ref("");
const file = ref(null);

//carga la imagen
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    
    file.value = selectedFile;
    const reader = new FileReader();
    reader.onload = (e) => {
      portadaUrl.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  }
};
const submit = async () => {
  try {
    // Subir la imagen
    const formData = new FormData();
    formData.append('file', file.value);
    
    const uploadResponse = await axios.post('http://localhost:3000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const fondoId = uploadResponse.data.id;
    
 // Crear el programa
 await axios.post('http://localhost:3000/api/programas', {
      nombre: nombrePrograma.value,
      fondoId
    });
    
    snackbarMessage.value = 'Programa creado con éxito';
    snackbar.value = true;
  } catch (error) {
    snackbarMessage.value = 'Error al crear el programa';
    snackbar.value = true;
  }
};
</script> 

<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <h2>REGISTRAR PROGRAMA</h2>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-card elevation="3" max-width="800" flat class="card mx-auto my-10">
        <v-snackbar v-model="snackbar" top right color="green" :timeout="3000">
          {{ snackbarMessage }}
          <v-btn color="white" text @click="snackbar = false"> Cerrar </v-btn>
        </v-snackbar>
        <v-card-title class="font-weight-bold" tag="h6">
          Informacion del programa:
        </v-card-title>

        <v-col cols="12">
          <v-span class="text-campos-obligatorios">
            Los campos con un asterisco(*) son obligatorios
          </v-span>
          <VDivider />
          <v-row>
            <!-- Nombre Programa -->
            <v-col cols="12">
              <v-text-field
                v-model="nombrePrograma"
                label="Nombre programa"
                variant="outlined"
                persistent-hint
              ></v-text-field>
            </v-col>
            <!-- Portada del programa -->
            <v-col cols="12" class="d-flex flex-column">
              <span>Portada del programa</span>
              <v-btn @click="$refs.fileInput.click()">
                <v-icon>mdi-cloud-upload</v-icon>
            </v-btn>
                <input
                ref="fileInput"
                type="file"
                style="display: none"
                @change="handleFileChange"
              />
              <img v-if="portadaUrl" :src="portadaUrl" alt="Portada del programa" 
              class="portada-img"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <!-- Guardar los datos del Formulario -->
    <v-col cols="12" class="d-flex justify-center align-center">
      <v-btn @click="submit">Guardar cambios</v-btn>
    </v-col>
  </v-row>
</template>
<style>
.v-card-title {
  background-color: #162d4b;
  font-size: 18px;
  color: white;
}
.text-campos-obligatorios {
  font-size: 16px;
  color: red;
}
.portada-img {
  width: 450px;
  height: 450px;
  object-fit: cover;
  border: 1px solid #ddd; /* Opcional: para añadir un borde */
}
</style>

