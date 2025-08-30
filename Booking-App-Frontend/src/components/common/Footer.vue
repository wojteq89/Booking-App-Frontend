<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <div>
            <AppLogo class="app-logo" />
        </div>
        <p class="footer-desc">Rezerwuj usługi szybko i wygodnie!</p>
      </div>
      <ul class="footer-links">
        <li><a href="#">O nas</a></li>
        <li><a href="#">Kontakt</a></li>
        <li><a href="#">Regulamin</a></li>
        <li><a href="#">Polityka prywatności</a></li>
      </ul>
    </div>
    <div class="footer-bottom">
      &copy; {{ new Date().getFullYear() }} TermiNow. Wszelkie prawa zastrzeżone.
    </div>
  </footer>
</template>

<script setup>
import AppLogo from '@/components/common/AppLogo.vue';
</script>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.footer {
  width: 100%;
  background-color: $primary;
  color: $white;
  padding: 32px 0 12px 0;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .footer-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 90%;
    max-width: 1200px;
    margin-bottom: 12px;

    @media (max-width: 700px) {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
    }
  }

  .footer-brand {
    display: flex;
    flex-direction: column;

    .app-logo {
      background-color: white;
      padding: 20px;
    }
    .footer-desc {
      font-size: 1rem;
      margin-top: 4px;
      color: $white;
    }
  }

  .footer-links {
    list-style: none;
    display: flex;
    flex-direction: row;
    gap: 24px;
    padding: 0;
    margin: 0;

    li a {
      color: $white;
      text-decoration: none;
      transition: color 0.2s;
      &:hover {
        color: red;
        text-decoration: underline;
      }
    }

    @media (max-width: 700px) {
      flex-direction: column;
      gap: 8px;
    }
  }

  .footer-bottom {
    width: 100%;
    text-align: center;
    font-size: 0.95rem;
    color: $white;
    margin-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 8px;
  }
}
</style>