import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import styles from './AnnualLeaveCalculatorCard.module.scss';

export default function AnnualLeaveCalculatorCard() {
  return (
    <Card className={styles.card}>
      <form className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Your email</Label>
          </div>
          <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1">Your password</Label>
          </div>
          <TextInput id="password1" type="password" required />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        a<Button type="submit">Submit</Button>
      </form>
    </Card>
  );
}
