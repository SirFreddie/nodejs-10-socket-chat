interface User {
	id: string;
	name: string;
	room: string;
}

export class Users {
	users: User[];

	constructor() {
		this.users = [];
	}

	addUser(id: string, name: string, room: string): User[] {
		const user: User = {
			id,
			name,
			room,
		};

		this.users.push(user);

		return this.users;
	}

	getUser(id: string): User | undefined {
		const user = this.users.find(user => user.id === id);
		return user;
	}

	getUsers(): User[] {
		return this.users;
	}

	getUsersByRoom(room: string): User[] {
		return this.users.filter(user => user.room === room);
	}

	removeUser(id: string): User | undefined {
		const deletedUser = this.getUser(id);

		if (deletedUser) {
			this.users = this.users.filter(user => user.id !== id);
		}

		return deletedUser;
	}
}
