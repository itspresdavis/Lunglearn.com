import { resourceCounts } from "@/lib/catalog";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export default async function AdminHome() {
  const session = await currentSession();
  const counts = resourceCounts();
  const users = session?.user.role === "admin" || session?.user.role === "support" ? getStore().users() : [];
  return (
    <div>
      <h1>Control center</h1>
      <p>Content counts are the records in this build, not a plan.</p>
      <h2>Environment switches</h2>
      <ul>
        <li>Stripe secret: {process.env.STRIPE_SECRET_KEY ? "set" : "not set"}</li>
        <li>Stripe webhook secret: {process.env.STRIPE_WEBHOOK_SECRET ? "set" : "not set"}</li>
        <li>Tutor endpoint: {process.env.AI_TUTOR_URL ? "set" : "not set"}</li>
        <li>Encryption key: {process.env.APP_ENCRYPTION_KEY ? "set" : "not set"}</li>
      </ul>
      <ul>
        {Object.entries(counts).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      {users.length ? (
        <>
          <h2>Accounts</h2>
          <table>
            <thead><tr><th>Email</th><th>Role</th><th>Authenticator</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}><td>{user.email}</td><td>{user.role}</td><td>{user.mfaEnabled ? "on" : "off"}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      ) : <p>Account lists are limited to administrators and support.</p>}
    </div>
  );
}
