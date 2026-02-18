function num(v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

export async function GET() {
  return Response.json({
    ok: true,
    hint: "Use POST",
    example: {
      toCity: "Москва",
      weightKg: 10,
      lengthCm: 100,
      widthCm: 40,
      heightCm: 10,
      mode: "terminal"
    }
  });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const weightKg = num(body.weightKg);
    const lengthCm = num(body.lengthCm);
    const widthCm  = num(body.widthCm);
    const heightCm = num(body.heightCm);

    const toCity = (body.toCity || "").trim();
    const toZip  = (body.toZip || "").trim();
    const mode   = (body.mode || "terminal").trim();

    if (!weightKg || (!toCity && !toZip)) {
      return Response.json(
        { ok: false, error: "weightKg и город/индекс обязательны" },
        { status: 400 }
      );
    }

    const volumeM3 = (lengthCm * widthCm * heightCm) / 1_000_000;
    const base = 500;
    const price =
      Math.round(
        base +
        weightKg * 25 +
        volumeM3 * 900 +
        (mode === "door" ? 350 : 0)
      );

    const days = mode === "door" ? 4 : 3;

    return Response.json({
      ok: true,
      price,
      days
    });

  } catch (e) {
    return Response.json(
      { ok: false, error: "Server error", details: String(e) },
      { status: 500 }
    );
  }
}
