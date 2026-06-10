function formatWhatsAppNumber(num) {
  let digits = String(num).replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '234' + digits.slice(1);
  if (digits.length === 10 && digits.startsWith('8')) digits = '234' + digits;
  return digits;
}

function buildWhatsAppUrl(number, text) {
  const digits = formatWhatsAppNumber(number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function absoluteListingUrl(req, carId) {
  const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:3000';
  const proto = req.get('x-forwarded-proto') || req.protocol || 'http';
  const webHost = host.replace(':3001', ':3000');
  return `${proto}://${webHost}/car/${carId}`;
}

function formatCarDetails(car, listingUrl) {
  const lines = [
    `🚗 *${car.title}*`,
    '',
    `*Make:* ${car.make}`,
    `*Model:* ${car.model}`,
    `*Year:* ${car.year}`,
    `*Body type:* ${car.body_type}`,
    `*Price:* ₦${Number(car.price).toLocaleString()}`,
    `*Status:* ${car.status === 'sold' ? 'Sold' : 'Available'}`
  ];
  if (car.mileage) lines.push(`*Mileage:* ${car.mileage.toLocaleString()} km`);
  if (car.fuel) lines.push(`*Fuel:* ${car.fuel}`);
  if (car.transmission) lines.push(`*Transmission:* ${car.transmission}`);
  if (car.description?.trim()) {
    lines.push('', `*Description:*`, car.description.trim());
  }
  if (listingUrl) lines.push('', `*View listing:* ${listingUrl}`);
  return lines.join('\n');
}

function buildCarInterestMessage(car, settings, listingUrl) {
  return [
    `🚗 *Rent request — ${settings.company_name}*`,
    '',
    formatCarDetails(car, listingUrl),
    '',
    '_Customer wants to rent this vehicle from your website._'
  ].join('\n');
}

function buildInquiryMessage(car, settings, listingUrl, { name, phone, dates, message }) {
  const lines = [
    `📩 *New booking inquiry — ${settings.company_name}*`,
    '',
    formatCarDetails(car, listingUrl),
    '',
    '— *Customer details* —',
    `*Name:* ${name.trim()}`,
    `*Phone:* ${phone.trim()}`
  ];
  if (dates?.trim()) lines.push(`*Dates / duration:* ${dates.trim()}`);
  if (message?.trim()) lines.push(`*Message:* ${message.trim()}`);
  lines.push('', '_Sent via website inquiry form_');
  return lines.join('\n');
}

function buildContactMessage(settings, { name, phone, email, subject, message }) {
  const lines = [
    `📬 *Contact form — ${settings.company_name}*`,
    '',
    `*Name:* ${name.trim()}`,
    `*Phone:* ${phone.trim()}`
  ];
  if (email?.trim()) lines.push(`*Email:* ${email.trim()}`);
  if (subject?.trim()) lines.push(`*Subject:* ${subject.trim()}`);
  if (message?.trim()) lines.push('', `*Message:*`, message.trim());
  lines.push('', '_Sent via website contact page_');
  return lines.join('\n');
}

module.exports = {
  formatWhatsAppNumber,
  buildWhatsAppUrl,
  absoluteListingUrl,
  formatCarDetails,
  buildCarInterestMessage,
  buildInquiryMessage,
  buildContactMessage
};
