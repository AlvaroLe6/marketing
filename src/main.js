
    import { createApp } from 'vue'
    import { createPinia } from 'pinia'
    import { VDateInput } from 'vuetify/labs/VDateInput'
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'

    //Vuetify

    import 'vuetify/styles' 
    import { createVuetify} from 'vuetify'
    import * as components from 'vuetify/components'
    import * as directives from 'vuetify/directives'

    //Firebase
    import { VueFire, VueFireAuth } from 'vuefire'
    import { firebaseApp } from './config/firebase'


    import App from './App.vue'
    import router from './router'

    import '@mdi/font/css/materialdesignicons.css'
    import 'remixicon/fonts/remixicon.css'

    // Vuetify
    const vuetify = createVuetify({
        icons: {
          defaultSet: 'mdi', // Set de iconos por defecto
        },
        components: {
          ...components,
          VDateInput
        },
        directives,

      });
    const app = createApp(App)

    //Firebase
    app.use(VueFire,{
        firebaseApp,
        modules: [VueFireAuth()],
    })

    app.component('VueDatePicker', VueDatePicker);
    app.use(vuetify)
    app.use(createPinia())
    app.use(router)

    app.mount('#app')
