// HTML references
var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
	window.location = 'index.html';
	throw new Error('Name and room are required');
}

let user = {
	name: params.get('name'),
	room: params.get('room'),
};

// Socket client
const socket = io();

// Listen to server connection
socket.on('connect', () => {
	console.log('Connected to server');

	// Join chat
	socket.emit('join-chat', user, resp => {
		// console.log('Users connected: ', resp);
		renderUsers(resp);
	});
});

// Listen to server disconnection
socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

// Listen to server messages
socket.on('create-message', payload => {
	renderMessages(payload, false);
	scrollBottom();
	// console.log('Server says: ', payload);
});

// Listen to user changes, when a user joins or exit the chat
socket.on('list-users', users => {
	// console.log(users);
	renderUsers(users);
});

// Private messages
socket.on('private-message', payload => {
	console.log('Private message: ', payload);
});
