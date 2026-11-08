/**
 * Sertifikat Page - Generasi dan unduhan sertifikat digital via HTML5 Canvas
 */

const sertifikatPage = {
  init() {
    // Load data tersimpan jika ada
    const certData = AppState.getCertificate();
    const studentInput = document.getElementById('cert-student-name');
    const schoolInput = document.getElementById('cert-school-name');
    
    if (studentInput && certData.studentName) {
      studentInput.value = certData.studentName;
    }
    if (schoolInput && certData.schoolName) {
      schoolInput.value = certData.schoolName;
    }

    // Generate sertifikat awal
    this.generateCertificate();
  },

  generateCertificate() {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const studentName = document.getElementById('cert-student-name')?.value.trim() || "Nama Siswa SIJA";
    const schoolName = document.getElementById('cert-school-name')?.value.trim() || "SMK Jurusan SIJA";

    // Simpan ke AppState
    AppState.setCertificate({ studentName, schoolName });

    // Ambil skor total dari progres
    const progress = AppState.getProgress();
    const totalScore = progress.totalScore || 0;

    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Background Elegan Gelap SOC
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#0b0f19');
    bgGradient.addColorStop(0.5, '#0e1726');
    bgGradient.addColorStop(1, '#05070e');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Garis Batas Bingkai Neon
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Aksen Sudut Cyber
    const drawCyberCorner = (x, y, dx, dy) => {
      ctx.fillStyle = '#00d2ff';
      ctx.fillRect(x, y, dx * 20, 4);
      ctx.fillRect(x, y, 4, dy * 20);
    };
    drawCyberCorner(30, 30, 1, 1);
    drawCyberCorner(canvas.width - 30, 30, -1, 1);
    drawCyberCorner(30, canvas.height - 30, 1, -1);
    drawCyberCorner(canvas.width - 30, canvas.height - 30, -1, -1);

    // 3. Header Sertifikat
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00d2ff';
    ctx.font = 'bold 16px "Fira Code", monospace';
    ctx.fillText('DIREKTORAT SISTEM KEAMANAN JARINGAN & KOMUNIKASI DATA', canvas.width / 2, 85);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SERTIFIKAT KELULUSAN KOMPETENSI', canvas.width / 2, 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Diberikan secara resmi kepada siswa atas keberhasilan menyelesaikan modul praktikum:', canvas.width / 2, 160);

    // 4. Nama Siswa
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(studentName.toUpperCase(), canvas.width / 2, 220);

    // Garis Bawah Nama
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 200, 235);
    ctx.lineTo(canvas.width / 2 + 200, 235);
    ctx.stroke();

    // 5. Nama Sekolah & Predikat
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${schoolName}`, canvas.width / 2, 265);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Telah berhasil menguasai kompetensi dasar:', canvas.width / 2, 305);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px "Fira Code", monospace';
    ctx.fillText('JUNIOR FIREWALL & NETWORK SECURITY ANALYST', canvas.width / 2, 335);

    // 6. Ringkasan Skor & Evaluasi
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Fira Code", monospace';
    ctx.fillText(`Capaian Skor Evaluasi: ${totalScore} Poin  |  Prinsip Packet Filtering (Top-Down ACL) & Security Hardening`, canvas.width / 2, 365);

    // 7. Footer & Stempel Digital
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "Fira Code", monospace';
    ctx.fillText(`Tanggal Terbit: ${today}`, 70, 440);
    ctx.fillText(`ID Kredensial: SIJA-FW-${Math.random().toString(36).substring(2, 9).toUpperCase()}`, 70, 460);

    // Stempel / Badge Otentikasi
    ctx.textAlign = 'right';
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px "Fira Code", monospace';
    ctx.fillText('✓ TERVERIFIKASI SISTEM EDUKASI SIJA', canvas.width - 70, 440);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Instruktur Praktikum Sistem Keamanan Jaringan', canvas.width - 70, 460);
  },

  downloadCertificate() {
    sounds.playClick();
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `Sertifikat_Firewall_SIJA_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
};

window.sertifikatPage = sertifikatPage;
