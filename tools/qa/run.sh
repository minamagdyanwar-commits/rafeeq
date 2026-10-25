#!/bin/bash
# usage: tools/qa/run.sh [smoke|contrast|all]
cd "$(dirname "$0")"
case "${1:-all}" in
 smoke) node smoke.mjs;;
 contrast) node contrast.mjs "${@:2}";;
 all) node smoke.mjs && node contrast.mjs;;
esac
