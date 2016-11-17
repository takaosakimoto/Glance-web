import {Page, NavController} from "ionic-angular/index";
import {EditBoardPage} from "../edit-board/edit-board.page";
import {EditNoticePage} from "../edit-notice/edit-notice.page";
import {DeleteNoticePage} from "../delete-notice/delete-notice.page";
import {DashboardCache} from "../../providers/dashboard.cache";
import {Board} from "../../providers/board.model";

@Page({
    templateUrl: 'build/pages/manage-boards/manage-boards.html',
})
export class ManageBoardsPage {

    protected myBoard: Board = null;

    constructor(protected nav: NavController, protected dashboards: DashboardCache) {
        dashboards.myDashboard().then(dashboard => {
            this.myBoard = dashboard.boards.find(board => board.is_manager);
        }).catch(err => {
            console.log("Failed to retrieve dashboard", err);
        });
    }

    onCreateBoard() {
        this.nav.push(EditBoardPage);
    }

    onEditBoard() {
        this.nav.push(EditBoardPage)
    }
    
    onCreateNotice() {
        this.nav.push(EditNoticePage)
    }
    onManageNotice() {
        this.nav.push(DeleteNoticePage);
    }
}
