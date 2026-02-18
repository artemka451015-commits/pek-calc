module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.json({ status: 'OK', service: 'PEK Calculator' });
  }
  
  if (req.method === 'POST') {
    try {
      const { city, weight = 1 } = req.body;
      
      if (!city || city.length < 2) {
        return res.json({ error: 'Укажите город', price: null });
      }
      
      const PEK_KEY = 'A512306B7F9C1141A85AC978044CC7765DF22686';
      
      const cityRes = await fetch(
        'https://api.pecom.ru/v1/cities?name=' + encodeURIComponent(city),
        { 
          headers: { 
            'Authorization': 'Bearer ' + PEK_KEY, 
            'Content-Type': 'application/json' 
          } 
        }
      );
      
      const cityData = await cityRes.json();
      
      if (!cityData.items || cityData.items.length === 0) {
        return res.json({ error: 'Город не найден', price: null });
      }
      
      const cityId = cityData.items[0].id;
      
      const calcRes = await fetch('https://api.pecom.ru/v1/calculate', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + PEK_KEY, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          sender_city_id: 86,
          receiver_city_id: cityId,
          weight: parseFloat(weight),
          places: [{ weight: parseFloat(weight), volume: 0.001 }]
        })
      });
      
      const calcData = await calcRes.json();
      
      return res.json({
        price: calcData.price,
        days: calcData.transit_days || '2-4',
        city: cityData.items[0].name
      });
      
    } catch (err) {
      return res.json({ error: err.message, price: null });
    }
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};
