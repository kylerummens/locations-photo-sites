import { getAccount } from "@/lib/db/accounts";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div>
      <div>Home Page</div>
      <Suspense fallback={<div>Loading Tenant...</div>}>
        <Tenant />
      </Suspense>
    </div>
  );
}

async function Tenant() {
  const account = (await getAccount())!;
  return <div>Account: {account.id}</div>;
}
