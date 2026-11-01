'use client';
// A client component using the hooks and the element-backed Menu, from @lue-ui/react's built dist.
import {
  Button,
  Dialog,
  DialogTrigger,
  ErrorSummary,
  Field,
  LueElements,
  Menu,
  MenuItem,
  MenuTrigger,
  Select,
  TextInput,
  useValidation,
} from '@lue-ui/react';

export function Checkout() {
  const { formProps, summaryProps, errorFor } = useValidation((event) => event.preventDefault());
  return (
    <>
      <LueElements />
      <form {...formProps}>
        <ErrorSummary {...summaryProps} />
        <Field label="Email address" controlId="email" error={errorFor('email')}>
          <TextInput type="email" autoComplete="email" required />
        </Field>
        <Field label="Delivery" controlId="delivery" error={errorFor('delivery')}>
          <Select required defaultValue="">
            <option value="">Choose…</option>
            <option value="standard">Standard</option>
          </Select>
        </Field>
        <Button type="submit" variant="primary">Continue</Button>
      </form>
      <DialogTrigger dialog="help">Help</DialogTrigger>
      <Dialog id="help" aria-labelledby="help-title">
        <h2 className="lue-dialog__title" id="help-title">Help</h2>
        <MenuTrigger menu="topics" id="topics-button">Topics</MenuTrigger>
        <Menu id="topics" aria-labelledby="topics-button">
          <MenuItem>Delivery</MenuItem>
          <MenuItem>Returns</MenuItem>
        </Menu>
      </Dialog>
    </>
  );
}
