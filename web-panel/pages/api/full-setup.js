// web-panel/pages/api/full-setup.js
import { adminClient } from "../../lib/serverClient";
import fs from "node:fs";
import path from "node:path";

const files = [
  path.join(process.cwd(), "..", "sql", "submission_drafts.sql"),
  path.join(process.cwd(), "..", "sql", "reports.sql"),
  path.join(process.cwd(), "..", "sql", "subscriptions.sql"),
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const db = adminClient();

  try {
    for (const f of files) {
      const sql = fs.readFileSync(f, "utf8");
      // Ejecuta con RPC exec_sql (debes crearla una vez en tu proyecto).
      const { error } = await db.rpc("exec_sql", { sql_text: sql }).single().catch(() => ({ error: { message: "Define RPC exec_sql first" } }));
      if (error) throw new Error(`${path.basename(f)}: ${error.message}`);
    }
    return res.redirect("/");
  } catch (e) {
    return res.status(500).send("Setup error: " + (e?.message || e));
  }
}
