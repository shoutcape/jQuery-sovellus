import firebase from '../../firebaseconfig.js';

const loginForm = $('#loginForm');
const registerLink = $('#registerLink');
const container = $('.pure-container');

container.hide();
container.slideDown(300);

// add submit listener to the loginform
loginForm.on('submit', function (e) {
    e.preventDefault();
    let email = $('#email')[0].value;
    let password = $('#password')[0].value;
    authenticateLogin(email, password);
});

registerLink.on('click', async function () {
    changePage('../registerPage/register.html')
});

async function authenticateLogin(email, password) {
    await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async () => {
            showNotification('Login Successful', 2000)
            changePage('../forumPage/forum.html', 1000)
        })
        .catch((error) => {
            let message = error.message
            if (error.message.includes('LOGIN_CREDENTIALS')) {
                message = 'Invalid Login Credentials'
                // this will produce a POST 400 error because of firebase, No way to remove it currently
            }
            showNotification(message, 2000);
        });
}

function showNotification(message, displayTime) {
    if ($('.notification').length === 0) {
        let speed = 300;
        let notification = $(`<div class="notification">${message}</div>`);
        if (message == 'Login Successful') {
           notification.css('background-color', 'lightgreen') 
        }
        container.append(notification);
        notification.slideDown(speed);
        // timer for the removal of the notification
        setTimeout(() => {
            notification.slideUp(speed, function () {
                notification.remove();
            });
        }, displayTime);
    }
}

/* 
the async/await authenticateLogin function needs a promise so we return a promise of a slideUp function, 
this creates a wait for the animation
*/
function containerSlideUp(element, duration) {
    return new Promise((resolve) => {
        element.slideUp(duration, resolve);
    });
}

// add delay if you want to show user a message before moving on
function changePage(destination, delay=0) {
    setTimeout(async () => {
        await containerSlideUp(container, 300)
        window.location.href = destination
    }, delay)
}