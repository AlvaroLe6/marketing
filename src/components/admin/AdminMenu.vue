<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from 'pinia';

const { authUser, auth } = useAuthStore();
const authStore = useAuthStore();

const { userProfile } = storeToRefs(authStore);


console.log("Nombre de usuario cargado:", userProfile.value.username);

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
            <v-list-item :to="{ name: 'admin-admin' }">
              <template #prepend>
                <v-icon class="me-2" icon="mdi-menu" size="22" />
              </template>
              <v-list-item-title 
              :to="{ name: 'account-settings' }">Inicio</v-list-item-title >
            </v-list-item>
            <v-divider class="my-2" />

            <!-- Marketing -->
            <v-list-item :to="{ name: 'admin-list-contabilidad' }">
              <template #prepend>
                <v-icon class="me-2" icon="mdi-monitor-multiple" size="22"/>
              </template>

              <v-list-item-title :to="{ name: 'account-settings' }">Marketing</v-list-item-title>
            </v-list-item>

            <!-- Administrivo -->
            <v-list-item link>
              <template #prepend>
                <v-icon class="me-2" icon="mdi-account-box" size="22" />
              </template>

              <v-list-item-title>
                Administrivo
              </v-list-item-title>
            </v-list-item>

            <!-- Docentes -->
            <v-list-item link>
              <template #prepend>
                <v-icon class="me-2" icon="mdi-account-network" size="22" />
              </template>

              <v-list-item-title>
                Docentes
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