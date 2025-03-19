import get from 'lodash.get';
import isEqual from 'lodash.isequal';

export function shouldUpdate(a: any, b: any, paths: string[]): boolean {
  for (let i = 0; i < paths.length; i++) {
    const equals = isEqual(get(a, paths[i]), get(b, paths[i]));
    if (!equals) {
      return true;
    }
  }
  return false;
} 