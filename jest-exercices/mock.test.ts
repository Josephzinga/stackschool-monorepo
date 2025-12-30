function great(callback: (name: string) => string) {
  try {
    return callback('nathan');
  } catch (e) {
    return 'fallback';
  }
}

test('great', () => {
  const mockcb = jest.fn().mockImplementation((name) => {
    throw new Error(`on a rencontré un erreur ${name}`);
  });

  great(mockcb);

  expect(mockcb).toHaveBeenCalled();

  expect(mockcb).toHaveBeenCalledWith('nathan');
  expect(great(mockcb)).toBe('fallback');
});
