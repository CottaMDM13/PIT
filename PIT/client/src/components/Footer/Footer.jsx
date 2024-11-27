import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>Sobre Nós</h4>
          <p>O TapToOrder foi desenvolvido para transformar sua experiência no restaurante em algo prático e inovador. Com nossa plataforma, você pode visualizar o cardápio, fazer pedidos diretamente da sua mesa e até mesmo realizar o pagamento com apenas um toque. Nosso objetivo é facilitar cada etapa da sua visita, permitindo que você aproveite ao máximo a experiência gastronômica, sem preocupações!</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Contato</h4>
          <p>Email: contato@taptoorder.com</p>
          <p>Telefone: (31) 3541-9678</p>
          <p>Endereço: Colégio Cotemig,  Belo Horizonte</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} TapToOrder. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
