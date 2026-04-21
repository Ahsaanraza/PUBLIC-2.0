import jsPDF from 'jspdf';

// ── Color palette matching e-invoice.html ──────────────────────────────────
const C = {
  brand:    [11,  26,  40],   // #0B1A28
  action:   [26,  68,  132],  // #1a4484
  muted:    [100, 116, 139],  // #64748b
  success:  [16,  185, 129],  // #10b981
  border:   [226, 232, 240],  // #e2e8f0
  bgSlate:  [248, 250, 252],  // #f8fafc (label backgrounds)
  bgOrange: [255, 251, 235],  // warning bg
  bdOrange: [253, 186, 116],  // warning border
  txOrange: [180, 83,  9],    // #b45309
  white:    [255, 255, 255],
};

const setColor  = (pdf, rgb) => pdf.setTextColor(...rgb);
const setFill   = (pdf, rgb) => pdf.setFillColor(...rgb);
const setStroke = (pdf, rgb) => pdf.setDrawColor(...rgb);

// Draw a horizontal divider line
const hLine = (pdf, x, y, w) => {
  setStroke(pdf, C.border);
  pdf.setLineWidth(0.25);
  pdf.line(x, y, x + w, y);
};

// ── SECTION HEADING ────────────────────────────────────────────────────────
const sectionHeading = (pdf, title, x, y) => {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  setColor(pdf, C.brand);
  pdf.text(title, x, y);
  return y + 4;
};

// ── KEY-VALUE ROW (customer / payment details) ─────────────────────────────
const kvRow = (pdf, key, value, x, y, contentW, opts = {}) => {
  const rowH  = 8;
  const kWide = contentW * 0.28;

  // Slate background for key cell
  setFill(pdf, C.bgSlate);
  setStroke(pdf, C.border);
  pdf.setLineWidth(0.1);
  pdf.rect(x, y, kWide, rowH, 'F');

  // Key label
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  setColor(pdf, C.muted);
  pdf.text(key, x + 2.5, y + 5.2);

  // Value
  if (opts.customDraw) {
    opts.customDraw(x + kWide + 3, y);
  } else {
    const valColor = opts.valueColor || C.brand;
    pdf.setFont('helvetica', opts.valueBold ? 'bold' : 'normal');
    pdf.setFontSize(8);
    setColor(pdf, valColor);
    pdf.text(value, x + kWide + 3, y + 5.2);
  }

  // Bottom border
  hLine(pdf, x, y + rowH, contentW);

  return y + rowH;
};

// ── TABLE HEADER ROW ───────────────────────────────────────────────────────
const tableHeader = (pdf, cols, x, y) => {
  const rowH = 7.5;
  let cx = x;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  setColor(pdf, C.muted);
  cols.forEach(col => {
    pdf.text(col.label, cx + 2, y + 4.5);
    cx += col.w;
  });
  hLine(pdf, x, y + rowH, cols.reduce((s, c) => s + c.w, 0));
  return y + rowH + 0.5;
};

// ── TABLE DATA ROW ─────────────────────────────────────────────────────────
const tableRow = (pdf, cols, values, x, y, { bold = false, upperCase = false, valueColor = C.brand } = {}) => {
  const rowH = 8.5;
  let cx = x;
  pdf.setFont('helvetica', bold ? 'bold' : 'normal');
  pdf.setFontSize(8);
  values.forEach((val, i) => {
    const col = cols[i];
    const txt = upperCase ? val.toString().toUpperCase() : val.toString();
    setColor(pdf, col.color || valueColor);
    pdf.text(txt, cx + 2, y + 5.5);
    cx += col.w;
  });
  hLine(pdf, x, y + rowH, cols.reduce((s, c) => s + c.w, 0));
  return y + rowH;
};

// ── CIRCULAR STAMP ─────────────────────────────────────────────────────────
const drawStamp = (pdf, cx, cy) => {
  const R  = 14;  // outer radius mm
  const Ri = 12.2;  // inner dashed circle radius

  // Outer solid circle
  setStroke(pdf, C.action);
  pdf.setLineWidth(0.6);
  pdf.circle(cx, cy, R, 'S');

  // Inner dashed circle
  pdf.setLineWidth(0.3);
  pdf.setLineDashPattern([1.0, 1.2], 0);
  pdf.circle(cx, cy, Ri, 'S');
  pdf.setLineDashPattern([], 0);

  // Curved text
  const text = 'SAER KARO TRAVEL & TOURS SMC PVT LTD';
  const chars = text.split('');
  
  const totalArc = Math.PI * 1.6; 
  const angStep = totalArc / chars.length;
  const startAng = -Math.PI / 2 - (totalArc / 2);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(3.8);
  setColor(pdf, C.action);

  chars.forEach((ch, i) => {
    const ang = startAng + (i + 0.5) * angStep;
    const tx  = cx + (Ri - 0.5) * Math.cos(ang);
    const ty  = cy + (Ri - 0.5) * Math.sin(ang);
    const rot = (ang * 180) / Math.PI + 90;
    pdf.text(ch, tx, ty, { angle: rot, align: 'center', baseline: 'middle' });
  });

  // "PAID" centre text
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  setColor(pdf, C.action);
  pdf.text('PAID', cx, cy + 1.2, { align: 'center' });
};

// ══════════════════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ══════════════════════════════════════════════════════════════════════════
export const generateReceiptPDF = (data) => {
  const {
    customerName, customerEmail, customerPhone,
    orderId, paymentMethod,
    flightDetails, passengers,
    orderTotal, amountPaid, date,
    bookingType,
  } = data;

  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  const PW      = 210;          // page width mm
  const ML      = 14;           // left margin
  const MR      = 14;           // right margin
  const W       = PW - ML - MR; // content width ≈ 182 mm
  let   y       = 14;           // current Y cursor

  // ── HEADER ─────────────────────────────────────────────────────────────
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  setColor(pdf, C.brand);
  pdf.text('Receipt', ML, y + 9);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  setColor(pdf, C.muted);
  pdf.text(`Date : ${date}`, ML, y + 16);

  const badgeH = 14;
  const badgeY = y;
  const badgeTextW = 38; 
  const badgeX = PW - MR - badgeTextW + 2; 

  setFill(pdf, C.action);
  pdf.setDrawColor(...C.action);
  pdf.setLineWidth(0);
  pdf.roundedRect(badgeX, badgeY, badgeTextW + 8, badgeH, 4, 4, 'F');
  pdf.rect(badgeX + badgeTextW, badgeY, 8, badgeH, 'F');
  pdf.rect(badgeX + badgeTextW + 4, badgeY, PW - (badgeX + badgeTextW + 4), badgeH, 'F');

  const iconX = badgeX + 5;
  const iconY = badgeY + 3.5;
  const iconSize = 7; 
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.6);
  pdf.line(iconX + 0.5, iconY + iconSize - 1.5, iconX + iconSize - 1, iconY + 0.5);
  pdf.line(iconX + iconSize * 0.3, iconY + iconSize * 0.5, iconX + iconSize * 0.6, iconY + iconSize * 0.15);
  pdf.line(iconX + 0.5, iconY + iconSize - 1.5, iconX + iconSize * 0.35, iconY + iconSize - 1);
  pdf.line(iconX, iconY + iconSize, iconX + iconSize * 0.7, iconY + iconSize);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text('saer.pk', iconX + iconSize + 2, badgeY + 9.5);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  setColor(pdf, C.muted);
  pdf.text('SAER KARO TRAVEL & TOURS SMC PVT LIMITED', PW - MR, y + 22, { align: 'right' });

  y += 29;

  // ── WARNING BANNER ────────────────────────────────────────────────────
  const warnText = bookingType === 'umrah'
    ? 'THIS IS A PAYMENT RECEIPT. UMRAH E-TICKET WILL BE ISSUED SEPARATELY.'
    : 'THIS IS NOT THE E-TICKET!';
  setFill(pdf, C.bgOrange);
  setStroke(pdf, C.bdOrange);
  pdf.setLineWidth(0.3);
  pdf.rect(ML, y, W, 9, 'FD');
  setFill(pdf, C.txOrange);
  pdf.setDrawColor(...C.txOrange);
  pdf.circle(ML + 5, y + 4.5, 2.1, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(255, 255, 255);
  pdf.text('!', ML + 5, y + 5.6, { align: 'center' });
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  setColor(pdf, C.txOrange);
  pdf.text(warnText, ML + 11, y + 5.7);
  y += 14;

  // ── CUSTOMER DETAILS ─────────────────────────────────────────────────
  y = sectionHeading(pdf, 'CUSTOMER DETAILS', ML, y);
  hLine(pdf, ML, y, W);
  y += 0.5;
  y = kvRow(pdf, 'Name',           customerName,  ML, y, W);
  y = kvRow(pdf, 'Email',          customerEmail, ML, y, W);
  y = kvRow(pdf, 'Contact Number', customerPhone, ML, y, W);
  y += 8;

  // ── PAYMENT DETAILS (TOP) ────────────────────────────────────────────
  y = sectionHeading(pdf, 'PAYMENT DETAILS', ML, y);
  hLine(pdf, ML, y, W);
  y += 0.5;
  y = kvRow(pdf, 'Order ID', orderId,       ML, y, W);
  y = kvRow(pdf, 'Method',   paymentMethod, ML, y, W);
  y = kvRow(pdf, 'Status', '', ML, y, W, {
    customDraw: (vx, vy) => {
      // Small green circle - radius 1.5mm matches HTML w-4 h-4 scale
      setFill(pdf, C.success);
      pdf.circle(vx + 2.5, vy + 4, 1.5, 'F');
      // 'v' renders in Helvetica as a passable checkmark
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.5);
      pdf.setTextColor(255, 255, 255);
      pdf.text('v', vx + 1.7, vy + 5);
      // "Confirmed" text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      setColor(pdf, C.success);
      pdf.text('Confirmed', vx + 7, vy + 5.2);
    },
  });
  y += 8;

  // ── FLIGHT / PACKAGE DETAILS ─────────────────────────────────────────
  const flightTitle = bookingType === 'umrah' ? 'PACKAGE DETAILS' : 'FLIGHT DETAILS';
  y = sectionHeading(pdf, flightTitle, ML, y);
  hLine(pdf, ML, y, W);
  y += 0.5;
  const fCols = [
    { label: bookingType === 'umrah' ? 'Package' : 'Outbound Flight', w: 42, color: C.brand },
    { label: 'Depart',  w: 40, color: C.brand },
    { label: 'Arrive',  w: 40, color: C.brand },
    { label: 'Class',   w: 30, color: C.brand },
    { label: 'Flight',  w: 30, color: C.brand },
  ];
  y = tableHeader(pdf, fCols, ML, y);
  y = tableRow(pdf, fCols, [
    flightDetails.route,
    flightDetails.depart,
    flightDetails.arrive,
    flightDetails.class,
    flightDetails.flightNo,
  ], ML, y);
  y += 8;

  // ── PASSENGER DETAILS ─────────────────────────────────────────────────
  y = sectionHeading(pdf, 'PASSENGER DETAILS', ML, y);
  hLine(pdf, ML, y, W);
  y += 0.5;
  const pCols = [
    { label: 'Passenger Name', w: 65,  color: C.brand },
    { label: 'Ticket Number',  w: 62,  color: C.muted },
    { label: 'Baggage',        w: 55,  color: C.muted },
  ];
  y = tableHeader(pdf, pCols, ML, y);
  passengers.forEach(p => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    setColor(pdf, C.brand);
    pdf.text(p.name.toUpperCase(), ML + 2, y + 5.5);
    pdf.setFont('helvetica', 'normal');
    setColor(pdf, C.muted);
    pdf.text(p.ticketNo, ML + 65 + 2, y + 5.5);
    pdf.text(p.baggage.toUpperCase(), ML + 65 + 62 + 2, y + 5.5);
    hLine(pdf, ML, y + 8.5, W);
    y += 8.5;
  });
  y += 8;

  // ── PAYMENT DETAILS SUMMARY (bottom) ─────────────────────────────────
  y = sectionHeading(pdf, 'PAYMENT DETAILS', ML, y);
  hLine(pdf, ML, y, W);
  y += 0.5;
  [
    ['Payment Method', paymentMethod],
    ['Order Total',    `PKR ${orderTotal}`],
    ['Amount Paid',    `PKR ${amountPaid}`],
  ].forEach(([k, v], i) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    setColor(pdf, C.muted);
    pdf.text(k, ML + 2, y + 5.5);
    setColor(pdf, C.brand);
    pdf.text(v, ML + 68 + 2, y + 5.5);
    hLine(pdf, ML, y + 8.5, W);
    y += 8.5;
  });

  y += 14;

  // ── FOOTER ────────────────────────────────────────────────────────────
  hLine(pdf, ML, y, W);
  y += 10;

  // Circle stamp
  const stampCX = ML + 18;
  const stampCY = y + 17;
  pdf.saveGraphicsState();
  drawStamp(pdf, stampCX, stampCY);
  pdf.restoreGraphicsState();

  // Support info content layout
  const colBaseY = y;
  const rightAlignX = PW - MR;

  // Left Support Group — start right after stamp (stamp ends around ML+36=50mm)
  const supportL = ML + 50;

  // ── Headphones Icon: squared ⊓ shape ──
  const hpX = supportL;
  const hpY = colBaseY + 3;
  setStroke(pdf, C.muted);
  pdf.setLineWidth(0.4);
  // Top horizontal headband
  pdf.line(hpX,     hpY + 1.5, hpX + 3.5, hpY + 1.5);
  // Left vertical stem
  pdf.line(hpX,     hpY + 1.5, hpX,       hpY + 4.5);
  // Right vertical stem
  pdf.line(hpX + 3.5, hpY + 1.5, hpX + 3.5, hpY + 4.5);
  // Left earpiece (small rounded rect)
  pdf.rect(hpX - 0.7, hpY + 3.5, 1.4, 1.4, 'S');
  // Right earpiece
  pdf.rect(hpX + 2.8, hpY + 3.5, 1.4, 1.4, 'S');

  // "24/7" on same line as icon
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  setColor(pdf, C.muted);
  pdf.text('24/7', hpX + 5.5, colBaseY + 7);

  // "Customer Support" label below
  pdf.text('Customer Support', hpX, colBaseY + 12);

  // Bold phone number
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  setColor(pdf, C.brand);
  pdf.text('021-111-172-782', hpX, colBaseY + 17.5);

  // ── Right column: Email ──
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  setColor(pdf, C.muted);
  pdf.text('Customer Support Email', rightAlignX, colBaseY + 7, { align: 'right' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  setColor(pdf, C.brand);
  pdf.text('support@saer.pk', rightAlignX, colBaseY + 12.5, { align: 'right' });

  // ── SAVE ───────────────────────────────────────────────────────────────
  pdf.save(`saerpk-receipt-${orderId}.pdf`);
};

