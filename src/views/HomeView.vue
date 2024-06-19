<script>
export default {
	name: "my-cool-component",
}
</script>
<template>
  <main>
    <v-row justify="center">
      <div class="portada">
      <img 
      src="@/assets/images/portada.jpg" 
      alt="Portada"
      />
    </div>
    </v-row>
  </main>
</template>

<style >
.portada {
  width: 100%; 
  height: 100vh; 
  overflow: hidden; 
}

.portada img {
  width: 100%; 
  height: auto; 
  object-fit: cover; 
}
</style>