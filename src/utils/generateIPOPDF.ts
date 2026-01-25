import { IPODetail } from "@/types/ipo";
import { formatCurrency, formatPercent } from "@/lib/api";

export async function generateIPOPDF(ipo: IPODetail, status: string): Promise<void> {
  const jsPDF = (await import("jspdf")).default;
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  const primaryColor: [number, number, number] = [16, 185, 129]; // emerald-500
  const textColor: [number, number, number] = [30, 41, 59]; // slate-800
  const mutedColor: [number, number, number] = [100, 116, 139]; // slate-500

  const basicInfo = ipo.basic_info;
  const timeline = ipo.ipo_timeline;
  const gmpData = ipo.gmp_data;
  const issuePrice = parseFloat(basicInfo["Issue Price"]?.replace(/[^\d.]/g, "") || "0");
  const lotSize = parseInt(basicInfo["Lot Size"]?.replace(/[^\d]/g, "") || "0");

  // Header with branding
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 25, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("IPO Research Report", margin, 16);

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, pageWidth - margin, 16, { align: "right" });

  y = 35;

  // IPO Name and Status
  pdf.setTextColor(...textColor);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text(basicInfo["IPO Name"], margin, y);

  // Status badge
  const statusColors: Record<string, [number, number, number]> = {
    open: [16, 185, 129],
    closed: [239, 68, 68],
    upcoming: [59, 130, 246],
    listed: [100, 116, 139],
  };
  const statusColor = statusColors[status.toLowerCase()] || mutedColor;
  pdf.setFillColor(...statusColor);
  const statusText = status.toUpperCase();
  const statusWidth = pdf.getTextWidth(statusText) + 8;
  pdf.roundedRect(pageWidth - margin - statusWidth, y - 6, statusWidth, 9, 2, 2, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text(statusText, pageWidth - margin - statusWidth + 4, y - 0.5);

  y += 8;
  pdf.setTextColor(...mutedColor);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`${basicInfo["Listing At"]} • ${ipo.ipo_type.toUpperCase()} • ${basicInfo["Issue Type"] || "Book Built"}`, margin, y);

  y += 15;

  // Vital Statistics Section
  pdf.setTextColor(...textColor);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("VITAL STATISTICS", margin, y);
  y += 8;

  // Stats grid
  const stats = [
    ["Issue Price", basicInfo["Issue Price"] || "—"],
    ["Lot Size", basicInfo["Lot Size"] || "—"],
    ["Issue Size", basicInfo["Total Issue Size"] || "—"],
    ["Price Band", basicInfo["Price Band"] || "—"],
    ["Face Value", basicInfo["Face Value"] || "—"],
    ["Fresh Issue", basicInfo["Fresh Issue"] || "—"],
    ["OFS", basicInfo["Offer for Sale"] || "—"],
    ["ISIN", basicInfo["ISIN"] || "—"],
  ];

  const colWidth = contentWidth / 4;
  const rowHeight = 18;

  stats.forEach((stat, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const x = margin + col * colWidth;
    const yPos = y + row * rowHeight;

    // Background
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(x, yPos, colWidth - 3, rowHeight - 3, 2, 2, "F");

    // Label
    pdf.setTextColor(...mutedColor);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(stat[0], x + 4, yPos + 6);

    // Value
    pdf.setTextColor(...textColor);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    const valueText = String(stat[1] || "—");
    const displayText = valueText.length > 15 ? valueText.substring(0, 15) + "..." : valueText;
    pdf.text(displayText, x + 4, yPos + 13);
  });

  y += Math.ceil(stats.length / 4) * rowHeight + 10;

  // GMP Section (if available)
  if (gmpData?.current_gmp !== undefined) {
    pdf.setTextColor(...textColor);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("GREY MARKET PREMIUM", margin, y);
    y += 8;

    const gmp = gmpData.current_gmp;
    const gmpPercent = issuePrice > 0 ? (gmp / issuePrice) * 100 : 0;
    const estListing = gmpData.estimated_listing ?? (issuePrice + gmp);
    const profitPerLot = gmp * lotSize;

    // GMP box
    const isPositive = gmp >= 0;
    pdf.setFillColor(isPositive ? 236 : 254, isPositive ? 253 : 242, isPositive ? 245 : 242);
    pdf.roundedRect(margin, y, contentWidth, 25, 3, 3, "F");

    // GMP value
    pdf.setTextColor(isPositive ? 16 : 239, isPositive ? 185 : 68, isPositive ? 129 : 68);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(formatCurrency(gmp), margin + 8, y + 16);

    pdf.setFontSize(12);
    pdf.text(`(${formatPercent(gmpPercent)})`, margin + 60, y + 16);

    // Est listing and profit
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Est. Listing: ${formatCurrency(estListing)}`, pageWidth - margin - 70, y + 10);
    pdf.text(`Profit/Lot: ${formatCurrency(profitPerLot)}`, pageWidth - margin - 70, y + 18);

    y += 35;
  }

  // Check if we need a new page
  if (y > pageWidth - 40) {
    pdf.addPage();
    y = margin;
  }

  // Lot Size Table (if available)
  const lotSizeTable = ipo.lot_size_table;
  if (lotSizeTable && lotSizeTable.length > 0) {
    pdf.setTextColor(...textColor);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("LOT SIZE & APPLICATION", margin, y);
    y += 10;

    // Table header
    pdf.setFillColor(...primaryColor);
    pdf.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    const headers = lotSizeTable[0] || [];
    if (headers.length > 0) {
      const colW = contentWidth / 4;
      headers.slice(0, 4).forEach((header, idx) => {
        pdf.text(String(header), margin + 4 + idx * colW, y + 5.5);
      });
    }

    y += 10;
    pdf.setFont("helvetica", "normal");

    lotSizeTable.slice(1, 5).forEach((row) => {
      pdf.setTextColor(...textColor);
      pdf.setFontSize(9);
      const colW = contentWidth / 4;
      row.slice(0, 4).forEach((cell, idx) => {
        pdf.text(String(cell), margin + 4 + idx * colW, y + 4);
      });
      y += 8;
    });

    y += 5;
  }

  // New page check
  if (y > pageWidth - 40) {
    pdf.addPage();
    y = margin;
  }

  // About Company (if available)
  const about = ipo.about_company?.about_company;
  if (about) {
    pdf.setTextColor(...textColor);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("ABOUT COMPANY", margin, y);
    y += 8;

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...textColor);

    // Wrap text
    const lines = pdf.splitTextToSize(about.substring(0, 500), contentWidth);
    lines.slice(0, 8).forEach((line: string) => {
      pdf.text(line, margin, y);
      y += 5;
    });

    y += 5;
  }

  // IPO Timeline Section
  pdf.setTextColor(...textColor);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("IPO TIMELINE", margin, y);
  y += 8;

  const timelineItems = [
    ["Open Date", timeline["IPO Open Date"] || "TBA"],
    ["Close Date", timeline["IPO Close Date"] || "TBA"],
    ["Allotment", timeline["Tentative Allotment"] || "TBA"],
    ["Refund Initiation", timeline["Initiation of Refunds"] || "TBA"],
    ["Credit to Demat", timeline["Credit of Shares to Demat"] || "TBA"],
    ["Listing Date", timeline["Tentative Listing Date"] || "TBA"],
  ];

  timelineItems.forEach((item, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = margin + col * (contentWidth / 3);
    const yPos = y + row * 14;

    pdf.setTextColor(...mutedColor);
    pdf.setFontSize(8);
    pdf.text(item[0] + ":", x, yPos);

    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(String(item[1] || "TBA"), x + 35, yPos);
    pdf.setFont("helvetica", "normal");
  });

  y += Math.ceil(timelineItems.length / 3) * 14 + 10;

  // Subscription Status (if available)
  const subscription = ipo.subscription_status?.SubscriptionTable;
  if (subscription && subscription.length > 0) {
    pdf.setTextColor(...textColor);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("SUBSCRIPTION STATUS", margin, y);
    y += 10;

    // Table header
    pdf.setFillColor(...primaryColor);
    pdf.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("Category", margin + 4, y + 5.5);
    pdf.text("Subscription", margin + 80, y + 5.5);
    pdf.text("Shares Offered", margin + 120, y + 5.5);

    y += 10;
    pdf.setFont("helvetica", "normal");

    subscription.forEach((row) => {
      const subTimes = typeof row.subscription_times === "number"
        ? row.subscription_times
        : parseFloat(String(row["Subscription (times)"] || "0").replace(/[^\d.]/g, ""));

      pdf.setTextColor(...textColor);
      pdf.setFontSize(9);
      pdf.text(String(row.category || ""), margin + 4, y + 4);

      pdf.setTextColor(...primaryColor);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${subTimes.toFixed(2)}x`, margin + 80, y + 4);

      pdf.setTextColor(...textColor);
      pdf.setFont("helvetica", "normal");
      const sharesOffered = row.shares_offered ?? row["Shares Offered"] ?? "—";
      pdf.text(String(sharesOffered), margin + 120, y + 4);

      y += 8;
    });

    y += 5;
  }

  // Broker Recommendations (if available)
  const brokers = ipo.ipo_recommendation_summary?.brokers;
  if (brokers) {
    pdf.setTextColor(...textColor);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("BROKER RECOMMENDATIONS", margin, y);
    y += 10;

    const total = brokers.subscribe + brokers.may_apply + brokers.neutral + brokers.avoid;
    const recommendations = [
      { label: "Subscribe", value: brokers.subscribe, color: [16, 185, 129] as [number, number, number] },
      { label: "May Apply", value: brokers.may_apply, color: [59, 130, 246] as [number, number, number] },
      { label: "Neutral", value: brokers.neutral, color: [234, 179, 8] as [number, number, number] },
      { label: "Avoid", value: brokers.avoid, color: [239, 68, 68] as [number, number, number] },
    ];

    const barWidth = contentWidth - 60;
    let barX = margin;

    recommendations.forEach((rec) => {
      const width = total > 0 ? (rec.value / total) * barWidth : 0;
      if (width > 0) {
        pdf.setFillColor(...rec.color);
        pdf.rect(barX, y, width, 8, "F");
        barX += width;
      }
    });

    y += 12;

    // Legend
    recommendations.forEach((rec, idx) => {
      const x = margin + idx * 45;
      pdf.setFillColor(...rec.color);
      pdf.rect(x, y, 6, 6, "F");
      pdf.setTextColor(...textColor);
      pdf.setFontSize(8);
      pdf.text(`${rec.label}: ${rec.value}`, x + 8, y + 5);
    });

    y += 15;
  }

  // Check if we need a new page
  if (y > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    y = margin;
  }

  // Financials Section (if available)
  const financials = ipo.financials;
  if (financials && Object.keys(financials).length > 0) {
    pdf.setTextColor(...textColor);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("FINANCIAL HIGHLIGHTS", margin, y);
    y += 10;

    // Display key financial metrics
    const financialMetrics: [string, any][] = [];

    if (financials["Total Income"]) {
      const latestYear = Object.keys(financials["Total Income"])[0];
      if (latestYear) {
        financialMetrics.push(["Total Income", financials["Total Income"][latestYear]]);
      }
    }
    if (financials["Profit After Tax"]) {
      const latestYear = Object.keys(financials["Profit After Tax"])[0];
      if (latestYear) {
        financialMetrics.push(["Profit After Tax", financials["Profit After Tax"][latestYear]]);
      }
    }
    if (financials["NET Worth"]) {
      const latestYear = Object.keys(financials["NET Worth"])[0];
      if (latestYear) {
        financialMetrics.push(["Net Worth", financials["NET Worth"][latestYear]]);
      }
    }

    financialMetrics.forEach((metric, idx) => {
      const x = margin + (idx % 2) * (contentWidth / 2);
      const yPos = y + Math.floor(idx / 2) * 14;

      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(x, yPos, contentWidth / 2 - 3, 12, 2, 2, "F");

      pdf.setTextColor(...mutedColor);
      pdf.setFontSize(8);
      pdf.text(metric[0], x + 4, yPos + 5);

      pdf.setTextColor(...textColor);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(metric[1] || "—"), x + 4, yPos + 10);
      pdf.setFont("helvetica", "normal");
    });

    y += Math.ceil(financialMetrics.length / 2) * 14 + 10;
  }

  // PE Metrics (if available)
  const peMetrics = ipo.pe_metrics?.KPI;
  if (peMetrics && Object.keys(peMetrics).length > 0) {
    pdf.setTextColor(...textColor);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("KEY PERFORMANCE INDICATORS", margin, y);
    y += 10;

    const kpiMetrics = Object.entries(peMetrics).slice(0, 4);
    kpiMetrics.forEach((metric, idx) => {
      const x = margin + (idx % 2) * (contentWidth / 2);
      const yPos = y + Math.floor(idx / 2) * 12;

      pdf.setTextColor(...mutedColor);
      pdf.setFontSize(8);
      pdf.text(metric[0], x, yPos);

      pdf.setTextColor(...textColor);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(metric[1] || "—"), x + 50, yPos);
      pdf.setFont("helvetica", "normal");
    });

    y += Math.ceil(kpiMetrics.length / 2) * 12 + 10;
  }

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 15;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  pdf.setTextColor(...mutedColor);
  pdf.setFontSize(8);
  pdf.text("IPOHut • Your Trusted IPO Information Platform", margin, footerY);
  pdf.text("Disclaimer: This report is for informational purposes only.", pageWidth - margin, footerY, { align: "right" });

  // Save PDF
  const fileName = `${basicInfo["IPO Name"].replace(/\s+/g, "-")}-IPO-Report.pdf`;
  pdf.save(fileName);
}
