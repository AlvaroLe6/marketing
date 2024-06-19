export const validationSchema = {
    nombre (value) {
      if (value?.length >= 3 ) return true
      return 'El nombre es obligatorio o es muy corto'
    },
    apellido (value) {
      if (value?.length >= 3 ) return true
      return 'El apellido es obligatorio o es muy corto'
    },
    nroCarnet (value) {
      if (value?.length >= 3 ) return true
      return 'El documento de identidad es obligatorio o es muy corto'
    },
    email (value) {
      if (value?.length >= 3 ) return true
      return 'El apellido es obligatorio o es muy corto'
    },
    celular (value) {
      if (value?.length >= 3 ) return true
      return 'El apellido es obligatorio o es muy corto'
    },
    edad (value) {
      if (value?.length >= 3 ) return true
      return 'El apellido es obligatorio o es muy corto'
    },
    profesion (value) {
      if (value?.length >= 3 ) return true
      return 'El apellido es obligatorio o es muy corto'
    },
    ciudadR (value) {
      if (value?.length >= 3 ) return true
      return 'El apellido es obligatorio o es muy corto'
    },
    pretensionSal (value) {
      if (value?.length >= 3 ) return true
      return 'El apellido es obligatorio o es muy corto'
    },
    cuentasComp (value) {
      if (value?.length >= 2 ) return true
      return 'Dato requerido'
    },
    cuentasInt (value) {
      if (value?.length >= 2 ) return true
      return 'Dato requerido'
    },
    detalleTarjeta (value) {
      if (value?.length >= 2 ) return true
      return 'Dato requerido'
    },
    detalleFacebook (value) {
      if (value?.length >= 2 ) return true
      return 'Dato requerido'
    },
    comtExpArea (value) {
      if (value?.length >= 10 ) return true
      return 'El apellido es obligatorio o es muy corto'
    }
} 
  
export const fileSchema = {
  files (value) {
      if (value) return true
      return 'El archivo es obligatorio'
  },
}