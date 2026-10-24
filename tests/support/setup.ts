// Setup for the browser projects. Keys go to the page's focused frame. Test files run in frames of one page, and on a
// busy machine Firefox can leave focus on the outer page, so a key pressed after element.focus() lands elsewhere. In
// Firefox, each test and every key press first focus the test's frame from the outer page (keeping the focused element inside).
// Not in Chromium or WebKit: there that is a focus change of its own (it closes an open menu, for one), and they
// don't lose the frame's focus.
import { beforeEach } from 'vitest';
import { commands, server, userEvent } from 'vitest/browser';

if (server.browser === 'firefox') {
  // Before each test too: element.focus() in a frame without focus can be dropped, and no later key press brings it back.
  beforeEach(() => commands.focusTestFrame());
  const { keyboard, tab } = userEvent;
  userEvent.keyboard = async (text) => {
    await commands.focusTestFrame();
    return keyboard.call(userEvent, text);
  };
  userEvent.tab = async (options) => {
    await commands.focusTestFrame();
    return tab.call(userEvent, options);
  };
}
