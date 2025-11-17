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

    console.log("=== Supabase Auth Test ===");
    console.log("Supabase URL:", url);
    console.log("");

    // Test 1: Check if we can connect to Supabase
    console.log("Test 1: Connection test (fetching todos)");
    const { data: todosData, error: todosError } = await supabase
      .from("todos")
      .select("*")
      .limit(3);
    if (todosError) {
      console.error("❌ Error:", todosError.message);
    } else {
      console.log(
        "✅ Connection successful, todos found:",
        todosData?.length || 0
      );
    }
    console.log("");

    // Test 2: Check current session
    console.log("Test 2: Check current session");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("❌ Session error:", sessionError.message);
    } else if (session) {
      console.log("✅ Active session found for user:", session.user.email);
    } else {
      console.log("ℹ️  No active session");
    }
    console.log("");

    // Test 3: Try to sign in with test credentials (if provided via args)
    if (process.argv[2] && process.argv[3]) {
      const testEmail = process.argv[2];
      const testPassword = process.argv[3];

      console.log("Test 3: Testing login with provided credentials");
      console.log("Email:", testEmail);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        console.error("❌ Login failed:", error.message);
        console.log("Error details:", JSON.stringify(error, null, 2));
      } else {
        console.log("✅ Login successful!");
        console.log("User ID:", data.user?.id);
        console.log("User Email:", data.user?.email);

        // Sign out after test
        await supabase.auth.signOut();
        console.log("Signed out test user");
      }
    } else {
      console.log(
        "Test 3: Skipped (provide email and password as arguments to test login)"
      );
      console.log(
        "Usage: node scripts/test_auth.mjs your@email.com yourpassword"
      );
    }

    process.exit(0);
  } catch (e) {
    console.error("Unexpected error:", e);
    process.exit(1);
  }
})();
