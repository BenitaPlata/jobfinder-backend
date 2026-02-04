/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula Haversine
 * @param {Object} coords1 - Primer punto {lat, lng}
 * @param {Object} coords2 - Segundo punto {lat, lng}
 * @returns {Number} Distancia en kilómetros (redondeada a 1 decimal)
 */
const calculateDistance = (coords1, coords2) => {
  if (
    !coords1 ||
    !coords2 ||
    !coords1.lat ||
    !coords1.lng ||
    !coords2.lat ||
    !coords2.lng
  ) {
    return null;
  }

  const R = 6371; // Radio de la Tierra en kilómetros

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLng = toRad(coords2.lng - coords1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) *
      Math.cos(toRad(coords2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Redondear a 1 decimal
};

/**
 * Convierte grados a radianes
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

module.exports = { calculateDistance };