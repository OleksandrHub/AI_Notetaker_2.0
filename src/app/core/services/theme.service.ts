import { Injectable } from "@angular/core";
import { THEME_STORAGE_KEY, TOKEN_KEY } from "../../shared/constants";

@Injectable({ providedIn: 'root' })
export class ThemeService {
    public loadTheme() {
        const userIdString = localStorage.getItem(TOKEN_KEY);
        if (!userIdString) {
            document.body.classList.remove('dark-theme');
            return;
        }
        const userId = +userIdString;
        const darkThemeUsers = this.getDarkThemeUserIds();
        const isDarkTheme = darkThemeUsers.includes(userId);
        document.body.classList.toggle('dark-theme', isDarkTheme);
    }

    public changeTheme(): string {
        const userIdString = localStorage.getItem(TOKEN_KEY);
        if (!userIdString) { return 'Dark mode'; }
        const userId = +userIdString;
        let darkThemeUsers = this.getDarkThemeUserIds();
        const userHadDarkTheme = darkThemeUsers.includes(userId);

        if (userHadDarkTheme) {
            darkThemeUsers = darkThemeUsers.filter(id => id !== userId);
        } else {
            darkThemeUsers.push(userId);
        }

        this.saveDarkThemeUserIds(darkThemeUsers);
        const isDarkTheme = !userHadDarkTheme;
        document.body.classList.toggle('dark-theme', isDarkTheme);

        return isDarkTheme ? 'Light mode' : 'Dark mode';
    }

    private getDarkThemeUserIds(): number[] {
        const storedIds = localStorage.getItem(THEME_STORAGE_KEY);
        try {
            return storedIds ? JSON.parse(storedIds) : [];
        } catch (e) {
            console.error('Could not parse dark theme user IDs from local storage.', e);
            return [];
        }
    }

    private saveDarkThemeUserIds(ids: number[]): void {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(ids));
    }

}