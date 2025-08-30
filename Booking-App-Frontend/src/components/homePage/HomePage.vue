<template>
    <div class="main-container">
        <section class="hello-section">
            <div class="image-section">
                <AppLogo class="app-logo" />
            </div>
            <div class="text-section">
                <h1>Zarezerwuj dowolną usługę</h1>
                <p>
                    W dowolnym momencie
                    Skontaktuj się z zaufanymi profesjonalistami w zakresie usług domowych,
                    naprawy, konserwacja i wiele więcej. Szybki, wielokrotnego użytku i
                    wygodny.
                </p>
                <div class="button-group">
                    <button class="custom-button">Znajdź usługi</button>
                    <button class="custom-button">Zostań usługodawcą</button>
                </div>
            </div>
        </section>

        <section class="popular-services">
            <h2>Popularne kategorie usług</h2>
            <p>Przeglądaj nasze najbardziej popularne kategorie usług</p>
            <div class="services-list">
                <div class="service-item">
                    <i class="fas fa-broom"></i> Sprzątanie
                </div>
                <div class="service-item">
                    <i class="fas fa-tools"></i> Naprawy domowe
                </div>
                <div class="service-item">
                    <i class="fas fa-seedling"></i> Usługi ogrodnicze
                </div>
                <div class="service-item">
                    <i class="fas fa-truck"></i> Transport i przeprowadzki
                </div>
                <div class="service-item">
                    <i class="fas fa-laptop-code"></i> Usługi IT
                </div>
                <div class="service-item">
                    <i class="fas fa-dog"></i> Opieka nad zwierzętami
                </div>
                <div class="service-item">
                    <i class="fas fa-cut"></i> Fryzjerstwo i uroda
                </div>
                <div class="service-item">
                    <i class="fas fa-book"></i> Korepetycje
                </div>
            </div>
        </section>

        <section class="how-it-works">
            <h2>Jak to działa</h2>
            <p>Rezerwacja usługi w trzech prostych krokach</p>
            <div class="steps-list">
                <div class="step-item">
                    <i class="fas fa-search"></i>
                    <h3>Krok 1: Znajdź usługę</h3>
                    <p>Przeglądaj kategorie i wybierz usługę, której potrzebujesz.</p>
                </div>
                <div class="step-item">
                    <i class="fas fa-calendar-check"></i>
                    <h3>Krok 2: Zarezerwuj termin</h3>
                    <p>Wybierz dogodny termin i zarezerwuj usługę online.</p>
                </div>
                <div class="step-item">
                    <i class="fas fa-thumbs-up"></i>
                    <h3>Krok 3: Ciesz się usługą</h3>
                    <p>Profesjonalista przyjdzie do Ciebie i wykona usługę na najwyższym poziomie.</p>
                </div>
            </div>
        </section>

        <section class="what-our-clients-say">
            <h2>Co mówią nasi klienci</h2>
            <p>Opinie od naszych zadowolonych klientów</p>

            <div class="testimonials-list">
                <div class="testimonial-item">
                    <p>"Świetna usługa! Profesjonalizm i punktualność na najwyższym poziomie."</p>
                    <h4>- Anna K.</h4>
                </div>
                <div class="testimonial-item">
                    <p>"Znalazłem dokładnie to, czego potrzebowałem. Szybko i bezproblemowo!"</p>
                    <h4>- Michał S.</h4>
                </div>
                <div class="testimonial-item">
                    <p>"Usługodawca był bardzo uprzejmy i wykonał świetną robotę. Polecam!"</p>
                    <h4>- Katarzyna W.</h4>
                </div>
            </div>
        </section>

    </div>
</template>

<style lang="scss" scoped>
@use "@/styles/commonStyles.scss" as *;

.main-container {
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.hello-section {
    display: flex;
    margin-top: 50px;
    flex-direction: row;

    .app-logo {
        transform: scale(1.3);
    }

    .text-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        text-align: left;

        h1 {
            font-size: 2rem;
            margin-bottom: 20px;
        }

        p {
            font-size: 1.1rem;

        }
    }

    .button-group {
        display: flex;
        gap: 20px;
    }

    .image-section {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        align-items: center;

        .text-section {
            align-items: center;
            text-align: center;
            padding: 0 20px;
            margin-top: 20px;
        }

        .app-logo {
            transform: scale(1.5);
            margin-top: 30px;
            margin-bottom: 30px;
        }
    }
}

.popular-services {
    padding-top: 30px;
    padding-bottom: 50px;
    background: linear-gradient(to right,
            transparent,
            rgba($primary, 0.1) 10%,
            rgba($primary, 0.1) 90%,
            transparent);

    .services-list {
        margin: 0px 30px;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    }

    .service-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: $white;
        padding: 20px;
        width: 150px;
        height: 50px;
        border-radius: 10px;
        box-shadow: 10px 10px 5px $shadow;

    }
}

.how-it-works {
    padding: 30px 0px;

    .steps-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    }

    .step-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: $white;
        padding: 20px;

        i {
            font-size: 1.5rem;
            color: $white;
            background-color: $primary;
            border: 1px solid transparent;
            border-radius: 999px;
            padding: 15px;
        }

        h3 {
            margin-top: 10px;
            margin-bottom: 10px;
        }

        p {
            text-align: center;
        }
    }
}

.what-our-clients-say {
    padding-top: 30px;
    padding-bottom: 50px;
    margin-bottom: 100px;
    background: linear-gradient(to right,
            transparent,
            rgba($primary, 0.1) 10%,
            rgba($primary, 0.1) 90%,
            transparent);

    .testimonials-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        margin: 0px 30px;
    }

    .testimonial-item {
        background-color: $white;
        padding: 20px;
        width: 300px;
        border-radius: 10px;
        box-shadow: 10px 10px 5px $shadow;

        p {
            font-style: italic;
            margin-bottom: 10px;
            text-align: left;
        }

        h4 {
            text-align: right;
            font-weight: normal;
            color: $primary;
        }
    }
}
</style>