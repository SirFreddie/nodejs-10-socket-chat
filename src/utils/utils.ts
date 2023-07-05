export const createMessage = (name: string, message: string) => {
	return {
		name,
		message,
		date: new Date().getTime(),
	};
};
