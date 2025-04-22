<template>
    <div class="main">
      <section class="first-column">
        <div class="photo-container"></div>
  
        <div class="title-container">
          <h1 class="bussines-name">Title</h1>
          <button class="fav-button custom-button">Favorites</button>
        </div>
  
        <p class="localization">Międzyrzec Podlaski</p>
  
        <section class="services">
          <h2>Usługi</h2>
          <div class="service-item" v-for="i in 10" :key="i">
            <h3 class="">Strzyżenie włosów</h3>
            <div class="service-buy">
              <h3 class="service-price">30zł</h3>
              <button class="service-buy-button custom-button">Umów</button>
            </div>
          </div>
        </section>
  
        <section class="reviews">
          <!-- Recenzje -->
        </section>
      </section>
  
      <section class="second-column">
        <section>Adres(mapa)</section>
        <section>Godziny otwarcia</section>
        <section>Dane kontaktowe</section>
        <section>Jakies info</section>
        <section>
          FOR OWNER ONLY
          button delete
          button edit
        </section>
      </section>

    </div>
  </template>
  

<script setup>

</script>

<style lang="scss" scoped>
    @use "@/styles/commonStyles.scss" as *;
    .main {
        display: flex;
        justify-content: center;
        flex-direction: row;
        width: 100vw;
        padding: 20px;
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .first-column {
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-right: 3px solid $primary;
        padding-right: 20px;
    }

    .photo-container {
        width: 100%;
        height: 500px;
        background-image: url('@/assets/Graphics/logo_callendar_TermiNow.svg');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }


    .title-container {
        display: flex;
        width: 100%;
        height: auto;
    }
    
    .bussines-name {
        font-size: 30px;
        font-weight: bold;
        margin-left: 10px;
    }
    
    .fav-button {
        margin-left: auto;
        margin-right: 10px;
    }
    
    .localization {
        font-size: 15px;
        font-weight: italic;
        margin-left: 10px;
        text-align: left;
    }

    .services {
        display: flex;
        flex-direction: column;
        gap: 20px;
        text-align: left;
        margin: 10px;
    }

    .service-item {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid $primary;
    }

    .service-name {

    }
    
    .service-buy {
        display: flex;
        flex-direction: row;
        margin-left: auto;
        gap: 20px;
    }

    .service-price {

    }

    .service-buy-button {

    }

    .second-column {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-left: 20px;
        gap: 100px;
    }
</style>