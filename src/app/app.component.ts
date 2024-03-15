import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatbotComponent} from './chatbot/chatbot.component';
import {TableauComponent} from "./tableau/tableau.component";


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'MarineCorpsCustomerExperienceEnhancement';
}
