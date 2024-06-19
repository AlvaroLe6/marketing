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
    <div v-if="authUser">
      Bienvenido, {{ userProfile.username || 'Usuario' }}  <!-- Muestra el nombre de usuario -->
      <!--<img :src="auth.isAuth.photoURL" alt="Avatar del usuario">--> <!-- Muestra la foto de perfil -->
      <!-- Otros detalles del usuario -->
    </div>

    <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>

      <VAvatar class="cursor-pointer" color="primary" variant="tonal">
        <VImg :src="avatar1" />

        <!-- SECTION Menu -->
        <VMenu activator="parent" width="230" location="bottom end" offset="14px">

          <VList>
            <!--  User Avatar & Name -->
            <VListItem>
              <template #prepend>
                <VListItemAction start>
                  <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                    <VAvatar color="primary" variant="tonal">
                      <VImg :src="avatar1" />
                    </VAvatar>
                  </VBadge>
                </VListItemAction>
              </template>

              <VListItemTitle class="font-weight-semibold">
                {{ userProfile.username || 'Usuario' }}
              </VListItemTitle>
              <VListItemSubtitle>Admin</VListItemSubtitle>
            </VListItem>
            <VDivider class="my-2" />

            <!-- Perfil -->
            <VListItem :to="{ name: 'account-settings' }">
              <template #prepend>
                <VIcon class="me-2" icon="mdi-account" size="22" />
              </template>

              <VListItemTitle :to="{ name: 'account-settings' }">Perfil</VListItemTitle>
            </VListItem>

            <!-- 👉 Settings -->
            <VListItem link>
              <template #prepend>
                <v-icon class="me-2" icon="mdi-nut" size="22" />
              </template>

              <VListItemTitle>
                Ajustes
              </VListItemTitle>
            </VListItem>

            <!-- Divider -->
            <VDivider class="my-2" />

            <!-- 👉 Logout -->
            <VListItem to="/login">
              <template #prepend>
                <VIcon class="me-2" icon="mdi-logout" size="22" />
              </template>

              <VListItemTitle @click="authStore.logout"> Cerrar sesión</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
        <!-- !SECTION -->
      </VAvatar>
    </VBadge>
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