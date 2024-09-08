import { cookies } from "next/headers";
import { LoginComponent } from "./frontend/components/login-component";
import { redirect } from "next/navigation";

export default function Home() {
  const token = cookies().get('token');

  if (token?.value) {
    redirect('/home')
  } else {
    return <LoginComponent />
  }
}
