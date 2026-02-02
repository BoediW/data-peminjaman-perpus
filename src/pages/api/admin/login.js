export const POST = async ({ request }) => {
  try {
    const { username, password } = await request.json();
    const envUser = import.meta.env.username || process.env.username; // Astro env vars or generic process.env
    const envPass = import.meta.env.password || process.env.password;

    // Validation against environment variables
    if (username === envUser && password === envPass) {
      return new Response(
        JSON.stringify({
          token: "admin-jwt-token-placeholder",
          admin: { username: envUser, name: "Admin" },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({ error: "Username atau password salah" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
