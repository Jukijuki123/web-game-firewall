/**
 * Data: Game Level 1 & Level 2
 * Digunakan oleh game-l1.html dan game-l2.html
 */

const LEVEL1_PACKETS = [
  {
    id: "p1",
    srcIp: "182.253.10.4",
    destIp: "192.168.10.1",
    proto: "TCP",
    port: 443,
    service: "HTTPS",
    payload: "GET /index.html (Siswa browsing materi sekolah)",
    isSafe: true,
    expectedAction: "ACCEPT",
    reason: "Lalu lintas web terenkripsi sah dari siswa."
  },
  {
    id: "p2",
    srcIp: "198.51.100.88",
    destIp: "192.168.10.1",
    proto: "TCP",
    port: 23,
    service: "Telnet",
    payload: "LOGIN root / pass: admin123 (Teks polos rentan!)",
    isSafe: false,
    expectedAction: "DROP",
    reason: "Telnet tidak terenkripsi dan berbahaya! Wajib di-DROP."
  },
  {
    id: "p3",
    srcIp: "114.122.45.9",
    destIp: "192.168.10.1",
    proto: "UDP",
    port: 53,
    service: "DNS",
    payload: "Query: smk-sija.sch.id (Pencarian alamat domain)",
    isSafe: true,
    expectedAction: "ACCEPT",
    reason: "Query DNS normal untuk resolusi alamat domain."
  },
  {
    id: "p4",
    srcIp: "203.0.113.66",
    destIp: "192.168.10.1",
    proto: "TCP",
    port: 3306,
    service: "MySQL",
    payload: "CONNECT db_siswa - ' OR '1'='1 (SQL Injection dari luar!)",
    isSafe: false,
    expectedAction: "DROP",
    reason: "Akses port database MySQL langsung dari IP internet publik harus diblokir!"
  },
  {
    id: "p5",
    srcIp: "10.0.0.15",
    destIp: "192.168.10.1",
    proto: "TCP",
    port: 22,
    service: "SSH",
    payload: "SSH-2.0-OpenSSH_8.9p1 (Admin Lab Jaringan)",
    isSafe: true,
    expectedAction: "ACCEPT",
    reason: "Akses remote SSH sah dari jaringan lokal internal administrator."
  },
  {
    id: "p6",
    srcIp: "185.220.101.5",
    destIp: "192.168.10.1",
    proto: "TCP",
    port: 445,
    service: "SMB",
    payload: "EternalBlue exploit probe / WannaCry signature",
    isSafe: false,
    expectedAction: "DROP",
    reason: "Serangan exploit SMB port 445 berbahaya! Harus di-DROP."
  },
  {
    id: "p7",
    srcIp: "172.16.2.20",
    destIp: "192.168.10.1",
    proto: "TCP",
    port: 80,
    service: "HTTP",
    payload: "GET /panduan-sija.pdf",
    isSafe: true,
    expectedAction: "ACCEPT",
    reason: "Unduhan materi HTTP legal dari jaringan kampus."
  },
  {
    id: "p8",
    srcIp: "45.143.203.12",
    destIp: "192.168.10.1",
    proto: "TCP",
    port: 22,
    service: "SSH",
    payload: "Brute Force SSH Attack (Wordlist dictionary trial #452)",
    isSafe: false,
    expectedAction: "DROP",
    reason: "Serangan brute force password SSH dari botnet luar."
  }
];

const LEVEL2_SCENARIOS = [
  {
    id: "scenario-web",
    title: "Skenario 1: Mengamankan Web Server Portal Sekolah",
    description: "Server sekolah diserang port scanning dan botnet mencoba mengeksploitasi port MySQL (3306) & Telnet (23). Susun aturan firewall agar web portal (HTTPS port 443) dan DNS (port 53) tetap dapat diakses publik, sementara Telnet dan MySQL diblokir total!",
    targetServer: "Web Server SIJA (192.168.10.100)",
    incomingPackets: [
      { src: "Public", port: 443, proto: "TCP", desc: "Pengunjung web HTTPS", shouldPass: true },
      { src: "Public", port: 53, proto: "UDP", desc: "DNS lookup sekolah", shouldPass: true },
      { src: "Hacker-IP", port: 23, proto: "TCP", desc: "Telnet probe", shouldPass: false },
      { src: "Botnet-IP", port: 3306, proto: "TCP", desc: "Direct MySQL access", shouldPass: false },
      { src: "Public", port: 80, proto: "TCP", desc: "HTTP biasa (diizinkan untuk redirect)", shouldPass: true }
    ],
    initialRules: [
      { id: 1, action: "DROP", proto: "TCP", port: 23, src: "Any", comment: "Blokir Telnet tak terenkripsi" },
      { id: 2, action: "DROP", proto: "TCP", port: 3306, src: "Any", comment: "Lindungi database MySQL" },
      { id: 3, action: "ACCEPT", proto: "TCP", port: 443, src: "Any", comment: "Izinkan HTTPS" },
      { id: 4, action: "ACCEPT", proto: "UDP", port: 53, src: "Any", comment: "Izinkan DNS" },
      { id: 5, action: "ACCEPT", proto: "TCP", port: 80, src: "Any", comment: "Izinkan HTTP" },
      { id: 6, action: "DROP", proto: "Any", port: "Any", src: "Any", comment: "Default Policy: Drop selebihnya" }
    ]
  },
  {
    id: "scenario-admin",
    title: "Skenario 2: Pembatasan Akses Remote Admin SSH",
    description: "Port SSH (22) sangat krusial untuk remote server. Buat aturan agar SSH HANYA diizinkan dari IP Khusus Guru/Admin (10.10.1.50). Jika ada akses SSH dari sembarang IP publik luar (Any), harus di-DROP secara diam-diam!",
    targetServer: "Data Center Server (10.10.1.1)",
    incomingPackets: [
      { src: "10.10.1.50", port: 22, proto: "TCP", desc: "Admin Lab Login SSH", shouldPass: true },
      { src: "203.0.113.8", port: 22, proto: "TCP", desc: "Hacker Luar coba SSH", shouldPass: false },
      { src: "10.10.1.50", port: 443, proto: "TCP", desc: "Akses Dashboard Web", shouldPass: true },
      { src: "198.51.100.22", port: 22, proto: "TCP", desc: "Brute Force dari Internet", shouldPass: false }
    ],
    initialRules: [
      { id: 1, action: "ACCEPT", proto: "TCP", port: 22, src: "10.10.1.50", comment: "Izinkan SSH khusus Guru Admin" },
      { id: 2, action: "DROP", proto: "TCP", port: 22, src: "Any", comment: "Blokir SSH dari IP sembarang luar" },
      { id: 3, action: "ACCEPT", proto: "TCP", port: 443, src: "Any", comment: "Web portal tetap dibuka" },
      { id: 4, action: "DROP", proto: "Any", port: "Any", src: "Any", comment: "Default Policy: Drop All" }
    ]
  }
];

window.LEVEL1_PACKETS = LEVEL1_PACKETS;
window.LEVEL2_SCENARIOS = LEVEL2_SCENARIOS;
