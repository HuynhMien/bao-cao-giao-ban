function exportExcelAll() {
  const today = new Date().toISOString().split('T')[0];
  const filename = `Bao_Cao_Giao_Ban_Tong_Hop_${today}.xlsx`;
  
  const wb = XLSX.utils.book_new();
  
  const table1 = document.getElementById('reportTable');
  const ws = XLSX.utils.table_to_sheet(table1);
  
  XLSX.utils.sheet_add_aoa(ws, [
    [""], [""],
    ["BÁO CÁO THỐNG KÊ HOẠT ĐỘNG CẬN LÂM SÀNG TOÀN VIỆN"]
  ], { origin: -1 });
  
  const table2 = document.getElementById('clsTable');
  XLSX.utils.sheet_add_from_tags(table2, ws, { origin: -1 });

  XLSX.utils.book_append_sheet(wb, ws, "GIAO BAN TỔNG HỢP");
  XLSX.writeFile(wb, filename);
}