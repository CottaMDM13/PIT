import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import style from "./Home.module.css";

const Home = () => {
  return (
    <div className={style.home}>
      <Header />
      <main className={style.homeContent}>
        <section className={style.homeIntro}>
          <h1>Bem-vindo</h1>
          <p>Descubra sabores incríveis com o melhor da tecnologia gastronômica.</p>
        </section>

        <section className={style.homeFeatures}>
          <div className={style.feature}>
            <h2>Cardápio Variado</h2>
            <p>Pratos deliciosos preparados com ingredientes frescos e selecionados.</p>
          </div>
          <div className={style.feature}>
            <h2>Carrinho</h2>
            <p>Acesso o carrinho e veja todos os itens pedidos e seus valores.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
