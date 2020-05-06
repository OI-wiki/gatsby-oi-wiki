export default interface Settings {
  darkMode: DarkModeSettings;
  animation: AnimationSettings;
}

interface DarkModeSettings {
  type: 'user-preference' | 'scheduled' | 'always-on' | 'always-disable';
  brightness: number;
}

interface AnimationSettings {
  enable: boolean;
}
