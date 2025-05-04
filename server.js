var http = require('http');
var fs = require('fs');
var url = require('url');

var mahasiswaData = [];
var dosenData = [];

var server = http.createServer(function(req, res) {
    var q = url.parse(req.url, true);
    var menu = q.query.menu;

    if (req.url === '/style.css') {
        fs.readFile('pages/style.css', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end("404 Not Found");
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            return res.end();
        });
        return;
    }

    function renderHeader(title) {
        res.write(`<link rel="stylesheet" href="style.css">`);
        res.write(`<h1>${title}</h1>`);
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });

    switch (menu) {
        case undefined:
        case '/':
        case 'home':
            fs.readFile('pages/index.html', (err, data) => {
                if (err) return res.end("404 Not Found");
                res.write(data);
                res.end();
            });
            break;

        case 'form-mahasiswa':
            fs.readFile('pages/form_mahasiswa.html', (err, data) => {
                if (err) return res.end("404 Not Found");
                res.write(data);
                res.end();
            });
            break;

        case 'form-dosen':
            fs.readFile('pages/form_dosen.html', (err, data) => {
                if (err) return res.end("404 Not Found");
                res.write(data);
                res.end();
            });
            break;

        case 'proses-mahasiswa':
            let mhs = {
                    nrp: q.query.nrp,
                    nama: q.query.nama,
                    alamat: q.query.alamat,
                    tgl_lahir: q.query.tgl_lahir,
                    nohp: q.query.no_hp,
                    email: q.query.email,
                    prodi: q.query.prodi
                };
            mahasiswaData.push(mhs);
            renderHeader("Data Mahasiswa Diterima");
            res.write(`<ul>
                <li>NRP: ${mhs.nrp}</li>
                <li>Nama: ${mhs.nama}</li>
                <li>Alamat: ${mhs.alamat}</li>
                <li>Tanggal Lahir: ${mhs.tgl_lahir}</li>
                <li>Nomor HP: ${mhs.nohp}</li>
                <li>Email: ${mhs.email}</li>
                <li>Prodi: ${mhs.prodi}</li>
            </ul>`);
            res.write(`<a href="/">Kembali</a>`);
            res.end();
            break;
            

        case 'proses-dosen':
            let dosen = {
                nik: q.query.nik,
                nama: q.query.nama,
                tgl_lahir: q.query.tgl_lahir,
                email: q.query.email,
                prodi: q.query.prodi
            };
            dosenData.push(dosen);
            renderHeader("Data Dosen Diterima");
            res.write(`<ul>
                <li>NIK: ${dosen.nik}</li>
                <li>Nama: ${dosen.nama}</li>
                <li>Tanggal Lahir: ${dosen.tgl_lahir}</li>
                <li>Email: ${dosen.email}</li>
                <li>Prodi: ${dosen.prodi}</li>
            </ul>`);
            res.write(`<a href="/">Kembali</a>`);
            res.end();
            break;

        case 'cek-mahasiswa':
            renderHeader("Data Mahasiswa");
            if (mahasiswaData.length > 0) {
                res.write(`<table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse:collapse; margin-top:20px;">
                    <tr>
                        <th>NRP</th>
                        <th>Nama</th>
                        <th>Alamat</th>
                        <th>Tanggal Lahir</th>
                        <th>Nomor HP</th>
                        <th>Email</th>
                        <th>Prodi</th>
                    </tr>`);
                mahasiswaData.forEach(m => {
                    res.write(`<tr>
                        <td>${m.nrp}</td>
                        <td>${m.nama}</td>
                        <td>${m.alamat}</td>
                        <td>${m.tgl_lahir}</td>
                        <td>${m.nohp}</td>
                        <td>${m.email}</td>
                        
                        <td>${m.prodi}</td>
                    </tr>`);
                });
                res.write(`</table>`);
            } else {
                res.write(`<p>Belum ada data mahasiswa.</p>`);
            }
            res.write(`<link rel="stylesheet" href="style.css">`);
            res.write(`<a href="/">Kembali ke Beranda</a>`);
            res.end();
            break;

        case 'cek-dosen':
            renderHeader("Data Dosen");
            if (dosenData.length > 0) {
                res.write(`<table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse:collapse; margin-top:20px;">
                    <tr>
                        <th>NIK</th>
                        <th>Nama</th>
                        <th>Tanggal Lahir</th>
                        <th>Email</th>
                        <th>Prodi</th>
                    </tr>`);
                dosenData.forEach(d => {
                    res.write(`<tr>
                        <td>${d.nik}</td>
                        <td>${d.nama}</td>
                        <td>${d.tgl_lahir}</td>
                        <td>${d.email}</td>
                        <td>${d.prodi}</td>
                    </tr>`);
                });
                res.write(`</table>`);
            } else {
                res.write(`<p>Belum ada data dosen.</p>`);
            }
            res.write(`<a href="/">Kembali ke Beranda</a>`);
            res.end();
            break;

        default:
            renderHeader("404 - Halaman Tidak Ditemukan");
            res.write(`<a href="/">Kembali ke Beranda</a>`);
            res.end();
            break;
    }
});
server.listen(5000);
