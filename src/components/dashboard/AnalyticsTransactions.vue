<script setup>
const statistics = [
  {
    title: 'Ventas',
    stats: '245k',
    icon: 'mdi-chart-pie',
    color: 'primary',
  },
  {
    title: 'Clientes',
    stats: '12.5k',
    icon: 'mdi-account-multiple',
    color: 'success',
  },
  {
    title: 'Producto',
    stats: '1.54k',
    icon: 'mdi-laptop-mac',
    color: 'warning',
  },
  {
    title: 'Ganancia',
    stats: '$88k',
    icon: 'mdi-cash-usd',
    color: 'info',
  },
]
</script>

<template>
  <VCard title="Actas">
    <template #subtitle>
      <p class="text-body-1 mb-0">
        <span class="d-inline-block font-weight-medium text-high-emphasis">Crecimiento total del 48,5%</span> <span class="text-high-emphasis"></span> este mes
      </p>
    </template>

    <template #append>
      <IconBtn class="mt-n5">
        <VIcon
          color="high-emphasis"
          icon="ri-more-2-line"
        />
      </IconBtn>
    </template>

    <VCardText class="pt-10">
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="12"
          sm="6"
          md="3"
        >
          <div class="d-flex align-center gap-x-3">
            <VAvatar
              :color="item.color"
              rounded
              size="40"
              class="elevation-2"
            >
              <VIcon
                size="24"
                :icon="item.icon"
              />
            </VAvatar>

            <div class="d-flex flex-column">
              <div class="text-body-1">
                {{ item.title }}
              </div>
              <h5 class="text-h5">
                {{ item.stats }}
              </h5>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
