const userKhoa = localStorage.getItem('khoa');
const userToken = localStorage.getItem('token');

if (!userKhoa || !userToken) {
  window.location.href = 'index.html';
}

document.getElementById('khoaName').innerText = userKhoa;

function value(id) {
  return document.getElementById(id).value || 0;
}

async function submitReport() {
  const data = {
    token: userToken,
    benhCu: value('benhCu'),
    benhMoi: value('benhMoi'),
    chuyenKhoa: value('chuyenKhoa'),
    xuatVien: value('xuatVien'),
    xinVe: value('xinVe'),
    boVe: value('boVe'),
    tuVong: value('tuVong'),
    chuyenVien: value('chuyenVien'),
    procalcitonin: value('procalcitonin'),
    bnp: value('bnp'),
    khiMauDongMach: value('khiMauDongMach'),
    noiSoi: value('noiSoi'),
    xqNgoaiTru: value('xqNgoaiTru'),
    xqNoiTru: value('xqNoiTru'),
    sieuAmNgoaiTru: value('sieuAmNgoaiTru'),
    sieuAmNoiTru: value('sieuAmNoiTru'),
    xnNgoaiTru: value('xnNgoaiTru'),
    xnNoiTru: value('xnNoiTru')
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    alert(result.message);
    if (result.success) loadData();
  } catch (error) {
    alert("Không thể kết nối đến máy chủ API!");
  }
}

const KHOA_MAP = {
  "KHOA CẤP CỨU - HSTC - CHỐNG ĐỘC": "HSCC",
  "KHOA PHẪU THUẬT GÂY MÊ HỒI SỨC": "GMHS",
  "KHOA NGOẠI TỔNG HỢP": "NGOẠI",
  "KHOA PHỤ SẢN": "SẢN",
  "KHOA NỘI TỔNG HỢP": "NỘI TH",
  "KHOA NỘI TIM MẠCH - LÃO HỌC": "NỘI TM-LH",
  "KHOA NHI": "NHI",
  "KHOA TRUYỀN NHIỄM": "NHIỄM",
  "KHOA Y DƯỢC CỔ TRUYỀN": "YHCT",
  "KHOA LIÊN CHUYÊN KHOA": "LCK",
  "TỔNG LƯỢT KHÁM NGOẠI TRÚ": "KKB"
};

async function loadData() {
  try {
    const response = await fetch(API_URL);
    const allData = await response.json();
    
    // Đồng bộ lọc lấy ngày hôm nay theo giờ máy tính client
    const todayStr = new Date().toISOString().split('T')[0];
    const data = allData.filter(item => item.ngay && item.ngay.split(' ')[0] === todayStr);

    // 1. DỰNG BẢNG 1: LÂM SÀNG
    const tbody = document.querySelector('#reportTable tbody');
    tbody.innerHTML = '';

    let tong = { benhCu: 0, benhMoi: 0, chuyenKhoa: 0, xuatVien: 0, xinVe: 0, boVe: 0, tuVong: 0, chuyenVien: 0, conLai: 0 };
    let clsData = {
      procalcitonin: {}, bnp: {}, khiMauDongMach: {}, noiSoi: {},
      xqNgoaiTru: {}, xqNoiTru: {}, sieuAmNgoaiTru: {}, sieuAmNoiTru: {}, xnNgoaiTru: {}, xnNoiTru: {}
    };

    data.forEach((item, index) => {
      tong.benhCu += Number(item.benhCu || 0);
      tong.benhMoi += Number(item.benhMoi || 0);
      tong.chuyenKhoa += Number(item.chuyenKhoa || 0);
      tong.xuatVien += Number(item.xuatVien || 0);
      tong.xinVe += Number(item.xinVe || 0);
      tong.boVe += Number(item.boVe || 0);
      tong.tuVong += Number(item.tuVong || 0);
      tong.chuyenVien += Number(item.chuyenVien || 0);
      tong.conLai += Number(item.conLai || 0);

      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td style="text-align:left; font-weight:500;">${item.khoa}</td>
          <td>${item.benhCu || 0}</td>
          <td>${item.benhMoi || 0}</td>
          <td>${item.chuyenKhoa || 0}</td>
          <td>${item.xuatVien || 0}</td>
          <td>${item.xinVe || 0}</td>
          <td>${item.boVe || 0}</td>
          <td>${item.tuVong || 0}</td>
          <td>${item.chuyenVien || 0}</td>
          <td class="cell-highlight">${item.conLai || 0}</td>
        </tr>`;

      let sName = KHOA_MAP[item.khoa];
      if (sName) {
        Object.keys(clsData).forEach(key => {
          clsData[key][sName] = (clsData[key][sName] || 0) + Number(item[key] || 0);
        });
      }
    });

    tbody.innerHTML += `
      <tr class="row-total">
        <td colspan="2">TỔNG TOÀN VIỆN</td>
        <td>${tong.benhCu}</td><td>${tong.benhMoi}</td><td>${tong.chuyenKhoa}</td>
        <td>${tong.xuatVien}</td><td>${tong.xinVe}</td><td>${tong.boVe}</td>
        <td>${tong.tuVong}</td><td>${tong.chuyenVien}</td><td style="background:#fde047; color:#000;">${tong.conLai}</td>
      </tr>`;

    // 2. DỰNG BẢNG 2: CẬN LÂM SÀNG
    const clsSchema = [
      { id: 'procalcitonin', label: 'PROCALCITONIN' },
      { id: 'bnp', label: 'BNP' },
      { id: 'khiMauDongMach', label: 'KHÍ MÁU ĐỘNG MẠCH' },
      { id: 'noiSoi', label: 'NỘI SOI THỰC QUẢN - DẠ DÀY - TÁ TRÀNG' },
      { id: 'xqNgoaiTru', label: 'SỐ LẦN CHỤP XQ NGOẠI TRÚ' },
      { id: 'xqNoiTru', label: 'SỐ LẦN CHỤP XQ NỘI TRÚ' },
      { id: 'sieuAmNgoaiTru', label: 'SỐ LẦN SIÊU ÂM NGOẠI TRÚ' },
      { id: 'sieuAmNoiTru', label: 'SỐ LẦN SIÊU ÂM NỘI TRÚ' },
      { id: 'xnNgoaiTru', label: 'SỐ LẦN Xbinary XÉT NGHIỆM NGOẠI TRÚ' },
      { id: 'xnNoiTru', label: 'SỐ LẦN XÉT NGHIỆM NỘI TRÚ' }
    ];

    const khoaOrder = ["HSCC", "GMHS", "NGOẠI", "SẢN", "NỘI TH", "NỘI TM-LH", "NHI", "NHIỄM", "YHCT", "LCK", "KKB"];
    const clsTbody = document.querySelector('#clsTable tbody');
    clsTbody.innerHTML = '';

    clsSchema.forEach(row => {
      let sum = 0;
      let htmlCols = '';
      
      khoaOrder.forEach(k => {
        let v = clsData[row.id][k] || 0;
        sum += v;
        htmlCols += `<td>${v}</td>`;
      });

      clsTbody.innerHTML += `
        <tr>
          <td style="text-align:left; font-weight:500;">${row.label}</td>
          <td style="font-weight:bold; background:#f0fdf4; color:#166534;">${sum}</td>
          ${htmlCols}
        </tr>`;
    });

  } catch (e) {
    console.error("Lỗi đồng bộ dữ liệu: ", e);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

loadData();
setInterval(loadData, 10000);