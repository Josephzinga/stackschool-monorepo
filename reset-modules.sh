REP="node_modules"

sudo find . -type d -name "$REP" -prune -exec rm -rf {} +

echo "Opération terminée. Tous les '$REP' ont été supprimés."
