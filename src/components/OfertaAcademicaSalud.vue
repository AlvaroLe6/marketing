<template>
  <v-container fluid class="pa-0">
    <v-row justify="center">
      <v-card classs="card-principal" rounded="0" theme="white" flat>
        <v-window v-model="onboarding">
          <v-window-item v-for="n in length" :key="`card-${n}`" :value="n">
            <v-row class="d-flex justify-center align-center">
              <v-col cols="12" md="4" class="d-flex justify-center" v-for="m in 3" :key="`card-${n}-${m}`">
                <v-card class="card-portada ma-3" max-width="344" >
                  <img src="@/assets/images/portada/4.jpeg" class="card-image bordered" height="200px">
                  <div class="yellow-line"></div>
                  <v-card-title class="card-title">Card Title {{ n }}-{{ m }}</v-card-title>
                  <v-card-text class="card-text" style="color: #162b4b;">
                    This is a description for card {{ n }}-{{ m }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    
                    <div
                    class="div-btn"
                    ><v-btn
                    class="btn-ver-curso"
                    variant="outlined">
                    ver curso
                  </v-btn>
                </div>
                  </v-card-text>
                 
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
        <v-card-actions class="justify-space-between">
          <v-btn icon="mdi-chevron-left" variant="plain" @click="prev" style="color: #254e83;"></v-btn>
          <v-item-group v-model="onboarding" class="text-center" mandatory>
            <v-item v-for="n in length" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
              <v-btn :variant="isSelected ? 'outlined' : 'text'" icon="mdi-checkbox-blank" @click="toggle" style="color: #254e83;" :class="{ 'square-shape': isSelected }"></v-btn>
            </v-item>
          </v-item-group>
          <v-btn icon="mdi-chevron-right" variant="plain" @click="next" style="color: #254e83;"></v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    length: 3,
    onboarding: 1,
  }),

  methods: {
    next () {
      this.onboarding = this.onboarding + 1 > this.length
        ? 1
        : this.onboarding + 1
    },
    prev () {
      this.onboarding = this.onboarding - 1 <= 0
        ? this.length
        : this.onboarding - 1
    },
  },
}
</script>

<style scoped>
.card-portada {
  background: linear-gradient(to right, #162b4b, #254e83);
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
 
}
.card-text {
  padding-top: 10px;
  color: #ffe10b;
}
.div-btn{
  padding-top: 15px;
}
.btn-ver-curso {
  border-color: #254e83;
  color: #254e83;
  font-weight: bold;
  padding: 10px 20px;
  font-size: 16px;
  border-width: 2px; 
  transition: background-color 0.3s ease, color 0.3s ease; 
}

.card-title {
  background: transparent;
}
.card-text {
  background:white;
  color:#162b4b; 
}
.yellow-line {
  width: 250px;
  height: 6px;
  background-color: #ffe10b;
  margin: 0 auto;
  margin-top: 0px;
}
.card-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
.bordered {
  border: 5px solid #254e83; 
}
.square-shape {
  border-radius: 0 !important; /* Forma cuadrada */
}
</style>
