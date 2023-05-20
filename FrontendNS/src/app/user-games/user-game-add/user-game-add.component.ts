import { Component } from '@angular/core';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-user-game-add',
  templateUrl: './user-game-add.component.html',
  styleUrls: ['./user-game-add.component.css']
})
export class UserGameAddComponent {
  gameList: Game[];
  filterString: string;
  isDropdownVisible: boolean;

  constructor(
    private gameService: GameService
    ) {}

  showDropdownList() {
    this.isDropdownVisible = true;
  }

  hideDropdownList() {
    this.isDropdownVisible = false;
  }

  clearInput() {
    this.filterString = '';
  }

  ngOnInit() {
    this.filterString = '';
    this.isDropdownVisible = false;
    this.gameService.getGamesList().subscribe((response: any) => {
      this.gameList = response;
    })
  }
}
