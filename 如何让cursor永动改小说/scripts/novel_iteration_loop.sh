#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AGENTS_DIR="$ROOT/agents"
AGENT_CMD='cursor-agent -p --mode ask --trust --output-format text "$(cat)"'

ROUNDS=100
START_ROUND=1
STORY="$ROOT/story.md"
OUTPUT_DIR="$ROOT/outputs/novel-loop"
AGENT_CMD="${AGENT_CMD:-}"
TIMEOUT_SECONDS=600
DRY_RUN=0

usage() {
  cat <<'EOF'
Usage: scripts/novel_iteration_loop.sh [options]

Options:
  --rounds N             Number of rounds to run. Default: 100
  --start-round N        First round index. Default: 1
  --story PATH           Story file to read and rewrite. Default: story.md
  --output-dir PATH      Directory for round files. Default: outputs/novel-loop
  --agent-cmd COMMAND    Agent command. Can also use AGENT_CMD env var
  --timeout N            Per-agent timeout in seconds. Default: 600
  --dry-run              Write prompts and placeholder outputs without agent calls
  -h, --help             Show this help

AGENT_CMD must read a prompt from stdin or use "$(cat)" internally.
Example:
  AGENT_CMD='cursor-agent -p --mode ask --trust --output-format text "$(cat)"' \
    scripts/novel_iteration_loop.sh --rounds 1
EOF
}

abs_path() {
  local path="$1"
  if [[ "$path" = /* ]]; then
    printf '%s\n' "$path"
  else
    printf '%s/%s\n' "$ROOT" "$path"
  fi
}

rel_path() {
  local path="$1"
  if [[ "$path" == "$ROOT/"* ]]; then
    printf '%s\n' "${path#"$ROOT/"}"
  else
    printf '%s\n' "$path"
  fi
}

write_text() {
  local path="$1"
  local content="$2"
  mkdir -p "$(dirname "$path")"
  printf '%s\n' "$content" > "$path"
}

strip_outer_code_fence() {
  local input="$1"
  local output="$2"
  awk '
    { lines[NR] = $0 }
    END {
      if (NR >= 3 && lines[1] ~ /^```/ && lines[NR] ~ /^```[[:space:]]*$/) {
        for (i = 2; i < NR; i++) print lines[i]
      } else {
        for (i = 1; i <= NR; i++) print lines[i]
      }
    }
  ' "$input" > "$output"
}

run_agent() {
  local prompt_file="$1"
  local output_file="$2"
  local error_file="$3"

  if [[ -z "$AGENT_CMD" ]]; then
    echo "Set AGENT_CMD or pass --agent-cmd. Use --dry-run to inspect prompts." >&2
    exit 1
  fi

  if command -v timeout >/dev/null 2>&1; then
    timeout "$TIMEOUT_SECONDS" bash -lc "$AGENT_CMD" < "$prompt_file" > "$output_file" 2> "$error_file"
  else
    bash -lc "$AGENT_CMD" < "$prompt_file" > "$output_file" 2> "$error_file" &
    local pid=$!
    local elapsed=0
    while kill -0 "$pid" 2>/dev/null; do
      if (( elapsed >= TIMEOUT_SECONDS )); then
        kill "$pid" 2>/dev/null || true
        wait "$pid" 2>/dev/null || true
        echo "Agent command timed out after ${TIMEOUT_SECONDS}s: $AGENT_CMD" >&2
        exit 1
      fi
      sleep 1
      elapsed=$((elapsed + 1))
    done
    wait "$pid"
  fi

  if [[ ! -s "$output_file" ]]; then
    echo "Agent command returned empty output: $AGENT_CMD" >&2
    if [[ -s "$error_file" ]]; then
      echo "--- stderr ---" >&2
      sed 's/^/  /' "$error_file" >&2
    fi
    exit 1
  fi
}

deterministic_assignment() {
  local round_index="$1"
  cat <<EOF
# Round $round_index Assignment

- 本轮编号：$round_index
- 评论家需要特别关注：设定是否仍有惊喜、语言是否具体、每个场景是否推动冲突。
- 创作者必须保留：核心悬念、主要人物动机、已经形成记忆点的意象。
- 创作者优先解决：删减解释性段落，强化关键选择的代价，并让结尾产生新的推进。
EOF
}

deterministic_review() {
  local round_index="$1"
  cat <<EOF
# Round $round_index Review

## Scores

- 故事新颖性：7.0/10
- 文采：7.0/10
- 情节紧凑程度：7.0/10
- 综合评分：7.0/10

## 总评

这是 dry-run 生成的占位评论，用于验证文件流转，不代表真实文学评价。

## 具体反馈

- 强化人物选择带来的后果。
- 减少解释性文字，让信息从行动和场景中显露。
- 保留最有辨识度的意象，并让它参与情节推进。

## 下一轮改写建议

- 让主角在关键场景中做出不可逆选择。
- 用一个具体物件承载核心秘密。
- 收束支线，把每段都连接到主要冲突。
EOF
}

while (($#)); do
  case "$1" in
    --rounds)
      ROUNDS="$2"
      shift 2
      ;;
    --start-round)
      START_ROUND="$2"
      shift 2
      ;;
    --story)
      STORY="$(abs_path "$2")"
      shift 2
      ;;
    --output-dir)
      OUTPUT_DIR="$(abs_path "$2")"
      shift 2
      ;;
    --agent-cmd)
      AGENT_CMD="$2"
      shift 2
      ;;
    --timeout)
      TIMEOUT_SECONDS="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! [[ "$ROUNDS" =~ ^[0-9]+$ ]] || (( ROUNDS < 1 )); then
  echo "--rounds must be at least 1" >&2
  exit 1
fi

if ! [[ "$START_ROUND" =~ ^[0-9]+$ ]] || (( START_ROUND < 1 )); then
  echo "--start-round must be at least 1" >&2
  exit 1
fi

if [[ ! -f "$STORY" ]]; then
  echo "Story file does not exist: $STORY" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

LATEST_REVIEW="$OUTPUT_DIR/review.md"
LOG_PATH="$OUTPUT_DIR/iteration_log.md"
STORY_REL="$(rel_path "$STORY")"
END_ROUND=$((START_ROUND + ROUNDS - 1))

for ((round_index = START_ROUND; round_index <= END_ROUND; round_index++)); do
  assignment_prompt="$OUTPUT_DIR/round_${round_index}_assignment_prompt.md"
  assignment_raw="$OUTPUT_DIR/round_${round_index}_assignment.raw.md"
  assignment_file="$OUTPUT_DIR/round_${round_index}_assignment.md"
  critic_prompt="$OUTPUT_DIR/round_${round_index}_critic_prompt.md"
  review_raw="$OUTPUT_DIR/round_${round_index}_review.raw.md"
  review_file="$OUTPUT_DIR/round_${round_index}_review.md"
  creator_prompt="$OUTPUT_DIR/round_${round_index}_creator_prompt.md"
  story_raw="$OUTPUT_DIR/round_${round_index}_story.raw.md"
  story_snapshot="$OUTPUT_DIR/round_${round_index}_story.md"
  error_file="$OUTPUT_DIR/round_${round_index}_agent.stderr.log"

  {
    cat "$AGENTS_DIR/assigner.md"
    cat <<EOF

---

当前轮次：$round_index
当前小说文件：$STORY_REL

当前小说全文：

\`\`\`markdown
EOF
    cat "$STORY"
    cat <<'EOF'
```

上一轮评论，若为空则代表这是第一轮：

```markdown
EOF
    if [[ -f "$LATEST_REVIEW" ]]; then
      cat "$LATEST_REVIEW"
    else
      echo "无"
    fi
    cat <<'EOF'
```

请输出本轮任务单。
EOF
  } > "$assignment_prompt"

  if (( DRY_RUN )); then
    deterministic_assignment "$round_index" > "$assignment_file"
  else
    run_agent "$assignment_prompt" "$assignment_raw" "$error_file"
    strip_outer_code_fence "$assignment_raw" "$assignment_file"
  fi

  {
    cat "$AGENTS_DIR/literary_critic.md"
    cat <<EOF

---

请评论第 $round_index 轮小说。

本轮任务单：

\`\`\`markdown
EOF
    cat "$assignment_file"
    cat <<EOF
\`\`\`

当前小说文件：$STORY_REL

当前小说全文：

\`\`\`markdown
EOF
    cat "$STORY"
    cat <<EOF
\`\`\`

请把输出视为将写入 \`round_${round_index}_review.md\` 的完整内容。
EOF
  } > "$critic_prompt"

  if (( DRY_RUN )); then
    deterministic_review "$round_index" > "$review_file"
  else
    run_agent "$critic_prompt" "$review_raw" "$error_file"
    strip_outer_code_fence "$review_raw" "$review_file"
  fi
  cp "$review_file" "$LATEST_REVIEW"

  {
    cat "$AGENTS_DIR/creator.md"
    cat <<EOF

---

请根据第 $round_index 轮评论改写小说。

当前小说文件：$STORY_REL

本轮任务单：

\`\`\`markdown
EOF
    cat "$assignment_file"
    cat <<'EOF'
```

当前小说全文：

```markdown
EOF
    cat "$STORY"
    cat <<'EOF'
```

当前 loop 的 review.md 内容：

```markdown
EOF
    cat "$review_file"
    cat <<'EOF'
```

请只输出改写后的完整小说正文。
EOF
  } > "$creator_prompt"

  if (( DRY_RUN )); then
    cp "$STORY" "$story_snapshot"
  else
    run_agent "$creator_prompt" "$story_raw" "$error_file"
    strip_outer_code_fence "$story_raw" "$story_snapshot"
    cp "$story_snapshot" "$STORY"
  fi

  printf -- '- %s round %s: assignment, review, and story snapshot written\n' \
    "$(date '+%Y-%m-%dT%H:%M:%S')" "$round_index" >> "$LOG_PATH"
  printf 'round %s complete\n' "$round_index"
done
