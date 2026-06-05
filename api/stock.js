export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'YPF.BA' } = req.query;
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; finanzas-bot/1.0)' } }
    );
    const data = await r.json();
    const meta = data.chart.result[0].meta;
    res.json({
      symbol,
      price:     meta.regularMarketPrice,
      prevClose: meta.chartPreviousClose,
      change:    meta.regularMarketPrice - meta.chartPreviousClose,
      changePct: ((meta.regularMarketPrice / meta.chartPreviousClose) - 1) * 100,
      currency:  meta.currency,
      market:    meta.marketState,
    });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo obtener el precio', detail: e.message });
  }
}
