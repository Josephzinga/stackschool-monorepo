'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ScanPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');

  const mutation = useMutation({
    mutationFn: () => {
      return new Promise((resolve) => setTimeout(() => resolve, 1000));
    },
    onSuccess: () => {
      setStatus('success');
      setMessage('Présence enregistrée avec succès !');
    },
    onError: (error: any) => {
      setStatus('error');
      setMessage(error.message || 'Erreur lors de l’enregistrement');
    },
  });

  useEffect(() => {
    if (sessionId) {
      mutation.mutate({ sessionId });
    } else {
      setStatus('error');
      setMessage('Session invalide');
    }
  }, [sessionId]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Présence</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && <p>Enregistrement en cours...</p>}
          {status === 'success' && (
            <p className="text-green-600">✅ {message}</p>
          )}
          {status === 'error' && <p className="text-red-600">❌ {message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
