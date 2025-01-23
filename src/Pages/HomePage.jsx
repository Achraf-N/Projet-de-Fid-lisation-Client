import styles from "./Homepage.module.css";
import { Link } from "react-router-dom";
import PageNav from "../Components/PageNav";
export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          Je projette de fidéliser les utilisateurs pour un produit de crème
          solaire.
        </h1>
        <h2>
          Protégez votre peau tout en profitant de vos aventures sous le soleil.
          Une protection fiable pour ne jamais compromettre vos moments
          inoubliables à travers le monde.
        </h2>
        <Link to="/login" className="cta">
          Click ICI
        </Link>
      </section>
    </main>
  );
}
