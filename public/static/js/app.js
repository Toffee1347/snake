const pages = ['/home', '/single', '/multi', '/options'];
const titles = ['Snakeee', 'Single Player | Snakeee', 'Multi Player | Snakeee', 'Options | Snakeee'];
let onload = reset;

$('a').click((ev) => {
    ev.preventDefault();
    history.pushState(null, null, ev.currentTarget.href);
    reset();
});
function hideAll() {
    pages.forEach((el) => {
        $(`${el.replace('/', '#')}`).hide();
    });
};
addEventListener('popstate', reset);

function reset() {
    hideAll();
    if (pages.includes(location.pathname) || location.pathname == '/') {
        if (location.pathname == '/') {
            document.title = 'Snakeee';
            $('#home').show();
        }
        else {
        document.title = titles[pages.indexOf(location.pathname)];
            $(`${location.pathname.replace('/', '#')}`).show();
        };
    }
    else {
        location.replace('/');
    };

    if (location.search) {
        let error = location.search;
        history.replaceState(null, null, '/');
        if (error == '?a') {
            Swal.fire({
                icon: 'error',
                title: '<h1>404 Error</h1>',
                html: '<div style="color: white;">Looks like we couldn\'t find the file you wanted, instead we\'ve put you back on the homepage.</div>'
            });
        }
        else if (error == '?b') {
            (async () => {
                await Swal.fire({
                    icon: 'error',
                    title: 'The Game ID is inncorrect'
                });
                setTimeout(() => {
                    joinGame();
                }, 300);
            })();
        }
        else if (error == '?c') {
            Swal.fire({
                icon: 'error',
                title: 'The Game has timed out'
            });
        }
        else if (error == '?d') {
            Swal.fire({
                icon: 'error',
                title: 'We have detected that you have entered something into the console.'
            });
        }
        else if (error == '?e') {
            joinGame();
        };
    };

    let settings = getConfig();

    /* Single Player */
    document.getElementById('gameSpeed').oninput = () => {
        document.getElementById('clientGameSpeed').innerHTML = document.getElementById('gameSpeed').value;
        setConfigItem('gameSpeed', document.getElementById('gameSpeed').value);
    };
    settings.gameSpeed ? (() => {
        document.getElementById('clientGameSpeed').innerHTML = settings.gameSpeed;
        document.getElementById('gameSpeed').value = settings.gameSpeed;
    })() : (() => {
        document.getElementById('clientGameSpeed').innerHTML = '100';
        document.getElementById('gameSpeed').value = 100;
    })();
    document.getElementById('gameTime').oninput = () => {
        document.getElementById('clientGameTime').innerHTML = document.getElementById('gameTime').value;
        setConfigItem('gameTime', document.getElementById('gameTime').value);
    };
    if (settings.gameTime == 'off') {
        document.getElementById('gameTime').disabled = true;
        document.getElementById('timed').checked = false;
        document.getElementById('gameTimeArea').style.opacity = 0.5;
        document.getElementById('clientGameTime').innerHTML = '120';
        document.getElementById('gameTime').value = 120;
    }
    else {
        document.getElementById('clientGameTime').innerHTML = settings.gameTime;
        document.getElementById('gameTime').value = settings.gameTime;
        document.getElementById('timed').checked = true;
    };

    document.getElementById('timed').oninput = () => {
        document.getElementById('timed').checked ? (() => {
            document.getElementById('gameTime').disabled = false;
            document.getElementById('gameTimeArea').style.opacity = 1;
            document.getElementById('clientGameTime').innerHTML = Number.isInteger(parseInt(getConfig().gameTime)) ? getConfig().gameTime : 120;
            document.getElementById('gameTime').value = Number.isInteger(parseInt(getConfig().gameTime)) ? getConfig().gameTime : 120;
        })() : (() => {
            document.getElementById('gameTime').disabled = true;
            document.getElementById('gameTimeArea').style.opacity = 0.5;
            document.getElementById('clientGameTime').innerHTML = Number.isInteger(parseInt(getConfig().gameTime)) ? getConfig().gameTime : 120; 
            document.getElementById('gameTime').value = Number.isInteger(parseInt(getConfig().gameTime)) ? getConfig().gameTime : 120;  
        })();
    }

    document.getElementById('singlePlay').onsubmit = (ev) => {
        ev.preventDefault();
        let playSettings = getConfig();
        playSettings.gameSpeed = document.getElementById('gameSpeed').value;
        playSettings.gameTime = document.getElementById('timed').checked ? document.getElementById('gameTime').value : 'off';
        setConfig(playSettings);
        location.href = '/singleSnake';
    };


    /* Multi player */
    function setSettings(gameSpeed, gameSize) {
        let percentage = 1;
        let value = parseInt(gameSize);
        percentage = (value / 100) + 1;
        gameSize = 40 * percentage;


        percentage = 1;
        value = parseInt(gameSpeed);
        if (Math.sign(value) == 1) {
            value = value - (2 * value);
            percentage = (value / 100) + 1;
        }
        else if (Math.sign(value) == -1) {
            value = value + Math.abs(2 * value);
            percentage = (value / 100) + 1;
        };
        gameSpeed = (1000 / ((1000 / gameSize) / 2)) * percentage;
        return {
            gameSpeed: gameSpeed,
            gameSize: gameSize
        };
    };

    document.getElementById('gameSpeedMulti').oninput = () => {
        document.getElementById('clientGameSpeedMulti').innerHTML = parseInt(document.getElementById('gameSpeedMulti').value) + 100;

        let multiSettings = setSettings(document.getElementById('gameSpeedMulti').value, document.getElementById('gameSizeMulti').value);
        setConfigItem('gameSpeed', multiSettings.gameSpeed);
        setConfigItem('gameSize', multiSettings.gameSize);
    };


    document.getElementById('gameSizeMulti').oninput = () => {
        document.getElementById('clientGameSizeMulti').innerHTML = parseInt(document.getElementById('gameSizeMulti').value) + 100;

        let multiSettings = setSettings(document.getElementById('gameSpeedMulti').value, document.getElementById('gameSizeMulti').value);
        setConfigItem('gameSpeed', multiSettings.gameSpeed);
        setConfigItem('gameSize', multiSettings.gameSize);
    };

    document.getElementById('startLength').oninput = () => {
        document.getElementById('clientStartLengthMulti').innerHTML = document.getElementById('startLength').value;
        setConfigItem('startLength', document.getElementById('startLength').value)
    };

    document.getElementById('gameSpeedMulti').oninput();
    document.getElementById('gameSizeMulti').oninput();
    document.getElementById('clientStartLengthMulti').innerHTML = 3;
    document.getElementById('startLength').value = 3;
    document.getElementById('startLength').oninput();
    

    document.getElementById('multiPlay').onsubmit = (ev) => {
        ev.preventDefault();
        location.href = `/start/snake/${getConfig().gameSpeed}/${getConfig().gameSize}/${getConfig().startLength}`;
    };



    /* Options */
    const keyInps = [
        {button: document.getElementById('upKey'), dis: document.getElementById('upKeyDis'), name: 'up'},
        {button: document.getElementById('leftKey'), dis: document.getElementById('leftKeyDis'), name: 'left'},
        {button: document.getElementById('rightKey'), dis: document.getElementById('rightKeyDis'), name: 'right'},
        {button: document.getElementById('downKey'), dis: document.getElementById('downKeyDis'), name: 'down'}
    ];
    keyInps.forEach((el) => {
        function keyDown(ev) {
            setConfigItem(el.name, ev.keyCode);
            setConfigItem(`${el.name}Key`, ev.key);
            el.dis.innerHTML = ev.key;
        }
        el.button.addEventListener('keydown', keyDown)
        el.dis.innerHTML = settings[`${el.name}Key`];
    });


    /* Build a snake */
    document.querySelectorAll('#head').forEach((el) => {
        el.src = settings.head;
    });
    document.querySelectorAll('#head').forEach((el) => {
        el.style.cursor = 'pointer';
    });
    document.querySelectorAll('#head').forEach((el) => {
        el.onclick = () => {
            document.getElementById('headInput').click();
        };
    });

    document.getElementById('headInput').oninput = () => {
        document.querySelectorAll('#head').forEach((el) => {
            el.src = '/static/img/loading.gif';
        });
        let file = document.getElementById('headInput').files[0];
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.name = file.name;
        reader.size = file.size;
        reader.onload = (ev) => {
            let img = new Image();
            img.src = ev.target.result;
            img.size = ev.target.size;
            img.onload = (ev) => {
                let canvas = document.createElement('canvas');
                canvas.width = 60;
                canvas.height = 60;

                let ctx = canvas.getContext('2d');
                ctx.drawImage(ev.target, 0, 0, canvas.width, canvas.height);

                let imgSrc = ctx.canvas.toDataURL('image/png', 1);
                document.querySelectorAll('#head').forEach((el) => {
                    el.src = imgSrc;
                });

                setConfigItem('head', imgSrc);
                resetCanvas() 
            };
        };
    };

    document.querySelectorAll('#body').forEach((el) => {
        el.src = settings.straight;
    });
    document.querySelectorAll('#body').forEach((el) => {
        el.style.cursor = 'pointer';
    });
    document.querySelectorAll('#body').forEach((el) => {
        el.onclick = async () => {
            document.getElementById('bodyInput').click();
        };
    });

    document.getElementById('bodyInput').oninput = () => {
        document.querySelectorAll('#body').forEach((el) => {
            el.src = '/static/img/loading.gif';
        });
        let file = document.getElementById('bodyInput').files[0];
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.name = file.name;
        reader.size = file.size;
        reader.onload = (ev) => {
            let img = new Image();
            img.src = ev.target.result;
            img.size = ev.target.size;
            img.onload = (ev) => {
                let canvas = document.createElement('canvas');
                canvas.width = 60;
                canvas.height = 60;

                let ctx = canvas.getContext('2d');
                ctx.drawImage(ev.target, 0, 0, canvas.width, canvas.height);

                let imgSrc = ctx.canvas.toDataURL('image/png', 1);
                document.querySelectorAll('#body').forEach((el) => {
                    el.src = imgSrc;
                });

                setConfigItem('straight', imgSrc);
                resetCanvas() 
            };
        };
    };

    document.querySelectorAll('#tail').forEach((el) => {
        el.src = settings.tail;
    });
    document.querySelectorAll('#tail').forEach((el) => {
        el.style.cursor = 'pointer';
    });
    document.querySelectorAll('#tail').forEach((el) => {
        el.onclick = async () => {
            document.getElementById('tailInput').click();
        };
    });

    document.getElementById('tailInput').oninput = () => {
        document.querySelectorAll('#tail').forEach((el) => {
            el.src = '/static/img/loading.gif';
        });
        let file = document.getElementById('tailInput').files[0];
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.name = file.name;
        reader.size = file.size;
        reader.onload = (ev) => {
            let img = new Image();
            img.src = ev.target.result;
            img.size = ev.target.size;
            img.onload = (ev) => {
                let canvas = document.createElement('canvas');
                canvas.width = 60;
                canvas.height = 60;

                let ctx = canvas.getContext('2d');
                ctx.drawImage(ev.target, 0, 0, canvas.width, canvas.height);

                let imgSrc = ctx.canvas.toDataURL('image/png', 1);
                document.querySelectorAll('#tail').forEach((el) => {
                    el.src = imgSrc;
                });

                setConfigItem('tail', imgSrc);
                resetCanvas() 
            };
        };
    };

    document.querySelectorAll('#corner').forEach((el) => {
        el.src = settings.corner;
    });
    document.querySelectorAll('#corner').forEach((el) => {
        el.style.cursor = 'pointer';
    });
    document.querySelectorAll('#corner').forEach((el) => {
        el.onclick = async () => {
            document.getElementById('cornerInput').click();
        };
    });

    document.getElementById('cornerInput').oninput = () => {
        document.querySelectorAll('#corner').forEach((el) => {
            el.src = '/static/img/loading.gif';
        });
        let file = document.getElementById('cornerInput').files[0];
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.name = file.name;
        reader.size = file.size;
        reader.onload = (ev) => {
            let img = new Image();
            img.src = ev.target.result;
            img.size = ev.target.size;
            img.onload = (ev) => {
                let canvas = document.createElement('canvas');
                canvas.width = 60;
                canvas.height = 60;

                let ctx = canvas.getContext('2d');
                ctx.drawImage(ev.target, 0, 0, canvas.width, canvas.height);

                let imgSrc = ctx.canvas.toDataURL('image/png', 1);
                document.querySelectorAll('#corner').forEach((el) => {
                    el.src = imgSrc;
                });

                setConfigItem('corner', imgSrc);
                resetCanvas() 
            };
        };
    };


    document.querySelectorAll('#food').forEach((el) => {
        el.src = settings.food;
    });
    document.querySelectorAll('#food').forEach((el) => {
        el.style.cursor = 'pointer';
    });
    document.querySelectorAll('#food').forEach((el) => {
        el.onclick = async () => {
            document.getElementById('foodInput').click();
        };
    });

    document.getElementById('foodInput').oninput = () => {
        document.querySelectorAll('#food').forEach((el) => {
            el.src = '/static/img/loading.gif';
        });
        let file = document.getElementById('foodInput').files[0];
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.name = file.name;
        reader.size = file.size;
        reader.onload = (ev) => {
            let img = new Image();
            img.src = ev.target.result;
            img.size = ev.target.size;
            img.onload = (ev) => {
                let canvas = document.createElement('canvas');
                canvas.width = 60;
                canvas.height = 60;

                let ctx = canvas.getContext('2d');
                ctx.drawImage(ev.target, 0, 0, canvas.width, canvas.height);

                let imgSrc = ctx.canvas.toDataURL('image/png', 1);
                document.querySelectorAll('#food').forEach((el) => {
                    el.src = imgSrc;
                });

                setConfigItem('food', imgSrc);
                resetCanvas() 
            };
        };
    };
};

/*function showPopup (param) {
    param ? (() => {
        Swal.fire({
            icon: 'info',
            html: '<div style="font-size: medium; color: grey;"><b style="font-size: large; color: white;">Game Speed</b><br>Game speed is how often the snake will move. 1000ms are equal to 1 second.</div>'
        });
    })() : (() => {
        Swal.fire({
            icon: 'info',
            html: '<div style="font-size: medium; color: grey;"><b style="font-size: large; color: white;">Game Speed</b><br>Game speed is how often the snake will move. 1000ms are equal to 1 second.<br><b style="font-size: large; color: white;">Game Time</b><br>Game is how long the game will last for.</div>'
        });
    })();
};*/


function joinGame() {
    Swal.fire({
        title: 'Enter your Game ID',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Join',
        showLoaderOnConfirm: true,
        preConfirm: (id) => {
            return fetch(`/api?${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                };
                return response.json();
            })
            .catch(error => {
                Swal.showValidationMessage(`Looks like that Game ID doesn't exist`);
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
    .then((result) => {
        if (result.isConfirmed) {
            location.href = `/play/${result.value.id}`;
        };
    });
};

function resetSettings() {
    Swal.fire({
        position: 'bottom-start',
        icon: 'success',
        title: 'Settings have been reset',
        showConfirmButton: false,
        timer: 1000,
        backdrop: false,
        timerProgressBar: true
    });
};


function resetCanvas() {
    if (window.interval) clearInterval(interval);
    const snakePath = [
        {coords: {x: 30, y: 30}, vel: {x: 30, y: 0}},
        {coords: {x: 240, y: 30}, vel: {x: 0, y: 30}},
        {coords: {x: 240, y: 240}, vel: {x: -30, y: 0}},
        {coords: {x: 30, y: 240}, vel: {x: 0, y: -30}}
    ];
    let vel = {x: 30, y: 0};
    let snake = [{x:30, y:30, name: 'Toffee1347', vel: vel, id: 0}];
    let current = -1;
    let lengthDebt = 5;
    window.canvas = new MultiCanvas('snakePreview', getConfig(), 30);
    let settings = getConfig();
    canvas.setImage(0, {
        head: settings.head,
        body: settings.straight,
        tail: settings.tail,
        corner: settings.corner
    });
    window.interval = setInterval(() => {
        if (current >= 3) current = -1;
        if (snakePath[current + 1].coords.x == snake[0].x && snakePath[current + 1].coords.y == snake[0].y) {
            vel = snakePath[current + 1].vel;
            current++;
        };

        snake.unshift({x:snake[0].x + vel.x, y:snake[0].y + vel.y, name: 'Toffee1347', vel: vel, id: 0});
        if (lengthDebt) lengthDebt--;
        else snake.pop();

        canvas.drawGame({players: [snake], food: [{x: 135, y: 135}]});
    }, 100);
};
resetCanvas();