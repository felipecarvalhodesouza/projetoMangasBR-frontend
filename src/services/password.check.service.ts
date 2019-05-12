import { Injectable } from "@angular/core";

// Object to check password strengths and various properties
@Injectable()
export class PasswordCheckService {

    // Expected length of all passwords
    public static get MinimumLength(): number {
        return 5;
    }

    // Regex to check for a common password string - all based on 5+ length passwords
    private commonPasswordPatterns = /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

    //
    // Checks if the given password matches a set of common password
    //
    public isPasswordCommon(password: string): boolean {
        return this.commonPasswordPatterns.test(password);
    }

    //
    // Returns the strength of the current password
    //
    public checkPasswordStrength(password: string): string {

        // Build up the strenth of our password
        let numberOfElements = 0;
        numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Lowercase letters
        numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Uppercase letters
        numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;      // Numbers
        numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;   // Special characters (inc. space)

        // Assume we have a poor password already
        let currentPasswordStrength = "";

        // Check then strenth of this password using some simple rules
        if (password.length === 0) {
            currentPasswordStrength = null;
        } else if (password.length > 0 && password.length < PasswordCheckService.MinimumLength) {
            currentPasswordStrength = "Curto";
        } else if (this.isPasswordCommon(password) === true) {
            currentPasswordStrength = "Comum";
        } else if (numberOfElements === 1 || numberOfElements === 2) {
            currentPasswordStrength = "Fraco";
        } else if (numberOfElements === 3) {
            currentPasswordStrength = "Médio";
        } else {
            currentPasswordStrength = "Forte";
        }

        // Return the strength of this password
        return currentPasswordStrength;
    }
}