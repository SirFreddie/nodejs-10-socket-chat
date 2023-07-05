import { Socket } from 'socket.io';
import { Users } from '../models/users.model';
import { createMessage } from '../utils/utils';

const users: Users = new Users();

export const socketController = (socket: Socket) => {
	console.log('Client connected', socket.id);

	socket.on('join-chat', (user, cb) => {
		if (!user.name || !user.room) {
			return (
				cb &&
				cb({
					ok: false,
					message: 'Name and room are required',
				})
			);
		}

		socket.join(user.room);

		users.addUser(socket.id, user.name, user.room);

		socket.broadcast
			.to(user.room)
			.emit('list-users', users.getUsersByRoom(user.room));

		socket.broadcast
			.to(user!.room)
			.emit(
				'create-message',
				createMessage('Admin', `${user?.name} joined the chat.`)
			);

		return cb && cb(users.getUsersByRoom(user.room));
	});

	socket.on('create-message', (payload, cb) => {
		const user = users.getUser(socket.id);

		const message = createMessage(user?.name || 'No name', payload.message);

		socket.broadcast.to(user!.room).emit('create-message', message);

		return cb && cb(message);
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected', socket.id);
		const deletedUser = users.removeUser(socket.id);

		socket.broadcast
			.to(deletedUser!.room)
			.emit(
				'create-message',
				createMessage('Admin', `${deletedUser?.name} has left the chat.`)
			);

		socket.broadcast
			.to(deletedUser!.room)
			.emit('list-users', users.getUsersByRoom(deletedUser!.room));
	});

	// Private message
	socket.on('private-message', payload => {
		const user = users.getUser(socket.id);

		if (!user) {
			return;
		}

		socket.broadcast
			.to(payload.to)
			.emit('private-message', createMessage(user.name, payload.message));
	});
};
