import fs from "fs";
import path from "path";

function parseDotEnv(content) {
  const res = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Strip optional quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    res[key] = val;
  }
  return res;
}

(async () => {
  try {
    const repoRoot = path.resolve(process.cwd());
    const envPath = path.join(repoRoot, ".env.local");
    if (!fs.existsSync(envPath)) {
      console.error(".env.local not found at", envPath);
      process.exit(2);
    }
    const raw = fs.readFileSync(envPath, "utf8");
    const env = parseDotEnv(raw);
    const url = env.VITE_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.VITE_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.error(
        "Supabase URL/KEY not found in .env.local (looked for VITE_* and NEXT_PUBLIC_*)"
      );
      process.exit(2);
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    console.log("Connecting to Supabase:", url);
    const { data, error } = await supabase.from("todos").select("*").limit(10);
    if (error) {
      console.error("Error selecting from todos:", error);
      process.exit(1);
    }
    console.log("todos rows (up to 10):", data);
    process.exit(0);
  } catch (e) {
    console.error("Unexpected error:", e);
    process.exit(1);
  }
})();
