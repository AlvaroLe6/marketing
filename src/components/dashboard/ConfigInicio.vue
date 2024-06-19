<script setup>
import { onMounted, ref } from 'vue';
import { useStateCheckbox } from '@/stores/stateCheckbox';


const stateCheckbox = useStateCheckbox();
const tempMarketingDisabled = ref(stateCheckbox.marketingDisabled);
const tempAdminDisabled = ref(stateCheckbox.adminDisabled);
const tempDocenteDisabled = ref(stateCheckbox.docenteDisabled);

const snackbar = ref(false);
const snackbarMessage = ref('');

onMounted(() => {
  stateCheckbox.buscarStates().then(()=>{
    tempMarketingDisabled.value = stateCheckbox.marketingDisabled;
    tempAdminDisabled.value = stateCheckbox.adminDisabled;
    tempDocenteDisabled.value = stateCheckbox.docenteDisabled;
});
});

function guardarStates() {
  stateCheckbox.setMarketingDisabled(tempMarketingDisabled.value);
  stateCheckbox.setAdminDisabled(tempAdminDisabled.value);
  stateCheckbox.setDocenteDisabled(tempDocenteDisabled.value);

  stateCheckbox.actualizarStates('btn_marketing', tempMarketingDisabled.value)
  .then(()=>stateCheckbox.actualizarStates('btn_admin', tempAdminDisabled.value))
  .then(() =>stateCheckbox.actualizarStates('btn_docente', tempDocenteDisabled.value))
  .then(() => {
    snackbarMessage.value = 'Estados guardados con éxito';
    snackbar.value = true;
  }).catch((error) => {
    snackbarMessage.value = 'Error al guardar los estados';
    snackbar.value = true;
  });
}


function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    snackbarMessage.value = 'Enlace copiado al portapapeles';
    snackbar.value = true;
  }).catch(err => {
    console.error('Error al copiar al portapapeles: ', err);
    snackbarMessage.value = 'Error al copiar el enlace';
    snackbar.value = true;
  });
}
</script>

<template>
  <v-card class="pa-4">
    <v-card-title> Desactivar enlaces de los formularios </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-checkbox
            v-model="tempMarketingDisabled"
            label="Desactivar el formulario de marketing"
            ></v-checkbox>
          <v-row align="center">
            <v-col cols="9">
              <p>http://localhost:5173/admin/list_contabilidad</p>
            </v-col>
            <v-col cols="3">
              <v-btn 
              color="primary"
              prepend-icon="mdi-link-variant"
              @click="copyToClipboard('http://localhost:5173/admin/list_contabilidad')"
              >Copiar</v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            v-model="tempAdminDisabled"
            label="Desactivar el formulario de administrativo"
           
          ></v-checkbox>
          <v-row align="center">
            <v-col cols="9">
              <p>http://localhost:5173/admin/list_contabilidad</p>
            </v-col>
            <v-col cols="3">
              <v-btn 
              color="primary"
              prepend-icon="mdi-link-variant"
              @click="copyToClipboard('http://localhost:5173/admin/list_contabilidad')"
                >Copiar</v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            v-model="tempDocenteDisabled"
            label="Desactivar el formulario de docentes"
          
          ></v-checkbox>
          <v-row align="center">
            <v-col cols="9">
              <p>http://localhost:5173/admin/list_contabilidad</p>
            
            </v-col>
            <v-col cols="3">
              <v-btn prepend-icon="mdi-link-variant"
              color="primary"
              @click="copyToClipboard('http://localhost:5173/admin/list_contabilidad')"
              >Copiar</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row justify="center" class="mt-4">
        <v-btn color="success" @click="guardarStates"> Guardar </v-btn>
      </v-row>
    </v-card-text>
    <v-snackbar color="success" v-model="snackbar" :timeout="5000">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

  </v-card>
</template>

<style>
.checkbox-group {
  display: flex;
  flex-direction: column;
}
</style>