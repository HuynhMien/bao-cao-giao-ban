const TOKENS = {
  "CAPCUU2026": "KHOA CẤP CỨU - HSTC - CHỐNG ĐỘC",
  "NGOAI2026": "KHOA NGOẠI TỔNG HỢP",
  "NHI2026": "KHOA NHI",
  "NOITIMMACH2026": "KHOA NỘI TIM MẠCH - LÃO HỌC",
  "NOITONGHOP2026": "KHOA NỘI TỔNG HỢP",
  "GMHS2026": "KHOA PHẪU THUẬT GÂY MÊ HỒI SỨC",
  "SAN2026": "KHOA PHỤ SẢN",
  "TRUYENNHIEM2026": "KHOA TRUYỀN NHIỄM",
  "YHCT2026": "KHOA Y DƯỢC CỔ TRUYỀN",
  "LCK2026": "KHOA LIÊN CHUYÊN KHOA",
  "KKB2026": "TỔNG LƯỢT KHÁM NGOẠI TRÚ"
};

function login() {
  const tokenInput = document.getElementById('token').value.trim();

  if (!TOKENS[tokenInput]) {
    alert('Mã khoa không đúng hoặc chưa được đăng ký!');
    return;
  }

  localStorage.setItem('token', tokenInput);
  localStorage.setItem('khoa', TOKENS[tokenInput]);
  window.location.href = 'dashboard.html';
}

document.getElementById('token').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') login();
});