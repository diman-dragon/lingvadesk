#!/bin/bash
# Проверка вёрстки в настоящем Chromium: запуск из корня проекта:  tools/qa-layout/all.sh [файл-отчёт]
# Нужны: node 22, python3 + playwright, chromium (/opt/pw-browsers/chromium; иначе поправьте путь в qa.py). Скриншоты — tools/qa-layout/shots/.
cd "$(dirname "$0")/../.."
OUT="${1:-/dev/stdout}"
node --no-warnings tools/qa-layout/server.mjs > /dev/null 2>&1 &
S=$!
sleep 3
(cd tools/qa-layout && mkdir -p shots && python3 qa.py) > "$OUT" 2>&1
kill $S
