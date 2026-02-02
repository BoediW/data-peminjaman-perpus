export const prerender = false;

export const POST = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    const envUser =
      import.meta.env.ADMIN_USERNAME || process.env.ADMIN_USERNAME;
    const envPass =
      import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

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
