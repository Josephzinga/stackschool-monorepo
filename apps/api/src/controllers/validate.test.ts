import { validateLogin } from '../validations/validate';
// On suppose que LoginFormType a des champs comme 'identifier' (email/username) et 'password'

describe('validateLogin', () => {
  it('devrait retourner des erreurs pour des données invalides', () => {
    // Cas invalide : mot de passe vide ou email invalide
    // Note: Les règles exactes dépendent de loginFormSchema dans @stackschool/shared
    const invalidData = {
      identifier: '', // Supposons que l'identifiant est requis
      password: '', // Supposons que le mot de passe est requis
    };

    const errors = validateLogin(invalidData as any);

    expect(errors).toBeDefined();
    expect(Array.isArray(errors)).toBe(true);
    expect(errors!.length).toBeGreaterThan(0);
    expect(errors![0]).toHaveProperty('field');
    expect(errors![0]).toHaveProperty('message');
  });

  it('devrait retourner undefined pour des données valides', () => {
    // Cas valide
    const validData = {
      identifier: 'test@example.com',
      password: 'password123',
    };

    const errors = validateLogin(validData as any);

    expect(errors).toBeUndefined();
  });
});
