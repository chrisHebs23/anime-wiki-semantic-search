export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
      return Response.json(
        { error: "API_URL is not configured" },
        { status: 500 }
      );
    }

    const upstream = await fetch(`${apiUrl}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    return Response.json(data, { status: upstream.status });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Proxy request failed",
      },
      { status: 502 }
    );
  }
}
