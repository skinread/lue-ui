// Spike A fixture: a dialog containing a menu, as plain HTML. fixture.tsx builds the same DOM with the React
// adapters (checked in parity.browser.test.tsx).

export const html = /* html */ `
<main>
  <button type="button" command="show-modal" commandfor="project" class="lue-button" id="open-dialog">Edit project…</button>
  <dialog closedby="any" aria-labelledby="project-title" id="project" class="lue-dialog">
    <h2 id="project-title" class="lue-dialog__title">Edit project</h2>
    <p class="lue-dialog__body">Choose an action for this project.</p>
    <button type="button" aria-haspopup="menu" id="actions-button" command="toggle-popover" commandfor="actions" class="lue-button">Actions</button>
    <lue-menu id="actions" aria-labelledby="actions-button" popover="" role="menu" class="lue-menu">
      <button type="button" role="menuitem" tabindex="-1" class="lue-menu__item">Rename</button>
      <button type="button" role="menuitem" tabindex="-1" class="lue-menu__item">Duplicate</button>
      <button type="button" role="menuitem" tabindex="-1" class="lue-menu__item">Download</button>
      <button type="button" role="menuitem" tabindex="-1" class="lue-menu__item">Archive</button>
      <button type="button" role="menuitem" tabindex="-1" data-tone="critical" class="lue-menu__item">Delete</button>
    </lue-menu>
    <form method="dialog" class="lue-dialog__actions">
      <button value="cancel" class="lue-button" id="cancel">Cancel</button>
      <button value="save" class="lue-button" data-variant="primary">Save</button>
    </form>
  </dialog>
</main>`;

export const items = ['Rename', 'Duplicate', 'Download', 'Archive', 'Delete'];
