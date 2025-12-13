import { component$ } from "@builder.io/qwik";
import styles from "./footer.module.css";

export default component$(() => {
  return (
    <footer>
      <div class="container">
        <a
          href="https://github.com/gimoring/ssgoi"
          target="_blank"
          class={styles.anchor}
        >
          <span>SSGOI - Page Transitions for Web</span>
        </a>
      </div>
    </footer>
  );
});
