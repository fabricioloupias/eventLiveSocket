const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var schedule = require('node-schedule');
var date = new Date(2019, 2, 18, 16, 55,25);
const path = require("path");

var count_users = 0
var count = 0;

var $ipsConnected = [];


var total_cajas = 80
var e_status = false
var init = 0

function num_random(a, b) {
    return Math.round(Math.random() * (b - a) + parseInt(a));
}
var caja_win = `caja-${num_random(init, total_cajas)}`
var num_caja_win = num_random(init, total_cajas)
var if_win = false

const port = process.env.PORT || 3000
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
    // res.send(JSON.stringify({ Hello: "World"}));
});
app.use(express.static(__dirname + '/js/'));
app.use(express.static(__dirname + '/img/'));

io.on('connection', function (socket) {
    setInterval(function () {
        // var date = new Date();
        var second = date.getUTCSeconds()
        var minutos = date.getMinutes()
        var hora = date.getHours()
        var dia = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} - ${hora}:${minutos}:${second}`
        if (dia == "18/3/2019 - 16:35:10") {
            e_status = true
        }

    }, 1000)
    // console.log('caja win: ' + num_caja_win)
    count_users++
    socket.emit('new user', {
        mensaje: 'Nuevo usuario conectado',
        total_users: count_users
    });
    var $ipAddress = socket.handshake.address;
    // console.log($ipAddress)
    if (!$ipsConnected.hasOwnProperty($ipAddress)) {
        $ipsConnected[$ipAddress] = 1;
        count++;
        console.log(count)
    }
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    var j = schedule.scheduleJob('*/2 * * * *', function () {
        socket.emit('cajas', {
            total_cajas: total_cajas,
            event_status: true,
        })
    });

    socket.on('stop_animation',function(data){
        console.log(data.target)
        if(data){
            var nombre_img
            if(data.num_caja != num_caja_win){
                nombre_img = 'clic.png'
            }else{
                nombre_img = 'ganaste.png'
            }
            io.emit('click_stop',{
                stop: true,
                num_caja: data.num_caja,
                target: data.target,
                win: num_caja_win,
                name_img: nombre_img
            })
        }
    })

    socket.on('disconnect', function () {
        io.emit('desconectado', {
            mensaje: ' usuario desconectado'
        });
        if ($ipsConnected.hasOwnProperty($ipAddress)) {
            io.emit('total_users', {
                total: count
            });
            delete $ipsConnected[$ipAddress];
            count--;
            console.log(count)
        }

    });
});


// io.on('connection', function (socket) {
//     socket.broadcast.emit('hi');
// });
// io.on('connection', function (socket) {
//     socket.on('chat message', function (msg) {

//     });
// });
if(process.env.NODE_ENV === 'production'){
    console.log('prod')
}else{
    console.log('desarrollo')
}

http.listen(port, function () {
    console.log('funciona, ', port);
});