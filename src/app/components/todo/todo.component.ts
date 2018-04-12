import { ToDo } from './../../interfaces/todo.interface';
import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';

@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html',
	styleUrls: [ './todo.component.css' ]
})
export class TodoComponent {
	// Lista de todos los ToDos
	todoListAll$: ToDo[];
	// Lista ToDo a mostrar.
	listTodo: ToDo[];
	// Variable que almacena el estado a consultar.
	statusTodo: boolean;
	// Variable que me indica se se va a filtrar.
	filterTodo: boolean;
	// Contador de ToDo completos.
	cantTodoComplete: number;
	// Contador de ToDo por completar.
	cantTodoIncomplete: number;
	// Variable que me permite editar
	modifyTodo: boolean;
	// Variable que muestra u oculta el menu
	showMenu: boolean;

	constructor(private todoService: TodoService) {
		this.getTodoList();
	}

	/**
   * Función que filtra los ToDo.
   */
	getTodoList() {
		this.todoService.getTodoList().subscribe((content) => {
			this.todoListAll$ = content;
			this.filterTodo ? this.getTodoFilter(this.statusTodo) : this.getTodoAll();
			this.countAllTodo();
		});
	}

	/**
   * Función que carga todos los ToDo.
   */
	getTodoAll() {
		this.filterTodo = false;
		this.listTodo = this.todoListAll$;
	}

	/**
   * Función que carga todos los ToDo.
   */
	countAllTodo() {
		this.cantTodoComplete = 0;
		this.cantTodoIncomplete = 0;
		this.todoListAll$.map((todo) => {
			todo.status ? this.cantTodoComplete++ : this.cantTodoIncomplete++;
		});

		this.cantTodoComplete + this.cantTodoIncomplete > 0
			? (this.showMenu = true)
			: (this.showMenu = false);
	}

	/**
   * Función empleado para listar los ToDo según el filtro de estado enviado.
   */
	getTodoFilter(status: boolean) {
		this.filterTodo = true;
		this.statusTodo = status;
		this.listTodo = this.todoListAll$.filter((todo) => todo.status === this.statusTodo);
	}

	/**
   * Función empleado para agregar un elemento más a la lista de ToDo.
   */
	addTodo(input: HTMLInputElement) {
		if (input.value !== '') {
			this.todoService.addTodo(input.value);
			input.value = null;
		}
	}

	/**
   * Función empleado para cambiar el estado a un ToDo.
   */
	updateTodo(todo: ToDo, status: boolean) {
		todo.status = !status;
		this.todoService.updateTodo(todo);
	}

	/**
   * Función empleado para cambiar el estado a un ToDo.
   */
	updateTodoEdit(todo: ToDo, name: string) {
		this.modifyTodo = false;
		todo.name = name;
		this.todoService.updateTodo(todo);
	}

	/**
   * Función empleado para eliminar un ToDo según su Id.
   */
	deleteTodo(todo: ToDo) {
		this.todoService.deleteTodo(todo);
	}

	/**
   * Función que permite eliminar los ToDo que se encuentran completos.
   */
	clearTodoCompleted() {
		const clearTodo: ToDo[] = this.todoListAll$.filter((todo) => todo.status === true);
		this.todoService.clearTodoCompleted(clearTodo);
	}

	/**
   * Función que permite cambiar el estado de todos los ToDo.
   */
	updateStatusTodo() {
		this.cantTodoIncomplete > 0
			? this.todoService.updateStatusTodo(
					this.todoListAll$.filter((todo) => todo.status === false),
					true
				)
			: this.todoService.updateStatusTodo(
					this.todoListAll$.filter((todo) => todo.status === true),
					false
				);
	}
}
