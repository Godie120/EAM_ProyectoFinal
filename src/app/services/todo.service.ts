import { ToDo } from './../interfaces/todo.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TodoService {
	constructor(private db: AngularFirestore) {}

	/**
	 * Función para cargar todos los ToDos en la BD.
	 */
	getTodoList(): Observable<ToDo[]> {
		return this.db.collection<ToDo>('todos').valueChanges();
	}

	/**
	 * Función para insertar un nuevo ToDo a la BD.
	 */
	addTodo(name: string): void {
		const id = this.db.createId();
		this.db.collection('todos').doc(id).set({ id, name: name, status: false });
	}

	/**
	 * Función para eliminar un ToDo de la BD.
	 */
	deleteTodo(todo: ToDo): void {
		this.db.collection('todos').doc(todo.id).delete();
	}

	/**
	 * Función para eliminar todos ToDo dados por completo.
	 */
	clearTodoCompleted(todoListComplete: ToDo[]): void {
		todoListComplete.map((todo) => {
			this.deleteTodo(todo);
		});
	}

	/**
	 * Función para actualizar un ToDo de la BD.
	 */
	updateTodo(todo: ToDo): void {
		this.db
			.collection('todos')
			.doc(todo.id)
			.set({ id: todo.id, name: todo.name, status: todo.status });
	}

	/**
	 * Función para cambiar el estado de varios ToDo.
	 */
	updateStatusTodo(todoList: ToDo[], status: boolean): void {
		todoList.map((todo) => {
			this.db
				.collection('todos')
				.doc(todo.id)
				.set({ id: todo.id, name: todo.name, status: status });
		});
	}
}
