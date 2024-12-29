import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	await prisma.todo.deleteMany();
	const todos = [
		{
			title: 'Acheter des courses',
			description: 'Lait, Pain, Œufs, Beurre',
			completed: false,
			priority: 'high',
			dueDate: new Date('2024-12-31')
		},
		{
			title: 'Terminer le rapport de projet',
			description: 'Finaliser la version pour le client',
			completed: false,
			priority: 'medium',
			dueDate: new Date('2024-12-29')
		}
	];

	await prisma.todo.createMany({
		data: todos
	});

	console.log('Base de données initialisée avec succès !');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
