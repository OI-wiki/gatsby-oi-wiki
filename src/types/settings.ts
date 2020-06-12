export default interface Settings {
  darkMode: DarkModeSettings;
  animation: AnimationSettings;
  theme: ThemeSettings;
}

interface DarkModeSettings {
  type: 'user-preference' | 'scheduled' | 'always-on' | 'always-off';
  brightness: number;
}

interface AnimationSettings {
  enable: boolean;
}

interface ThemeSettings {
  navColor: string;
}
