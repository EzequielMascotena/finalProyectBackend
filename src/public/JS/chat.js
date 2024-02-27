//socket del lado del cliente 
const socket = io()

const chatBox = document.getElementById('caja');
chatBox.scrollTop = chatBox.scrollHeight;

const addMenssage = () => {
    const msg = {
        user: document.getElementById('email').value,
        message: document.getElementById('message').value
    }

    socket.emit('newMenssage', msg)
    document.getElementById('message').value = '';
    return false
}

socket.on('allMsgs', (data) => {
    render(data)
    let chat = document.getElementById('caja')
    chat.scrollTop = chat.scrollHeight
})

const render = (data) => {
    const html = data.map(el => {
        return (
            `
            <div>
                <strong>${el.user}</strong> dice <em> ${el.message} </em>
            </div>
            `
        )
    }).join(' ')
    document.getElementById('caja').innerHTML = html
}