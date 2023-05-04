import i18next from 'i18next';
import en from './english.json';
import ch from './chinese.json';
import { initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  resources: {
    en, ch
  },
  react: {
    useSuspense: false
  }
})
export default i18next;