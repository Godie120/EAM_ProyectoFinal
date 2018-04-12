import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Importar Servicios
import { TodoService } from './services/todo.service';

//Importar Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

//Importar Environment Config
import { environment } from '../environments/environment';

//Importar Componentes
import { AppComponent } from './app.component';
import { TodoComponent } from './components/todo/todo.component';

@NgModule({
	declarations: [ AppComponent, TodoComponent ],
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule.enablePersistence()
	],
	providers: [ TodoService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
