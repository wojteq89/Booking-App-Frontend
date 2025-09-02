<template>
    <div class="main-container">
        <!-- <div class="test-page">
            <h1>Test Page</h1>
            <p>This is a test page component.</p>
        </div> -->
        <CallendarComp />
    </div>
</template>

<script setup>
import CallendarComp from '../bussines/CallendarComp.vue';
</script>

<style>
.main-container {
    width: 100vh;

    @media (max-width: 968px) {
        width: auto;
    }
}
</style>