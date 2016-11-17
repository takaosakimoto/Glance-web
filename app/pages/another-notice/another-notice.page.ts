import {Page, NavController, Alert, NavParams} from "ionic-angular/index";
import {Dashboard} from "../../providers/dashboard.model";
import {DashboardPage} from '../dashboard/dashboard.page';
@Page({
    templateUrl: 'build/pages/another-notice/another-notice.html',
})
export class AnotherNoticePage {
   public noticetitle: string= '';
  

    constructor(protected nav: NavController,
                public navparams : NavParams
                ) {
        
        this.noticetitle=navparams.get("noticetitle");
    }

    onNewnotice(){
        this.nav.pop();
    }

    gotodashboard(){
        this.nav.setRoot(DashboardPage);
    }

    
}
