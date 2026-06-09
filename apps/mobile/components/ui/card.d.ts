import { Text } from '@/components/ui/text';
import { View, type ViewProps } from 'react-native';
import React from 'react';
declare function Card({ className, ...props }: ViewProps & React.RefAttributes<View>): React.JSX.Element;
declare function CardHeader({ className, ...props }: ViewProps & React.RefAttributes<View>): React.JSX.Element;
declare function CardTitle({ className, ...props }: React.ComponentProps<typeof Text> & React.RefAttributes<Text>): React.JSX.Element;
declare function CardDescription({ className, ...props }: React.ComponentProps<typeof Text> & React.RefAttributes<Text>): React.JSX.Element;
declare function CardContent({ className, ...props }: ViewProps & React.RefAttributes<View>): React.JSX.Element;
declare function CardFooter({ className, ...props }: ViewProps & React.RefAttributes<View>): React.JSX.Element;
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
//# sourceMappingURL=card.d.ts.map