<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

const { userProfile } = storeToRefs(authStore);

</script>

<template>

  <div class="user-profile">
    <v-btn 
    color="teal-lighten-3" 
    variant="outlined">
    Administrador
        
        <!-- Menu administrador -->
        <v-menu activator="parent" width="230" location="bottom end" offset="14px">

          <v-list>
            <!--  Inicio -->
            <v-list-item :to="{ name: 'home' }">
              <template #prepend>
                <v-icon class="me-2" icon="mdi-menu" size="22" />
              </template>
              <v-list-item-title 
              :to="{ name: 'home' }">Inicio</v-list-item-title >
            </v-list-item>
            <v-divider class="my-2" />

            <!--  Registro de programas -->

            <v-list-item :to="{ name: 'admin-reg-programa' }">
              <template #prepend>
                <v-icon class="me-2" icon="mdi-monitor" size="22" />
              </template>
              <v-list-item-title 
              :to="{ name: 'admin-reg-programa' }">Nuevo Porgrama</v-list-item-title >
            </v-list-item>

            <!-- Lista de Porgramas -->
            <v-list-item :to="{ name: 'admin-list-programas' }">
              <template #prepend>
                <v-icon class="me-2" icon="mdi-format-list-bulleted" size="22"/>
              </template>

              <v-list-item-title :to="{ name: 'admin-list-programas' }">Programas</v-list-item-title>
            </v-list-item>

            <!-- Asesores -->
            <v-list-item :to="{ name: 'admin-list-asesores' }">
              <template #prepend>
                <v-icon class="me-2" icon="mdi-account-box" size="22" />
              </template>

              <v-list-item-title :to="{ name: 'admin-list-asesores' }">
                Asesores
              </v-list-item-title>
            </v-list-item>

            
            <!-- Postulantes a asesores -->
            <v-list-item :to="{ name: 'admin-list-contabilidad' }">
              <template #prepend>
                <v-icon class="me-2" icon="mdi-account-multiple" size="22" />
              </template>

              <v-list-item-title>
                Postulantes
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- !SECTION -->
    </v-btn>
    
  </div>
</template>

<style>
.user-profile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Esto separa los elementos a ambos extremos */
  width: 100%;
  /* O el ancho que desees */
  padding: 0 1rem;
  /* Añade un poco de espacio a los lados si es necesario */
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  /* Añade espacio entre la imagen y el texto si agregas una imagen */
}
</style>