#!/usr/bin/env bash
# Perfiles de Claude Code y Codex (CACH-0106).
#
# Cada perfil tiene su propia configuración, login y aprobaciones de MCP:
#   Claude → CLAUDE_CONFIG_DIR=~/.claude-profiles/<perfil>
#   Codex  → CODEX_HOME=~/.codex-profiles/<perfil>
# El perfil "default" usa la configuración normal (~/.claude y ~/.codex).
# Solo usa mecanismos oficiales de las CLIs; no copia ni comparte credenciales.
#
# Compatible con el bash 3.2 de macOS.
set -euo pipefail

CLAUDE_ROOT="${CLAUDE_PROFILES_DIR:-$HOME/.claude-profiles}"
CODEX_ROOT="${CODEX_PROFILES_DIR:-$HOME/.codex-profiles}"

usage() {
  cat <<'EOF'
Uso: scripts/profiles.sh <comando> [perfil] [args…]

  list                    Perfiles existentes y si tienen config de Claude/Codex.
  new <perfil>            Crea el perfil e indica cómo hacer login en cada CLI.
  claude <perfil> [args]  Ejecuta `claude` con ese perfil (p. ej. `claude work -p "hola"`).
  codex <perfil> [args]   Ejecuta `codex` con ese perfil (p. ej. `codex work login`).
  env <perfil>            Imprime los `export` para usar el perfil en la shell actual:
                            eval "$(scripts/profiles.sh env work)"
  which                   Perfil activo en la shell actual.

Nombres de perfil: letras, números, "-" y "_". "default" = configuración normal.
EOF
}

die() { echo "profiles: $*" >&2; exit 1; }

check_name() {
  [ -n "${1:-}" ] || die "falta el nombre del perfil"
  case "$1" in
    *[!A-Za-z0-9_-]*) die "nombre no válido: $1" ;;
  esac
}

claude_dir() { echo "$CLAUDE_ROOT/$1"; }
codex_dir() { echo "$CODEX_ROOT/$1"; }

require_profile() {
  check_name "$1"
  [ "$1" = "default" ] && return 0
  [ -d "$(claude_dir "$1")" ] || [ -d "$(codex_dir "$1")" ] || die "el perfil '$1' no existe; créalo con: scripts/profiles.sh new $1"
}

claude_bin() {
  if command -v claude >/dev/null 2>&1; then echo claude
  elif [ -x "$HOME/.local/bin/claude" ]; then echo "$HOME/.local/bin/claude"
  else die "no encuentro el CLI 'claude' (instálalo o añade ~/.local/bin al PATH)"
  fi
}

cmd_list() {
  printf '%-16s %-8s %-8s\n' PERFIL CLAUDE CODEX
  printf '%-16s %-8s %-8s\n' default "$([ -d "$HOME/.claude" ] && echo sí || echo no)" "$([ -d "$HOME/.codex" ] && echo sí || echo no)"
  local names=""
  [ -d "$CLAUDE_ROOT" ] && names="$names $(ls -1 "$CLAUDE_ROOT")"
  [ -d "$CODEX_ROOT" ] && names="$names $(ls -1 "$CODEX_ROOT")"
  for name in $(echo "$names" | tr ' ' '\n' | sort -u); do
    [ -n "$name" ] || continue
    printf '%-16s %-8s %-8s\n' "$name" \
      "$([ -d "$(claude_dir "$name")" ] && echo sí || echo no)" \
      "$([ -d "$(codex_dir "$name")" ] && echo sí || echo no)"
  done
}

cmd_new() {
  check_name "${1:-}"
  [ "$1" != "default" ] || die "'default' ya existe: es la configuración normal"
  mkdir -p "$(claude_dir "$1")" "$(codex_dir "$1")"
  chmod 700 "$(claude_dir "$1")" "$(codex_dir "$1")"
  cat <<EOF
Perfil '$1' creado:
  Claude: $(claude_dir "$1")
  Codex:  $(codex_dir "$1")

Login (una vez por perfil):
  scripts/profiles.sh claude $1        # dentro, ejecuta /login
  scripts/profiles.sh codex $1 login

Al abrir 'claude' con este perfil en el repo, aprueba de nuevo los MCP 'codex' y 'cheap-worker'.
EOF
}

cmd_claude() {
  local name="${1:-}"; require_profile "$name"; shift
  local bin; bin="$(claude_bin)"
  if [ "$name" = "default" ]; then
    env -u CLAUDE_CONFIG_DIR "$bin" "$@"
  else
    CLAUDE_CONFIG_DIR="$(claude_dir "$name")" exec "$bin" "$@"
  fi
}

cmd_codex() {
  local name="${1:-}"; require_profile "$name"; shift
  command -v codex >/dev/null 2>&1 || die "no encuentro el CLI 'codex'"
  if [ "$name" = "default" ]; then
    env -u CODEX_HOME codex "$@"
  else
    CODEX_HOME="$(codex_dir "$name")" exec codex "$@"
  fi
}

cmd_env() {
  local name="${1:-}"; require_profile "$name"
  if [ "$name" = "default" ]; then
    echo "unset CLAUDE_CONFIG_DIR CODEX_HOME"
  else
    printf 'export CLAUDE_CONFIG_DIR=%q\nexport CODEX_HOME=%q\n' "$(claude_dir "$name")" "$(codex_dir "$name")"
  fi
}

cmd_which() {
  local claude_name="default" codex_name="default"
  case "${CLAUDE_CONFIG_DIR:-}" in "$CLAUDE_ROOT"/*) claude_name="${CLAUDE_CONFIG_DIR#"$CLAUDE_ROOT"/}" ;; "") ;; *) claude_name="(personalizado: $CLAUDE_CONFIG_DIR)" ;; esac
  case "${CODEX_HOME:-}" in "$CODEX_ROOT"/*) codex_name="${CODEX_HOME#"$CODEX_ROOT"/}" ;; "") ;; *) codex_name="(personalizado: $CODEX_HOME)" ;; esac
  echo "Claude: $claude_name"
  echo "Codex:  $codex_name"
}

command="${1:-}"
[ $# -gt 0 ] && shift
case "$command" in
  list) cmd_list ;;
  new) cmd_new "$@" ;;
  claude) cmd_claude "$@" ;;
  codex) cmd_codex "$@" ;;
  env) cmd_env "$@" ;;
  which) cmd_which ;;
  ""|-h|--help|help) usage ;;
  *) usage >&2; exit 1 ;;
esac
