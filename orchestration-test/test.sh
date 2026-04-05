#!/usr/bin/env bash
set -euo pipefail

grep -q "Hello World" "$(dirname "$0")/hello-world.md"
echo "ok"

