import {Component, ViewChild, provide, enableProdMode, OnDestroy} from '@angular/core';
import {ionicBootstrap, Platform, Nav, MenuController, Modal} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Storage, LocalStorage} from 'ionic-angular';
import {WelcomePage} from './pages/welcome/welcome.page';
import {DashboardPage} from './pages/dashboard/dashboard.page';
import {ClientConfig} from "./providers/config";
import {UserService} from "./providers/user.service";
import {SearchUsersPage} from "./pages/search-users/search-users.page";
import {SettingsPage} from "./pages/settings/settings.page";
import {ManageBoardsPage} from "./pages/manage-boards/manage-boards.page";
import {BoardService} from "./providers/board.service";
import {NoticeService} from "./providers/notice.service";
import {DashboardService} from "./providers/dashboard.service";
import {DashboardCache} from "./providers/dashboard.cache";
import {HeathCheckService} from "./providers/healthcheck.service";
import {SessionCache} from "./providers/session.cache";
import {SessionService} from "./providers/session.service";
import {NoConnectionModal} from "./components/no-connection/no-connection.modal";
import {Push, CloudSettings, provideCloud, PushToken} from '@ionic/cloud-angular';
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'eb533d7b',
  },
  'push': {
    'sender_id': '754071665000',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};
declare var hockeyapp: any;

@Component({
    templateUrl: 'build/app.html'
})
export class MyApp implements OnDestroy {

    @ViewChild(Nav) nav: Nav;

    rootPage: any = WelcomePage;

    isManager: boolean = false;
    isAdmin: boolean = false;
    public signflag: boolean=false;
    constructor(platform: Platform,
                protected session: SessionCache,
                protected dashboard: DashboardCache,
                protected menu: MenuController) {

        menu.enable(true, 'mainMenu');
        localStorage.removeItem('flagreload');
        if(localStorage.getItem('flaglogin')){
            this.session
                .login(localStorage.getItem('email'), localStorage.getItem('password'))
                .then(this.loginSuccess.bind(this))
                .catch(this.loginFailure.bind(this));
           // this.signflag=true;
        } else{
            this.gotoMainPage();
        }

       // this.gotoMainPage();
        

        platform.ready().then(() => {
            StatusBar.styleDefault();
            
            if (typeof hockeyapp != "undefined") {
                console.log("hockeyapp found");
                hockeyapp.start(null, null, "8fc5776dcc254030bcd9568cf8836e2b");
            } else {
                console.log("hockeyapp not found");
            }
        });

        dashboard.updated.subscribe(this.onDashboardUpdated.bind(this));
    }




    loginSuccess() {
        
       this.nav.setRoot(DashboardPage);
    }

    loginFailure(response) {
        // FIXME move to service
         localStorage.clear();
        this.nav.setRoot(WelcomePage);
    }
    ngOnDestroy(): void {
        
        localStorage.clear();
    }

    onDashboardUpdated(myDashboardPromise) {
        if (myDashboardPromise == null) {
            console.log("Dashboard removed");
            this.isManager = false;
            this.isAdmin = false;
        } else {
            myDashboardPromise.then(myDashboard => {
                console.log("Dashboard updated %o", myDashboard);
                this.isManager = myDashboard.profile.is_manager;
                this.isAdmin = myDashboard.profile.is_admin;
            }).catch(err => {
                console.log("Dashboard update failed %o", err)
            });
        }
    }
    
    activateNoConnectionModal() {
        let modal = Modal.create(NoConnectionModal);
        this.nav.present(modal);
    }

    gotoMainPage() {
        this.session.current(true).then(user => {
            if (user != null) {
                console.log("Already logged in. Redirecting to dashboard %o", user);
                localStorage.setItem("flaglogin","1");
                this.signflag=true;
                this.nav.setRoot(DashboardPage);
            } else {
                console.log("Not logged in, stay on main page");
            }
        }).catch(res => {
            if (res.status == 401) {
                console.log("Session expired, stay on main page");
            } else {
                console.log("Connectivity problems, activate modal %o", res);
                this.activateNoConnectionModal();
            }
        });
    }

    onLogout() {
        this.dashboard.invalidate();
        this.session.logout().then(() => {
            localStorage.clear();
            console.log("Logged out");
        }).catch((err) => {
            console.log("Failed to log out %o", err)
        });
        this.nav.setRoot(WelcomePage);
    }

    onManageAccount() {
        this.nav.setRoot(SettingsPage);
    }

    onManageBoards() {
        this.nav.setRoot(ManageBoardsPage);
    }

    onManageUsers() {
        this.nav.setRoot(SearchUsersPage);
    }
    
    onDashboard() {
        this.nav.setRoot(DashboardPage);
    }

    openPage(page) {
        console.log(page);
        this.nav.setRoot(page);
    }

}
enableProdMode();
ionicBootstrap(MyApp, [SessionService, ClientConfig, UserService, BoardService, NoticeService, DashboardService,
    DashboardCache, HeathCheckService, SessionCache, provide(Storage, {useValue: new Storage(LocalStorage)} ), provideCloud(cloudSettings)], {
    tabbarPlacement: 'bottom'
});
