<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import OfertaAcademicaIng from "@/components/OfertaAcademicaIng.vue";
import OfertaAcademicaEmp from "@/components/OfertaAcademicaEmp.vue";
import OfertaAcademicaSalud from "@/components/OfertaAcademicaSalud.vue";
import OfertaAcademicaSocial from "@/components/OfertaAcademicaSocial.vue";
import OfertaAcademicaTec from "@/components/OfertaAcademicaTec.vue";

const route = useRoute();
const activeTab = ref(route.params.tab);

// tabs
const tabs = [
  {
    title: "INGENIERÍA",
    icon: "ri-group-line",
    tab: "ingenieria",
  },
  {
    title: "SALUD",
    icon: "ri-lock-line",
    tab: "salud",
  },
  {
    title: "EMPRESARIAL",
    icon: "ri-group-line",
    tab: "empresarial",
  },
  {
    title: "SOCIAL",
    icon: "ri-lock-line",
    tab: "social",
  },
  {
    title: "TECNOLOGÍA",
    icon: "ri-lock-line",
    tab: "tecnologica",
  },
];
</script>

<template>
  <v-row justify="center">
    <v-col cols="10">
      <img src="@/assets/images/portada/Portada1.png" alt="Portada" class="responsive-image" />
    </v-col>
  </v-row>
  <v-row class="mt-5">
    <v-col cols="12" class="text-center">
      <h1>CATEGORIAS</h1>
    </v-col>
  </v-row>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-tabs v-model="activeTab" show-arrows class="d-flex justify-center">
          <v-tab v-for="item in tabs" :key="item.icon" :value="item.tab">
            <v-icon size="20" start :icon="item.icon" />
            {{ item.title }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-window v-model="activeTab" class="mt-5 disable-tab-transition" :touch="false">
          <v-window-item value="ingenieria">
            <OfertaAcademicaIng />
          </v-window-item>
          <v-window-item value="empresarial">
            <OfertaAcademicaEmp />
          </v-window-item>
          <v-window-item value="salud">
            <OfertaAcademicaSalud />
          </v-window-item>
          <v-window-item value="social">
            <OfertaAcademicaSocial />
          </v-window-item>
          <v-window-item value="tecnologica">
            <OfertaAcademicaTec />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
    <v-row>
      <v-container fluid class="pa-0 gradient-background">
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" class="text-center">
            <h1>VENTAJAS DE ESTUDIAR CON ESAM</h1>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center align-center">

          <v-col cols="12" md="4" class="text-center pa-10">
            <img src="@/assets/images/esam/reloj.png" alt="reloj" class="reloj-size" />
            <h3>FLEXIBILIDAD DE HORARIOS</h3>
            <p class="justified-text">
              Estudia a la hora que mejor te convenga, sin limites ni horarios fojos.</p>
            <div class="yellow-line"></div>
          </v-col>

          <v-col cols="12" md="4" class="text-center pa-10">
            <img src="@/assets/images/esam/medalla.png" alt="reloj" class="reloj-size" />
            <h3>DESARROLLA COMPETENCIAS DIGITALES</h3>
            <p class="justified-text">
              Capacitate mediante el uso de las Nuevas tecnologias de la información</p>
            <div class="yellow-line"></div>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="4" class="text-center pa-10">
            <img src="@/assets/images/esam/birrete.png" alt="reloj" class="reloj-size" />
            <h3>CONTENIDOS ACTUALIZADOS</h3>
            <p class="justified-text">
              actualización rápida e instantanea de contenidos y planes de estudio.</p>
            <div class="yellow-line"></div>
          </v-col>
          <v-col cols="12" md="4" class="text-center pa-10">
            <img src="@/assets/images/esam/ubicacion.png" alt="reloj" class="reloj-size" />
            <h3>ESTUDIA EN CUALQUIER LUGAR</h3>
            <p class="justified-text">
              estudia desde la comodidad de tu hogar o en cualquier lugar.
            </p>
            <div class="yellow-line"></div>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="4" class="text-center pa-10">
            <img src="@/assets/images/esam/computadora-portatil.png" alt="reloj" class="reloj-size" />
            <h3>DOCENTES NACIONALES E INTERNACIONALES</h3>
            <p class="justified-text">
              Podrás estudiar mientras trabajas, sin decuidar tus labores.
            </p>
            <div class="yellow-line"></div>
          </v-col>
          <v-col cols="12" md="4" class="text-center pa-10">
            <img src="@/assets/images/esam/sensible.png" alt="reloj" class="reloj-size" />
            <h3>CONÉCTATE DESDE CUALQUIER DISPOSITIVO</h3>
            <p class="justified-text">
              Accede a las clases desde tu smartphone, tablet, laptop, notebook o PC.
            </p>
            <div class="yellow-line"></div>
          </v-col>
        </v-row>

      </v-container>
    </v-row>
  </div>
</template>
<style scoped>
.responsive-image {
  width: 100%;
  height: auto;
  display: block;
}

.h1, h3 {
  color: #254e83;
}

.v-tabs {
  justify-content: center;
  width: 100%;
}

.v-tab {
  flex: 1;
  /* Hace que cada pestaña ocupe el mismo ancho */
}

.gradient-background {
  background: transparent;
}

.text-white {
  color: #254e83;
  font-size: 12px;
}

.justified-text {
  text-align: center;
  color: #254e83;
}

.yellow-line {
  width: 150px;
  height: 3px;
  background-color: #ffe10b;
  margin: 0 auto;
  margin-top: 10px;
}

.reloj-size {
  width: 85px;
  /* Ajusta el ancho según el tamaño del logo deseado */
  height: auto;
  /* Mantiene la proporción de la imagen */
}
</style>