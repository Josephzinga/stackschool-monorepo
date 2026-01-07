REP="node_modules"

sudo find . -type d -name "$REP" -prune -exec rm -rf {} +
rm pnpm-lock.yaml
pnpm install

echo "Opération terminée. Tous les '$REP' ont été supprimés et réinstaller."
