const fetch = require("node-fetch");

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

  const res = await fetch(url, {
    headers:{
      "User-Agent":`Wanderlust/1.0 (${process.env.GEOCODE_EMAIL})`

    }});

  const data = await res.json();

  if (!data || !data.length) {
    console.log("❌ No results from Nominatim for:", address);
    return null;
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
  };
}

module.exports = { geocodeAddress };