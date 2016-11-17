import {Page, NavController} from "ionic-angular/index";
import {UserService} from "../../providers/user.service";
import {User} from "../../providers/user.model";
import {SessionErrors} from "../../providers/session.service";

@Page({
    templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {

    public profileErrors: SessionErrors = {};

    public passwordErrors: SessionErrors = {};

    public passwordSubmitted = false;
    public passwordSuccess = false;

    public profileSubmitted = false;
    public profileSuccess = false;

    constructor(public users: UserService,
                public nav: NavController) {

    }

    protected passwordUpdated() {
        console.log("Password successfully updated");
        this.passwordSuccess = true;
    }

    protected passwordUpdateFailed(response) {
        switch (response.status) {
            case 404: this.passwordErrors = {unreachable: true}; break;
            case 401: this.passwordErrors = {duplicate: true}; break;
            default: this.passwordErrors = {unknown: true};
        }
        console.log("Failed to update password", this.passwordErrors, response);
    }

    protected profileUpdated() {
        console.log("Password successfully updated");
        this.profileSuccess = true;
    }

    protected profileUpdateFailed(response) {
        switch (response.status) {
            case 404: this.profileErrors = {unreachable: true}; break;
            case 401: this.profileErrors = {duplicate: true}; break;
            default: this.profileErrors = {unknown: true};
        }
        console.log("Failed to update password", this.profileErrors, response);
    }

    onUpdatePassword(form) {

        this.passwordErrors = {};
        this.passwordSubmitted = true;
        this.passwordSuccess = false;

        if (!form.valid) {
            console.log("Invalid form", form);
            return Promise.resolve<User>(form);
        } else {
            console.log("Valid form, submitting");
            return this.users
                .updatePassword(form.controls.current_password.value, form.controls.new_password.value)
                .then(this.passwordUpdated.bind(this))
                .catch(this.passwordUpdateFailed.bind(this))
        }
    }

    onUpdateProfile(form) {

        this.profileErrors = {};
        this.profileSubmitted = true;
        this.profileSuccess = false;

        if (!form.valid) {
            console.log("Invalid form", form);
            return Promise.resolve<User>(form);
        } else {
            console.log("Valid form, submitting");
            return this.users
                .updateProfile(form.controls.fullname.value)
                .then(this.profileUpdated.bind(this))
                .catch(this.profileUpdateFailed.bind(this))
        }
    }
}
