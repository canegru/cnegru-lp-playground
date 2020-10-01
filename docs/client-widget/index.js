const handleMessage = ({ data }) => {
    if (data.username) {
        const userNameDiv = document.getElementById('username');
        userNameDiv.value = data.username;
    }
}

window.addEventListener('message', handleMessage, false);
