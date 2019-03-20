var id_alerta = document.getElementById('alert')
$(function () {

    var socket = io();
    // socket.on('new user', function (data) {
    //     console.log(data);
    //     id_alerta.style.display = 'block'
    //     id_alerta.innerHTML = `${data.mensaje}`
    //     socket.on('desconectado', function (m) {
    //         console.log(m.mensaje)
    //         id_alerta.innerHTML = `${m.mensaje}`
    //     })
    // });
    socket.on('total_users', function (data) {
        console.log(data)
    })
    socket.on('cajas', function (data) {
        dia = data.dia
        var v_progress;
        var cajas_iguales = false
        var total_cajas = data.total_cajas

        console.log(data)
        addImgs(total_cajas)
        var win = false;
        if (data.event_status) {
            for (let i = 0; i < total_cajas; i++) {
                var time = 1500 * (i + 1)
                setTimeout(function () {
                    var options = {
                        duration: 5800,
                        easing: 'easeInOut'
                    };
                    $(`#inner-${i}`).animate({
                        top: '76vh',
                        percent: 100
                    }, {
                        duration: 650,
                        progress: function (a, p, n) {
                            // console.log(p)
                            document.getElementById(`caja-${i}`)
                                .style.display = "block"
                            v_progress = Math.round(p * 100)
                        },
                        complete: function () {
                            document.getElementById(`caja-${i}`)
                                .style.display = "none"
                        }
                    }, );
                }, time);
            }

            //Cajas

            var timesClicked = false;
            var count_cajas = 0;
            total_cajas = data.total_cajas
            var change_src;
            for (let i = 0; i < total_cajas; i++) {
                $(`#inner-${i}`).bind("click", function (e) {
                    var id_caja_win = e.target.id
                    if (id_caja_win == data.caja_win) {
                        socket.emit('caja_ganadora', {
                            caja_ganadora: `caja-${i}`
                        })
                    }

                    count_cajas++

                    timesClicked = true;
                    var element = e.currentTarget.id
                    var progress
                    console.log(e)
                    socket.emit('stop_animation', {
                        click: true,
                        num_caja: i,
                        target: element 
                    })
                });
            }
            socket.on('click_stop', function (data) {
                // console.log(data.target)
                if (data.stop) {
                    $(`#inner-${data.num_caja}`).stop()
                    $(`#caja-${data.num_caja}`)
                        .animate({
                            width: '130px'
                        }, {
                            duration: 1200,
                            progress: function (a, p, n) {
                                // console.log(p)
                                progress = Math.round(p * 100)

                            }
                        }, {
                            easing: 'easeIn'
                        })
                        .animate({
                            width: '100%'
                        }, {
                            duration: 25,
                            complete: function () {
                                // console.log(data.win, data.num_caja)
                                // if (data.win == data.num_caja) {
                                //     change_src = document.getElementById(
                                //             `caja-${data.num_caja}`).src =
                                //         'ganaste.png'

                                // } else {
                                //     document.getElementById(`caja-${data.num_caja}`).src = 'clic.png'
                                // }
                                document.getElementById(`caja-${data.num_caja}`).src = data.name_img
                            }
                        }, {
                            easing: 'easeOut'
                        })
                        var e = document.getElementById(data.target)
                    setTimeout(function () {
                        shake(e);
                    }, 500);
                    if (timesClicked) {
                        $(this).unbind(e);
                    }
                }
            })

        }

    })
    // $('form').submit(function (e) {
    //     e.preventDefault();
    //     socket.emit('chat message', $('#m').val());
    //     $('#m').val('');
    //     return false;
    // });

    // socket.on('chat message', function (msg) {
    //     $('#messages').append($('<li>').text(msg));
    // });


    var shakingElements = [];

    var shake = function (element, magnitude = 4, angular = false) {
        //First set the initial tilt angle to the right (+1) 
        var tiltAngle = 1;

        //A counter to count the number of shakes
        var counter = 1;

        //The total number of shakes (there will be 1 shake per frame)
        var numberOfShakes = 40;

        //Capture the element's position and angle so you can
        //restore them after the shaking has finished
        var startX = 0,
            startY = 0,
            startAngle = 0;

        // Divide the magnitude into 10 units so that you can 
        // reduce the amount of shake by 10 percent each frame
        var magnitudeUnit = magnitude / numberOfShakes;
        //The `randomInt` helper function
        var randomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        //Add the element to the `shakingElements` array if it
        //isn't already there
        if (shakingElements.indexOf(element) === -1) {
            //console.log("added")
            shakingElements.push(element);

            //Add an `updateShake` method to the element.
            //The `updateShake` method will be called each frame
            //in the game loop. The shake effect type can be either
            //up and down (x/y shaking) or angular (rotational shaking).
            if (angular) {
                angularShake();
            } else {
                upAndDownShake();
            }
        }

        //The `upAndDownShake` function
        function upAndDownShake() {

            //Shake the element while the `counter` is less than 
            //the `numberOfShakes`
            if (counter < numberOfShakes) {

                //Reset the element's position at the start of each shake
                element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';

                //Reduce the magnitude
                magnitude -= magnitudeUnit;

                //Randomly change the element's position
                var randomX = randomInt(-magnitude, magnitude);
                var randomY = randomInt(-magnitude, magnitude);

                element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';

                //Add 1 to the counter
                counter += 1;

                requestAnimationFrame(upAndDownShake);
            }

            //When the shaking is finished, restore the element to its original 
            //position and remove it from the `shakingElements` array
            if (counter >= numberOfShakes) {
                element.style.transform = 'translate(' + startX + ', ' + startY + ')';
                shakingElements.splice(shakingElements.indexOf(element), 1);
            }
        }

        //The `angularShake` function
        function angularShake() {
            if (counter < numberOfShakes) {
                console.log(tiltAngle);
                //Reset the element's rotation
                element.style.transform = 'rotate(' + startAngle + 'deg)';

                //Reduce the magnitude
                magnitude -= magnitudeUnit;

                //Rotate the element left or right, depending on the direction,
                //by an amount in radians that matches the magnitude
                var angle = Number(magnitude * tiltAngle).toFixed(2);
                console.log(angle);
                element.style.transform = 'rotate(' + angle + 'deg)';
                counter += 1;

                //Reverse the tilt angle so that the element is tilted
                //in the opposite direction for the next shake
                tiltAngle *= -1;

                requestAnimationFrame(angularShake);
            }

            //When the shaking is finished, reset the element's angle and
            //remove it from the `shakingElements` array
            if (counter >= numberOfShakes) {
                element.style.transform = 'rotate(' + startAngle + 'deg)';
                shakingElements.splice(shakingElements.indexOf(element), 1);
                //console.log("removed")
            }
        }

    };

});