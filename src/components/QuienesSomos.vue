<script setup>
import { ref } from 'vue';

const images = ref([
  {
    src: new URL('@/assets/images/portada/Portada1.jpg', import.meta.url).href,
  },
  {
    src: new URL('@/assets/images/portada/Portada2.jpg', import.meta.url).href,
  },
  {
    src: new URL('@/assets/images/portada/Portada3.jpg', import.meta.url).href,
  }
])
</script>
<template>
  <v-container>
  <v-carousel
    height="450"
    show-arrows="hover"
    cycle
    hide-delimiter-background
  >
    <v-carousel-item
      v-for="(image, i) in images"
      :key="i"
    >
      <v-img
        :src="image.src"
        height="100%"
        contain
      ></v-img>
    </v-carousel-item>
  </v-carousel>
</v-container>
  <v-container fluid class="pa-0 gradient-background">
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" class="text-center text-white">
        <h1>NOSOTROS</h1>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" md="4" class="text-center text-white pa-10">
        <v-icon large class="icon-size mb-4">mdi-target</v-icon>
        <h3>MISIÓN</h3>
        <p class="justified-text">
          Desarrollar valor social y económico, mediante procesos educativos y de servicio de calidad que satisfagan las necesidades para el crecimiento técnico, profesional y científico presente y futuro de nuestros clientes, mantenimiento nuestra ventaja competitiva.
        </p>
        <div class="yellow-line"></div>
      </v-col>
      <v-col cols="12" md="4" class="text-center text-white pa-10">
        <v-icon large class="icon-size mb-4">mdi-eye</v-icon>
        <h3>VISIÓN</h3>
        <p class="justified-text">
          Ser una organización de identidad propia y marca posicionada a nivel nacional e internacional, mediante un modelo 4.0, con capacidades agiles de adaptación y reinvención constante que interprete y resuelva las necesidades de nuestros clientes.
        </p>
        <div class="yellow-line"></div>
      </v-col>
      <v-col cols="12" md="4" class="text-center text-white pa-10">
        <v-icon large class="icon-size mb-4">mdi-trophy</v-icon>
        <h3>PRINCIPIOS</h3>
        <p class="justified-text">
          Formar personas aptas, competentes y técnicamente bien preparadas, con juicio propio, autónomas, que sean capaces de darle sentido al entorno con el propósito de transformarlo mediante el alcance de metas y objetivos propios, personales y profesionales.
        </p>
        <div class="yellow-line"></div>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" md="6" class="text-center text-white pa-10">
        <v-icon large class="icon-size mb-4">mdi-diamond</v-icon>
        <h3>VALORES</h3>
        <p>LIDERAZGO - PRODUCTIVIDAD - RESPETO - TRABAJO EN EQUIPO - DISCIPLINA</p>
        <p>INTELIGENCIA EMOCIONAL - ÉTICA - NEGOCIACIÓN - CREATIVIDAD - EFICIENCIA</p>
        <p>COMPROMISO - HONESTIDAD</p>
        <p class="justified-text">
          La incorporación sistemática de los valores da como resultado una educación de calidad. Es muy importante que todos los miembros de la corporación conozcan los valores que tenemos para identificarnos con ellos en cada situación.
        </p>
        <div class="yellow-line"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gradient-background {
  background: linear-gradient(to right, #162b4b, #254e83);
}
.text-white {
  color: white;
  font-size: 12px;
}
.justified-text {
  text-align: justify;
}
.yellow-line {
  width: 150px;
  height: 3px;
  background-color: #ffe10b;
  margin: 0 auto;
  margin-top: 10px;
}
.icon-size {
  font-size: 48px; /* Puedes ajustar el tamaño según tus necesidades */
}
</style>
