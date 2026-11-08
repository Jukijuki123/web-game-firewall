/**
 * Data: Materi, Port Kamus, Kuis Pemanasan
 * Digunakan oleh materi.html dan kuis.html
 */

const FIREWALL_LESSONS = [
  {
    id: "firewall-basics",
    title: "1. Apa Itu Firewall & Cara Kerjanya?",
    badge: "Konsep Dasar",
    icon: "shield",
    summary: "Firewall adalah sistem keamanan jaringan yang memantau dan mengontrol lalu lintas data masuk dan keluar berdasarkan aturan keamanan yang telah ditentukan.",
    content: `
      <div class="space-y-4 text-sm leading-relaxed text-slate-300">
        <p>
          Bayangkan sebuah gedung sekolah dengan gerbang utama. Di depan gerbang ada <strong>satpam</strong> yang memegang daftar tamu yang boleh masuk. 
          Jika Anda adalah siswa dengan seragam dan kartu pelajar valid, satpam mengizinkan Anda masuk (<span class="text-emerald-400 font-semibold">ACCEPT</span>). 
          Jika ada orang asing mencurigakan tanpa tanda pengenal, satpam langsung mengusirnya (<span class="text-rose-400 font-semibold">DROP / REJECT</span>).
        </p>
        <div class="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-lg">
          <h4 class="text-cyan-300 font-bold mb-1">Fungsi Utama Firewall di SIJA:</h4>
          <ul class="list-disc list-inside space-y-1 text-xs">
            <li><strong>Mencegah Akses Tidak Sah:</strong> Melindungi server internal dari serangan hacker dari internet.</li>
            <li><strong>Menyaring Paket Berbahaya:</strong> Memblokir malware, paket eksploit, dan pemindaian port (*port scanning*).</li>
            <li><strong>Mengatur Lalu Lintas Data:</strong> Membatasi akses port tertentu hanya untuk staf atau alamat IP terpercaya.</li>
            <li><strong>Pencatatan (Logging):</strong> Merekam riwayat lalu lintas untuk audit dan analisis forensik insiden.</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: "packet-anatomy",
    title: "2. Anatomi Paket Data (Header & Payload)",
    badge: "Arsitektur Data",
    icon: "cpu",
    summary: "Setiap informasi yang melintasi kabel jaringan atau gelombang Wi-Fi dipecah menjadi unit kecil bernama 'Paket Data'.",
    content: `
      <div class="space-y-4 text-sm leading-relaxed text-slate-300">
        <p>
          Firewall jenis <em>Packet Filtering</em> memeriksa setiap paket seperti kurir memeriksa label pada amplop surat:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="p-3 bg-slate-900 border border-slate-700 rounded-lg">
            <span class="text-xs text-cyan-400 font-mono font-bold block mb-1">HEADER INFORMASI</span>
            <ul class="text-xs space-y-1.5">
              <li><strong class="text-slate-100">Source IP (IP Asal):</strong> Alamat pengirim (misal: <code>203.0.113.15</code>).</li>
              <li><strong class="text-slate-100">Destination IP (IP Tujuan):</strong> Server penerima (misal: <code>192.168.1.10</code>).</li>
              <li><strong class="text-slate-100">Protocol (Protokol):</strong> Jenis transmisi (<code>TCP</code>, <code>UDP</code>, atau <code>ICMP</code>).</li>
              <li><strong class="text-slate-100">Destination Port (Port Tujuan):</strong> Pintu layanan aplikasi yang dituju (misal: port <code>80</code>, <code>443</code>, <code>22</code>).</li>
            </ul>
          </div>
          <div class="p-3 bg-slate-900 border border-slate-700 rounded-lg">
            <span class="text-xs text-rose-400 font-mono font-bold block mb-1">PAYLOAD (ISI DATA)</span>
            <p class="text-xs text-slate-300">
              Isi data aktual dari aplikasi (permintaan halaman web, file yang diunggah, atau muatan berbahaya seperti kode injeksi SQL).
            </p>
            <div class="mt-2 p-2 bg-black/60 rounded text-[11px] font-mono text-emerald-400">
              GET /login.php HTTP/1.1<br>Host: sija-school.id
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "firewall-actions",
    title: "3. Aksi Firewall: ACCEPT vs DROP vs REJECT",
    badge: "Aturan Keputusan",
    icon: "toggle-right",
    summary: "Ketika paket data cocok dengan suatu kriteria aturan, firewall mengeksekusi salah satu dari tiga tindakan utama ini.",
    content: `
      <div class="space-y-3 text-sm leading-relaxed text-slate-300">
        <div class="space-y-2">
          <div class="p-3 bg-emerald-950/40 border border-emerald-600/40 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-400 font-mono text-sm">1. ACCEPT (IZINKAN)</span>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Paket Diteruskan</span>
            </div>
            <p class="text-xs mt-1 text-slate-300">
              Paket dianggap sah dan aman, lalu diteruskan langsung ke server internal atau aplikasi tujuan.
            </p>
          </div>

          <div class="p-3 bg-rose-950/40 border border-rose-600/40 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="font-bold text-rose-400 font-mono text-sm">2. DROP (BUANG DIAM-DIAM)</span>
              <span class="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">Stealth / Senyap</span>
            </div>
            <p class="text-xs mt-1 text-slate-300">
              Paket langsung dibuang tanpa mengirim balasan apapun ke pengirim. Penyerang akan mengalami <em>Connection Timeout</em> dan kesulitan menebak apakah server aktif atau mati.
            </p>
          </div>

          <div class="p-3 bg-amber-950/40 border border-amber-600/40 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-400 font-mono text-sm">3. REJECT (TOLAK DENGAN PEMBERITAHUAN)</span>
              <span class="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Buzzer / Respon RST</span>
            </div>
            <p class="text-xs mt-1 text-slate-300">
              Paket ditolak, dan firewall secara eksplisit mengirimkan paket balasan penolakan (misal paket TCP RST atau ICMP Port Unreachable). Pengirim langsung tahu pintunya ditutup.
            </p>
          </div>
        </div>

        <div class="p-2.5 bg-indigo-950/50 border border-indigo-700/50 rounded-lg text-xs">
          <strong class="text-indigo-300 font-semibold block mb-0.5">💡 Prinsip Top-Down Execution di SIJA:</strong>
          Firewall membaca aturan dari nomor urut teratas (Rule 1, Rule 2, dst). Begitu ada satu aturan yang cocok (Match), aksinya langsung dieksekusi dan aturan di bawahnya diabaikan! Jika tidak ada yang cocok, berlaku <em>Default Policy</em>.
        </div>
      </div>
    `
  },
  {
    id: "port-dictionary-lesson",
    title: "4. Port Standar & Tingkat Keamanannya",
    badge: "Keamanan Port",
    icon: "list",
    summary: "Port ibarat nomor kamar hotel pada server. Mengetahui port aman dan rentan adalah keahlian wajib administrator jaringan SIJA.",
    content: `
      <div class="space-y-3 text-sm leading-relaxed text-slate-300">
        <p>Port bernomor 0 sampai 65.535. Port 0-1023 adalah <em>Well-Known Ports</em>:</p>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-700 text-slate-400">
                <th class="py-1.5 px-2">Port</th>
                <th class="py-1.5 px-2">Protokol</th>
                <th class="py-1.5 px-2">Layanan</th>
                <th class="py-1.5 px-2">Status Keamanan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td class="py-1.5 px-2 font-mono text-cyan-400 font-bold">80</td>
                <td class="py-1.5 px-2">TCP</td>
                <td class="py-1.5 px-2">HTTP (Web polos)</td>
                <td class="py-1.5 px-2"><span class="text-amber-400">⚠️ Tidak terenkripsi</span></td>
              </tr>
              <tr>
                <td class="py-1.5 px-2 font-mono text-cyan-400 font-bold">443</td>
                <td class="py-1.5 px-2">TCP</td>
                <td class="py-1.5 px-2">HTTPS (Web aman SSL/TLS)</td>
                <td class="py-1.5 px-2"><span class="text-emerald-400 font-semibold">✅ Standar Aman</span></td>
              </tr>
              <tr>
                <td class="py-1.5 px-2 font-mono text-cyan-400 font-bold">22</td>
                <td class="py-1.5 px-2">TCP</td>
                <td class="py-1.5 px-2">SSH (Remote CLI terenkripsi)</td>
                <td class="py-1.5 px-2"><span class="text-emerald-400 font-semibold">✅ Aman (Batasi IP)</span></td>
              </tr>
              <tr>
                <td class="py-1.5 px-2 font-mono text-cyan-400 font-bold">23</td>
                <td class="py-1.5 px-2">TCP</td>
                <td class="py-1.5 px-2">Telnet (Remote teks polos)</td>
                <td class="py-1.5 px-2"><span class="text-rose-400 font-bold">❌ Berbahaya! Selalu Blokir</span></td>
              </tr>
              <tr>
                <td class="py-1.5 px-2 font-mono text-cyan-400 font-bold">21</td>
                <td class="py-1.5 px-2">TCP</td>
                <td class="py-1.5 px-2">FTP (File Transfer)</td>
                <td class="py-1.5 px-2"><span class="text-amber-400">⚠️ Password teks terbuka</span></td>
              </tr>
              <tr>
                <td class="py-1.5 px-2 font-mono text-cyan-400 font-bold">53</td>
                <td class="py-1.5 px-2">UDP/TCP</td>
                <td class="py-1.5 px-2">DNS (Domain Name System)</td>
                <td class="py-1.5 px-2"><span class="text-cyan-400">ℹ️ Esensial Internet</span></td>
              </tr>
              <tr>
                <td class="py-1.5 px-2 font-mono text-cyan-400 font-bold">3306</td>
                <td class="py-1.5 px-2">TCP</td>
                <td class="py-1.5 px-2">MySQL Database</td>
                <td class="py-1.5 px-2"><span class="text-rose-400">❌ Jangan buka ke Internet publik</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  }
];

const PORT_DATABASE = [
  { port: 80, proto: "TCP", service: "HTTP", status: "unencrypted", desc: "Layanan web standar tanpa enkripsi. Rentan penyadapan (sniffing).", recommended: "REDIRECT / RESTRICT" },
  { port: 443, proto: "TCP", service: "HTTPS", status: "secure", desc: "Layanan web modern terenkripsi SSL/TLS. Wajib diizinkan untuk portal web.", recommended: "ACCEPT" },
  { port: 22, proto: "TCP", service: "SSH", status: "secure", desc: "Akses terminal jarak jauh terenkripsi. Harus dilindungi dari brute-force.", recommended: "ACCEPT (Terbatas IP)" },
  { port: 23, proto: "TCP", service: "Telnet", status: "danger", desc: "Akses remote kuno yang mengirimkan password dalam teks biasa (plain text).", recommended: "DROP / REJECT" },
  { port: 21, proto: "TCP", service: "FTP", status: "warning", desc: "Transfer file tanpa enkripsi kata sandi.", recommended: "DROP (Gunakan SFTP/Port 22)" },
  { port: 53, proto: "UDP", service: "DNS", status: "essential", desc: "Penerjemah nama domain ke alamat IP.", recommended: "ACCEPT" },
  { port: 3306, proto: "TCP", service: "MySQL", status: "danger", desc: "Database server internal. Tidak boleh diakses langsung dari internet luar.", recommended: "DROP dari Public" },
  { port: 25, proto: "TCP", service: "SMTP", status: "warning", desc: "Pengiriman email. Sering disalahgunakan untuk spam jika terbuka umum.", recommended: "RESTRICT" },
  { port: 3389, proto: "TCP", service: "RDP", status: "warning", desc: "Remote Desktop Windows. Sering jadi target serangan ransomware.", recommended: "DROP jika dari Publik" },
  { port: 110, proto: "TCP", service: "POP3", status: "warning", desc: "Pengambilan email tanpa enkripsi.", recommended: "DROP (Gunakan POP3S/995)" }
];

const QUIZ_QUESTIONS = [
  {
    q: "Apa perbedaan paling mendasar antara aksi DROP dan REJECT pada firewall?",
    options: [
      "DROP membuang paket secara diam-diam tanpa balasan; REJECT menolak sambil mengirimkan sinyal balasan ke pengirim.",
      "DROP hanya berlaku untuk protokol UDP; REJECT hanya untuk TCP.",
      "REJECT membuat koneksi lebih cepat; DROP membuat koneksi terputus permanen.",
      "DROP mengubah isi paket data; REJECT menyimpannya di hard drive server."
    ],
    correct: 0,
    explanation: "Benar! DROP langsung membuang paket tanpa memberi tahu pengirim (stealth), sedangkan REJECT mengirimkan paket balasan penolakan (seperti TCP RST atau ICMP Unreachable)."
  },
  {
    q: "Mengapa protokol Telnet (Port 23) sangat dilarang digunakan di jaringan produksi modern dan wajib diblokir oleh firewall?",
    options: [
      "Karena Telnet menggunakan terlalu banyak bandwidth internet.",
      "Karena semua data termasuk username dan password dikirim dalam bentuk teks polos (plain text) tanpa enkripsi.",
      "Karena Telnet hanya bisa berjalan di sistem operasi Windows kuno.",
      "Karena Telnet tidak memiliki nomor port yang resmi."
    ],
    correct: 1,
    explanation: "Tepat sekali! Telnet tidak memiliki enkripsi, sehingga siapapun yang melakukan sniffing di jaringan dapat membaca username dan password admin dengan mudah. Selalu gunakan SSH (Port 22) sebagai gantinya."
  },
  {
    q: "Bagaimana urutan pembacaan aturan (rules) dalam sebuah firewall tabel (seperti iptables / MikroTik)?",
    options: [
      "Secara acak (random) berdasarkan beban server.",
      "Dari nomor port terkecil ke nomor port terbesar.",
      "Dari urutan teratas ke bawah (Top-down); aturan pertama yang cocok langsung dieksekusi.",
      "Aturan terbawah dieksekusi terlebih dahulu."
    ],
    correct: 2,
    explanation: "Hebat! Firewall membaca aturan dari urutan teratas ke bawah. Ketika paket memenuhi kriteria suatu aturan, tindakan aturan tersebut langsung diterapkan dan aturan di bawahnya diabaikan."
  },
  {
    q: "Port manakah yang sebaiknya dibuka ke publik internet jika Anda mengelola Web Server Sekolah yang aman?",
    options: [
      "Port 23 (Telnet)",
      "Port 3306 (MySQL Database)",
      "Port 443 (HTTPS)",
      "Port 21 (FTP)"
    ],
    correct: 2,
    explanation: "Tepat! Port 443 adalah HTTPS (HTTP Secure) dengan enkripsi SSL/TLS yang merupakan standar resmi untuk melayani pengunjung website dengan aman."
  }
];

window.FIREWALL_LESSONS = FIREWALL_LESSONS;
window.PORT_DATABASE = PORT_DATABASE;
window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
