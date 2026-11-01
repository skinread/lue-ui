// Markup for the emulation tests: one of each material the contrast layer changes, plus a page of blocks for reflow.
export const html = `
<div id="page">
  <header class="lue-site-header">
    <nav class="lue-site-header__bar" aria-label="Main">
      <a class="lue-wordmark" href="#">Lue</a>
      <ul>
        <li><a class="lue-site-header__link" href="#" aria-current="page">Work</a></li>
        <li><a class="lue-site-header__link" href="#">Journal</a></li>
        <li><a class="lue-site-header__link" href="#">About</a></li>
      </ul>
    </nav>
  </header>
  <main class="lue-wrap">
    <section class="lue-hero">
      <div class="lue-hero__grid">
        <div class="lue-hero__text">
          <h1 class="lue-display">Interfaces that hold their light</h1>
          <p class="lue-lede">Surfaces stay neutral; colour arrives as light, gathered at an edge.</p>
          <div class="lue-actions">
            <button type="button" class="lue-button" data-variant="primary" id="primary">Continue to payment</button>
            <button type="button" class="lue-button" id="secondary">Save for later</button>
          </div>
        </div>
      </div>
    </section>
    <div class="lue-grid">
      <article class="lue-card" id="card"><h2 class="lue-h3">Card</h2><p>Overlay glass.</p></article>
      <article class="lue-card"><h2 class="lue-h3">Another card</h2><p>With a longer line of text that has to wrap at 320 pixels.</p></article>
    </div>
    <form class="lue-cta">
      <div class="lue-field">
        <label class="lue-field__label" for="email">Email address</label>
        <input class="lue-input" id="email" type="email" autocomplete="email">
      </div>
      <div class="lue-field">
        <label class="lue-field__label" for="notes">Notes</label>
        <textarea class="lue-textarea" id="notes"></textarea>
      </div>
      <div class="lue-select-wrap">
        <select class="lue-select" id="size" aria-label="Size"><option>Medium</option></select>
      </div>
      <label class="lue-choice"><input class="lue-switch" type="checkbox" role="switch" id="switch" checked> Notifications</label>
      <label class="lue-choice"><input class="lue-checkbox" type="checkbox" id="check" checked> Remember me</label>
      <button type="submit" class="lue-button" data-variant="primary">Subscribe</button>
    </form>
    <section data-theme="dark" id="dark-island" class="lue-glass">Dark island</section>
    <svg class="lue-icon" data-mirror id="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12"/></svg>
  </main>
</div>`;
