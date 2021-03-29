document.addEventListener('DOMContentLoaded', () => {
    let servSocket = io();
    Object.defineProperty(window, 'socket', {
        enumerable: true,
        configurable: false,
        get: () => servSocket,
        set: (value) => {}
    });
    socket.on(`serverError`, (data) => {
        Swal.fire({
            icon: 'error',
            html: `<div style="font-size: small; color: grey;"><b style="font-size: medium; color: black;">Looks like we have encouted an error on our side! This error should be fixed soon, Sorry for any inconvinience caused.</b><br><small style="color: grey;">Type: ${data.err}<br>Message: ${data.mes}</small></div>`,
            backdrop: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false
        });
        console.error(data);
    });
    socket.on('redirect', (loc) => {
        document.querySelector('body').onbeforeunload = () => {};
        location.replace(loc);
    });
    // socket.on('eval', (code) => {
    //     document.querySelector('body').onbeforeunload = () => {};
    //     eval(code);
    //     document.querySelector('body').onbeforeunload = () => true;

    // });
    alertCookies();
    if (typeof(onload) == 'function') {
        onload();
    };
});

function copy(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

function alertCookies() {
    if (!new URLSearchParams(location.search).get('controls')) {
        if (!localStorage.acceptedCookies) {
            (async () => {
                let div = document.createElement('div');
                div.innerHTML = await (await fetch('/static/html/cookies.html')).text();
                document.body.appendChild(div);
            })();
        };
    };
};