export async function GET() {
  return Response.json({
    ok: true,
    service: "pek-proxy",
    time: new Date().toISOString()
  });
}
