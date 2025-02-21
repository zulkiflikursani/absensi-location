import { Suspense } from "react";
import SignIn from "./LoginForm";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <p>Loading...</p>
    </div>
  );
}
export function SignInWithSuspense() {
  return (
    <Suspense fallback={<Loading />}>
      <SignIn />
    </Suspense>
  );
}
