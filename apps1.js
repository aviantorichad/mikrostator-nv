var http = require('http'),
        fs = require('fs'),
        url = require('url'),
        choices = ["hello world", "goodbye world"];

var api = require('mikronode');
//var device = new api('661605e6c0cc.sn.mynetname.net');
var device = new api('sandalselop.ddns.net');
var n = 0;
var ndata = 0;
var Tgl = new Date().toDateString();
var Jam = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
var port = '8001';

try {
    device.connect('rtpapat', 'dotnet').then(function(conn) {
        console.log('[' + Tgl + ' ' + Jam + '] logged in, connected to mikrotik api!');
        koneksi = conn;
        if (!chan1) {
            chan1 = conn.openChannel("login");
        }
    }). catch (function(e) {
        console.log('[' + Tgl + ' ' + Jam + '] Connection error');
        console.log('[' + Tgl + ' ' + Jam + '] err: ' + e);
    });
} catch (e) {
    console.log(e);
}
http.createServer(function(request, response) {
    var Tgl = new Date().toDateString();
    var Jam = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    var path = url.parse(request.url).pathname;
    var akhirTmp = [];

    function get(url) {
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
        });
    }

    function gokonek() {
        return new Promise(function(resolve, reject) {
            device.connect('rtpapat', 'dotnet').then(function(conn) {
                chan1 = conn.openChannel("login"); // open a named channel
                koneksi = conn;
                resolve('[' + Tgl + ' ' + Jam + '] Logged in, Connected to api mikrotik!');
            }). catch (function(e) {
                console.log('[' + Tgl + ' ' + Jam + '] Connection error');
                console.error(e);
                reject(Error(e));
            });
        });
    }

    function gokonek2() {
        console.log('[' + Tgl + ' ' + Jam + '] logging in...');
        device.connect('rtpapat', 'dotnet').then(function(conn) {
            console.log('[' + Tgl + ' ' + Jam + '] logged in, connected to mikrotik api!');
            koneksi = conn;
//            console.log('koneksi');
//            console.log(JSON.stringify(koneksi));
            chan1 = conn.openChannel("login"); // open a named channel
//            resolve('[' + Tgl + ' ' + Jam + '] Logged in, Connected to api mikrotik!');

            response.writeHead(200, {
                "Content-Type": "text/plain"
            });
            response.end('login sukses' + JSON.stringify('logged in, connected to mikrotik api!'));
        }). catch (function(e) {
            console.log('[' + Tgl + ' ' + Jam + '] Connection error');
            console.error(e);
//            reject(Error(e));      

            response.writeHead(200, {
                "Content-Type": "text/plain"
            });
            response.end(JSON.stringify(e));
            console.log('[' + Tgl + ' ' + Jam + '] err: ' + error);
        });
    }

//..begin hitung biaya atau detik

    function totalDetik(str, jenis) {
        var w = 0;
        var d = 0;
        var h = 0;
        var m = 0;
        var s = 0;

        if (str.indexOf('w') > 0) {
            w = str.substring(str.lastIndexOf("j") + 1, str.lastIndexOf("w"));
        }
        if (str.indexOf('d') > 0) {
            if (w > 0) {
                d = str.substring(str.lastIndexOf("w") + 1, str.lastIndexOf("d"));
            } else {
                d = str.substring(str.lastIndexOf("j") + 1, str.lastIndexOf("d"));
            }
        }
        if (str.indexOf('h') > 0) {
            if (d > 0) {
                h = str.substring(str.lastIndexOf("d") + 1, str.lastIndexOf("h"));
            } else if (w > 0) {
                h = str.substring(str.lastIndexOf("w") + 1, str.lastIndexOf("h"));
            } else {
                h = str.substring(str.lastIndexOf("j") + 1, str.lastIndexOf("h"));
            }
        }
        if (str.indexOf('m') > 0) {
            if (h > 0) {
                m = str.substring(str.lastIndexOf("h") + 1, str.lastIndexOf("m"));
            } else if (d > 0) {
                m = str.substring(str.lastIndexOf("d") + 1, str.lastIndexOf("m"));
            } else if (w > 0) {
                m = str.substring(str.lastIndexOf("w") + 1, str.lastIndexOf("m"));
            } else {
                m = str.substring(str.lastIndexOf("j") + 1, str.lastIndexOf("m"));
            }
        }
        if (str.indexOf('s') > 0) {
            if (m > 0) {
                s = str.substring(str.lastIndexOf("m") + 1, str.lastIndexOf("s"));
            } else if (h > 0) {
                s = str.substring(str.lastIndexOf("h") + 1, str.lastIndexOf("s"));
            } else if (d > 0) {
                s = str.substring(str.lastIndexOf("d") + 1, str.lastIndexOf("s"));
            } else if (w > 0) {
                s = str.substring(str.lastIndexOf("w") + 1, str.lastIndexOf("s"));
            } else {
                s = str.substring(str.lastIndexOf("j") + 1, str.lastIndexOf("s"));
            }
        }

        ts = s; //1s = 1s
        tm = m * 60; //1m = 60s
        th = h * 60 * 60; //1h = 60m
        td = d * 24 * 60 * 60; //1d = 24h
        tw = w * 7 * 24 * 60 * 60; //1w = 7d
        total = eval(tw) + eval(th) + eval(td) + eval(tm) + eval(ts);
        biaya = eval(total) / 3600 * 2500;

        if (jenis === 'detik') {
            res = total;
        } else if (jenis === 'biaya') {
            res = Math.round(biaya);
        } else {
            res = tw + ' ' + td + ' ' + th + ' ' + tm + ' ' + ts + ' = ' + total + 's = Rp.' + Math.round(biaya);
        }

        return res;
    }
//..end hitung biaya atau detik

    function replaceDay(hariEng) {
        switch (hariEng) {
            case "Mon":
                return "Senin";
                break;
            case "Tue":
                return "Selasa";
                break;
            case "Wed":
                return "Rabu";
                break;
            case "Thu":
                return "Kamis";
                break;
            case "Fri":
                return "Jum'at";
                break;
            case "Sat":
                return "Sabtu";
                break;
            case "Sun":
                return "Minggu";
                break;
            default:
                return hariEng;
                break;
        }
    }
    function jam() {
        var Tgl = new Date().toDateString();
        var tglPisah = Tgl.split(' ');
        var hari = replaceDay(tglPisah[0]);
        var tgl = tglPisah[2];
        var bln = tglPisah[1];
        var thn = tglPisah[3];
        Tgl = hari + ", " + tgl + "-" + bln + "-" + thn;
        var Jam = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        return Tgl + " " + Jam;
    }

//.. begin cek keluar masuk user
    function arr_diff4(a1, a2) {
        var a = [], diff = [];
        var b = [];
        var user1 = [];
        var user2 = [];
        var e = [];

//        console.log('##########');
//        console.log(a1);
//        console.log('***');
//        console.log(a2);
//        console.log('##########');
//        console.log(a1.length);
//        console.log('***');
//        console.log(a2.length);
//        console.log('##########');

        for (var i = 0; i < a1.length; i++) {
            user1.push(a1[i]['user']);
        }
        for (var i = 0; i < a2.length; i++) {
            user2.push(a2[i]['user']);
        }

//        console.log('##########');
//        console.log(user1);
//        console.log('***');
//        console.log(user2);
//        console.log('##########');
//        console.log(user1.length);
//        console.log('***');
//        console.log(user2.length);
//        console.log('##########');
        for (var i = 0; i < a1.length; i++) {
            if (user2.indexOf(a1[i]['user']) === -1) {
                e = {};
                e['waktu'] = jam();
                e['user'] = a1[i]['user'];
                e['address'] = a1[i]['address'];
                e['mac-address'] = a1[i]['mac-address'];
                e['uptime'] = a1[i]['uptime'];
                e['session-time-left'] = a1[i]['session-time-left'];
                e['biaya'] = a1[i]['biaya'];
                e['status'] = 'keluar';
                b.push(e);
            }
        }
//        console.log(JSON.stringify(a2));
        for (var i = 0; i < a2.length; i++) {
            if (user1.indexOf(a2[i]['user']) === -1) {
                e = {};
                e['waktu'] = jam();
                e['user'] = a2[i]['user'];
                e['address'] = a2[i]['address'];
                e['mac-address'] = a2[i]['mac-address'];
                e['uptime'] = a2[i]['uptime'];
                e['session-time-left'] = a2[i]['session-time-left'];
                e['biaya'] = a2[i]['biaya'];
                e['status'] = 'keluar';
                b.push(e);
            }
        }

//        console.log(JSON.stringify(e));

        return b;
    }


//.. end cek keluar masuk user

    if (path == "/hotspotlog") {
//        if (typeof koneksi === 'undefined') {
//            gokonek2();
//        }
//        console.log(koneksi);
//        console.log('sent log');
        chan3 = koneksi.openChannel("hotspotlog"); // open a named channel
        chan3.write('/system/resource/print');

        chan3.on('done', function(data) {
            console.log('[' + Tgl + ' ' + Jam + '] Sent Hotspot Log');
            var string = JSON.stringify(data);

            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            response.end(string);

            chan3.close(); // close the channel.
        });

        chan3.on('trap', function(data) {
            console.log('Command failed: ' + data);
            chan3.close(); // close the channel.
        });

        chan3.on('error', function(data) {
            console.log('Oops: ' + data);
            chan3.close(); // close the channel.
        });

//        
//        gokonek().then(function(result){
//            chan3 = koneksi.openChannel("hotspotlog"); // open a named channel
//            chan3.write('/system/resource/print');
//
//            chan3.on('done', function(data) {
//                console.log('[' + Tgl + ' ' + Jam + '] Sent Hotspot Log');
//                var string = JSON.stringify(data);
//
//                response.writeHead(200, {
//                    "Content-Type": "text/html"
//                });
//                response.end(string);
//
//                chan3.close(); // close the channel.
//            });
//
//            chan3.on('trap', function(data) {
//                console.log('Command failed: ' + data);
//                chan3.close(); // close the channel.
//            });
//
//            chan3.on('error', function(data) {
//                console.log('Oops: ' + data);
//                chan3.close(); // close the channel.
//            });
//        }, function(error){
//            console.log('[' + Tgl + ' ' + Jam + '] err: ' + error);
//        });
    } else if (path == "/hotspotactive") {
//        gokonek().then(function(result){
        if (!koneksi) {
            console.log('[' + Tgl + ' ' + Jam + '] Relogin...');
            gokonek2();
        }
        chan = koneksi.openChannel("hotspotactive"); // open a named channel
        chan.write('/ip/hotspot/active/print');

        chan.on('done', function(data) {

            var string = JSON.stringify(data);

            //write to file.begin
            var resdata = data.data;
            var awal = data.data;
            var akhir = [];
            for (var i = 0; i < awal.length; i++) {
                element = {};
                ebiaya = '0s';
                edetik = '0s';
                for (var j = 0; j < awal[i].length; j++) {
                    element[awal[i][j].field] = awal[i][j].value;
                    if (awal[i][j].field === 'session-time-left') {
                        edetik = awal[i][j].value;
                    }
                    if (awal[i][j].field === 'uptime') {
                        ebiaya = awal[i][j].value;
                    }
                }
                element['biaya'] = totalDetik(ebiaya, 'biaya');
                element['detik'] = totalDetik(edetik, 'detik');
                akhir.push(element);
            }

            akhir.sort(function(a, b) {
                var x = a.detik;
                var y = b.detik;
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });



            if (ndata != data.data.length) {
                ndata = data.data.length;
                console.log('[' + Tgl + ' ' + Jam + '] Sent Hotspot Active ->' + n + ' (' + ndata + ')');
                fs.appendFile('history.txt', JSON.stringify(arr_diff4(akhirTmp, akhir)), function(err) {
                    //console.log(err);
                });
            }

//            console.log(ndata);
//            console.log(akhir.length);
//            if (ndata < akhir.length) {
//                ndata = akhir.length;
////                fs.appendFile('history.txt', JSON.stringify(arr_diff4(akhirTmp, akhir)), function (err) {
//                fs.appendFile('history.txt', 'masuk', function (err) {
//                    //console.log(err);
//                });
//
//            } else if (ndata > akhir.length) {
//                ndata = akhir.length;
////                fs.appendFile('history.txt', JSON.stringify(arr_diff4(akhirTmp, akhir)), function (err) {
//                fs.appendFile('history.txt', 'keluar', function (err) {
//                    //console.log(err);
//                });
//
//            } else {
////                document.getElementById('respon').innerHTML = 'bel berhenti';
//            }
            akhirTmp = akhir;
            //write to file.begin

            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            response.end(string);

            chan.close(); // close the channel.
        });

        chan.on('trap', function(data) {
            console.log('Command failed: ' + data);
            chan.close(); // close the channel.
        });

        chan.on('error', function(data) {
            console.log('Oops: ' + data);
            chan.close(); // close the channel.
        });
        n++;
//        }, function(error){
//            console.log('[' + Tgl + ' ' + Jam + '] err: ' + error);
//        });
    } else if (path == "/login") {
//        gokonek2();
        console.log('[' + Tgl + ' ' + Jam + '] logging in...');
        device.connect('rtpapat', 'dotnet').then(function(conn) {
            console.log('[' + Tgl + ' ' + Jam + '] logged in, connected to mikrotik api!');
            koneksi = conn;
//            console.log('koneksi');
//            console.log(JSON.stringify(koneksi));
            chan1 = conn.openChannel("login"); // open a named channel
//            resolve('[' + Tgl + ' ' + Jam + '] Logged in, Connected to api mikrotik!');

            response.writeHead(200, {
                "Content-Type": "text/plain"
            });
            response.end('login sukses' + JSON.stringify('logged in, connected to mikrotik api!'));
        }). catch (function(e) {
            console.log('[' + Tgl + ' ' + Jam + '] Connection error');
            console.error(e);
//            reject(Error(e));      

            response.writeHead(200, {
                "Content-Type": "text/plain"
            });
            response.end(JSON.stringify(e));
            console.log('[' + Tgl + ' ' + Jam + '] err: ' + error);
        });
    } else if (path == "/logout") {
        console.log('[' + Tgl + ' ' + Jam + '] logging out...');

        chan1.close(); // close the channel.
        koneksi.close(); // when closing connection, the socket is closed and program ends.
        console.log('[' + Tgl + ' ' + Jam + '] logged out, disconnected from api mikrotik!');

        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
        response.end('logged out!');
    } else if (path == "/play.html") {
        fs.readFile('./play.html', function(err, file) {
            if (err) {
                // write an error response or nothing here  
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.write('404 Not Found\n');
                response.end();
                return;
            }
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(file, "utf-8");
        });
    } else {
        fs.readFile('./apps1.html', function(err, file) {
            if (err) {
                // write an error response or nothing here  
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.write('404 Not Found\n');
                response.end();
                return;
            }

            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(file, "utf-8");
        });
    }
}).listen(port);
console.log('[' + Tgl + ' ' + Jam + '] server initialized on port ' + port);
process.on('uncaughtException', function (err) {
    //if(chan){
    //chan.close(); // close the channel.
    //}
  console.log('[' + Tgl + ' ' + Jam + '] Caught exception: ' + err);
});

setTimeout(function () {
  console.log('[' + Tgl + ' ' + Jam + '] This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('[' + Tgl + ' ' + Jam + '] This will not run.');
