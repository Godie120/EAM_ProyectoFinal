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
			// Se valida si se está empleando un filtro actualmente.
			this.filterTodo ? this.getTodoFilter(this.statusTodo) : this.getTodoAll();
			// Se realiza el conteo de los ToDo
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
		// Se reinician los contadores.
		this.cantTodoComplete = 0;
		this.cantTodoIncomplete = 0;
		// Se recorre el listado completo de los ToDo.
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
		// Se asigna al listado que será mostrado los ToDo que cumplan con el filtro.
		this.listTodo = this.todoListAll$.filter((todo) => todo.status === this.statusTodo);
	}

	/**
   * Función empleado para agregar un elemento más a la lista de ToDo.
   */
	addTodo(input: HTMLInputElement) {
		// Se valida que el input no esté vacío.
		if (input.value !== '') {
			// Se crea el ToDo y se envía al servicio de registro.
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
		// Se aplica un filtro para seleccionar los ToDo que están completos.
		const clearTodo: ToDo[] = this.todoListAll$.filter((todo) => todo.status === true);
		this.todoService.clearTodoCompleted(clearTodo);
	}

	/**
   * Función que permite cambiar el estado de todos los ToDo.
   */
	updateStatusTodo() {
		// Se valida si falta algún ToDo por completar.
		this.cantTodoIncomplete > 0
			? // Si todos los ToDo están completos se les cambia el estado.
				this.todoService.updateStatusTodo(
					this.todoListAll$.filter((todo) => todo.status === false),
					true
				)
			: // Si algún ToDo está incompleto se completa.
				this.todoService.updateStatusTodo(
					this.todoListAll$.filter((todo) => todo.status === true),
					false
				);
	}
}
