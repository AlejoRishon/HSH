import I18n from 'react-native-i18n';
import en from './en';
import ch from './ch';
 
I18n.fallbacks = true;
 
I18n.translations = {
  en,
  ch
};

export default I18n;