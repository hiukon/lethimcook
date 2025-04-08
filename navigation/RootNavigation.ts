// RootNavigation.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Type-safe navigate
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate({ name, params } as any); // ép kiểu này là OK vì TS sẽ kiểm tra ở trên rồi
  }
}
