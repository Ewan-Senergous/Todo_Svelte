import { PrismaClient, type Todo } from '@prisma/client';

export const db = new PrismaClient();

class TodoService {
	// Récupérer toutes les tâches triées par ordre
	async get(): Promise<Todo[]> {
		return db.todo.findMany({
			orderBy: { order: 'asc' } // Trier par ordre croissant
		});
	}

	// Récupérer une tâche par ID
	async getById(id: number): Promise<Todo | null> {
		return db.todo.findUnique({
			where: { id }
		});
	}

	// Ajouter une nouvelle tâche avec un ordre calculé automatiquement
	async add(todo: Omit<Todo, 'id' | 'order'>): Promise<Todo> {
		const lastTodo = await db.todo.findFirst({
			orderBy: { order: 'desc' }
		});

		const newOrder = lastTodo ? lastTodo.order + 1 : 0;

		return db.todo.create({
			data: { ...todo, order: newOrder } // Ajouter automatiquement l'ordre
		});
	}

	// Mettre à jour une tâche ou son ordre
	async update(id: number, todo: Partial<Omit<Todo, 'id'>>): Promise<Todo> {
		return db.todo.update({
			where: { id },
			data: { ...todo }
		});
	}

	// Supprimer une tâche
	async remove(id: number): Promise<void> {
		await db.todo.delete({
			where: { id }
		});
	}

	// Récupérer les tâches filtrées
	async getFiltered(
		searchTerm?: string,
		page = 1,
		pageSize = 10
	): Promise<{
		items: Todo[];
		total: number;
		page: number;
		size: number;
		pages: number;
	}> {
		const take = pageSize;
		const skip = (page - 1) * take;

		const where = searchTerm
			? {
					OR: [
						{ title: { contains: searchTerm, mode: 'insensitive' } },
						{ priority: { equals: searchTerm } }
					]
				}
			: {};

		const [items, total] = await Promise.all([
			db.todo.findMany({ where, take, skip, orderBy: { order: 'asc' } }), // Trier par ordre
			db.todo.count({ where })
		]);

		return { items, total, page, size: take, pages: Math.ceil(total / take) };
	}

	// Rechercher des tâches par titre
	async searchByTitle(title: string): Promise<Todo[]> {
		return db.todo.findMany({
			where: {
				title: {
					contains: title
				}
			}
		});
	}

	// Générer des tâches fictives
	async createFromFakeHolder(): Promise<void> {
		try {
			const response = await fetch('https://jsonplaceholder.typicode.com/todos');
			const todos = await response.json();

			for (const todo of todos) {
				const priorities: Todo['priority'][] = ['low', 'medium', 'high'];
				const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
				const randomDueDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);

				await this.add({
					title: todo.title,
					description: todo.title,
					completed: todo.completed,
					priority: randomPriority,
					dueDate: randomDueDate
				});
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des todos :', error);
		}
	}
}

export const todoService = new TodoService();
