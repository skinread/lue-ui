// A server component: Button renders on the server; Checkout is a client island.
import { Button } from '@lue-ui/react';
import { Checkout } from './checkout';

export default function Page() {
  return (
    <main className="lue-wrap">
      <h1>Next fixture</h1>
      <Button variant="quiet">Server-rendered button</Button>
      <Checkout />
    </main>
  );
}
