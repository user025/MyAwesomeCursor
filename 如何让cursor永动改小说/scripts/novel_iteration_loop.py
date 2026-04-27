#!/usr/bin/env python3
"""Run a creator/critic novel iteration loop.

The script expects an agent command that reads a prompt from stdin and writes
the agent response to stdout. Configure it with AGENT_CMD or --agent-cmd.
"""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
AGENTS_DIR = ROOT / "agents"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def strip_outer_code_fence(text: str) -> str:
    stripped = text.strip()
    if not stripped.startswith("```") or not stripped.endswith("```"):
        return text.strip()

    lines = stripped.splitlines()
    if len(lines) < 3:
        return text.strip()
    return "\n".join(lines[1:-1]).strip()


def run_agent(agent_cmd: str, prompt: str, timeout: int) -> str:
    try:
        completed = subprocess.run(
            agent_cmd,
            input=prompt,
            text=True,
            shell=True,
            capture_output=True,
            timeout=timeout,
            cwd=ROOT,
            check=False,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(f"Agent command timed out after {timeout}s: {agent_cmd}") from exc

    if completed.returncode != 0:
        stderr = completed.stderr.strip()
        raise RuntimeError(
            f"Agent command failed with exit code {completed.returncode}: {agent_cmd}\n{stderr}"
        )

    output = completed.stdout.strip()
    if not output:
        raise RuntimeError(f"Agent command returned empty output: {agent_cmd}")
    return output


def build_assigner_prompt(
    role_prompt: str,
    round_index: int,
    story_path: Path,
    story: str,
    previous_review: str,
) -> str:
    return f"""{role_prompt}

---

当前轮次：{round_index}
当前小说文件：{story_path.relative_to(ROOT)}

当前小说全文：

```markdown
{story}
```

上一轮评论，若为空则代表这是第一轮：

```markdown
{previous_review or "无"}
```

请输出本轮任务单。
"""


def build_critic_prompt(
    role_prompt: str,
    round_index: int,
    assignment: str,
    story_path: Path,
    story: str,
) -> str:
    return f"""{role_prompt}

---

请评论第 {round_index} 轮小说。

本轮任务单：

```markdown
{assignment}
```

当前小说文件：{story_path.relative_to(ROOT)}

当前小说全文：

```markdown
{story}
```

请把输出视为将写入 `round_{round_index}_review.md` 的完整内容。
"""


def build_creator_prompt(
    role_prompt: str,
    round_index: int,
    assignment: str,
    story_path: Path,
    story: str,
    review: str,
) -> str:
    return f"""{role_prompt}

---

请根据第 {round_index} 轮评论改写小说。

当前小说文件：{story_path.relative_to(ROOT)}

本轮任务单：

```markdown
{assignment}
```

当前小说全文：

```markdown
{story}
```

当前 loop 的 review.md 内容：

```markdown
{review}
```

请只输出改写后的完整小说正文。
"""


def deterministic_assignment(round_index: int) -> str:
    return f"""# Round {round_index} Assignment

- 本轮编号：{round_index}
- 评论家需要特别关注：设定是否仍有惊喜、语言是否具体、每个场景是否推动冲突。
- 创作者必须保留：核心悬念、主要人物动机、已经形成记忆点的意象。
- 创作者优先解决：删减解释性段落，强化关键选择的代价，并让结尾产生新的推进。
"""


def deterministic_review(round_index: int) -> str:
    return f"""# Round {round_index} Review

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
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run a 100-round novel iteration loop.")
    parser.add_argument("--rounds", type=int, default=100, help="number of rounds to run")
    parser.add_argument("--start-round", type=int, default=1, help="first round index")
    parser.add_argument(
        "--story",
        type=Path,
        default=ROOT / "story.md",
        help="story file to read and rewrite",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=ROOT / "outputs" / "novel-loop",
        help="directory for round files",
    )
    parser.add_argument(
        "--agent-cmd",
        default=os.environ.get("AGENT_CMD"),
        help="command that reads prompt from stdin and writes response to stdout",
    )
    parser.add_argument("--timeout", type=int, default=600, help="per-agent timeout in seconds")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="write prompts and placeholder outputs without calling an agent command",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    story_path = args.story if args.story.is_absolute() else ROOT / args.story
    output_dir = args.output_dir if args.output_dir.is_absolute() else ROOT / args.output_dir

    if args.rounds < 1:
        raise SystemExit("--rounds must be at least 1")
    if not story_path.exists():
        raise SystemExit(f"Story file does not exist: {story_path}")
    if not args.dry_run and not args.agent_cmd:
        raise SystemExit("Set AGENT_CMD or pass --agent-cmd. Use --dry-run to inspect prompts.")

    assigner_role = read_text(AGENTS_DIR / "assigner.md")
    critic_role = read_text(AGENTS_DIR / "literary_critic.md")
    creator_role = read_text(AGENTS_DIR / "creator.md")

    output_dir.mkdir(parents=True, exist_ok=True)
    latest_review_path = output_dir / "review.md"
    log_path = output_dir / "iteration_log.md"

    start = args.start_round
    end = start + args.rounds - 1

    for round_index in range(start, end + 1):
        story = read_text(story_path)
        previous_review = read_text(latest_review_path) if latest_review_path.exists() else ""

        assignment_prompt = build_assigner_prompt(
            assigner_role, round_index, story_path, story, previous_review
        )
        write_text(output_dir / f"round_{round_index}_assignment_prompt.md", assignment_prompt)
        if args.dry_run:
            assignment = deterministic_assignment(round_index)
        else:
            assignment = run_agent(args.agent_cmd, assignment_prompt, args.timeout)
        assignment = strip_outer_code_fence(assignment)
        write_text(output_dir / f"round_{round_index}_assignment.md", assignment)

        critic_prompt = build_critic_prompt(
            critic_role, round_index, assignment, story_path, story
        )
        write_text(output_dir / f"round_{round_index}_critic_prompt.md", critic_prompt)
        if args.dry_run:
            review = deterministic_review(round_index)
        else:
            review = run_agent(args.agent_cmd, critic_prompt, args.timeout)
        review = strip_outer_code_fence(review)
        write_text(output_dir / f"round_{round_index}_review.md", review)
        write_text(latest_review_path, review)

        creator_prompt = build_creator_prompt(
            creator_role, round_index, assignment, story_path, story, review
        )
        write_text(output_dir / f"round_{round_index}_creator_prompt.md", creator_prompt)
        if args.dry_run:
            revised_story = story
        else:
            revised_story = run_agent(args.agent_cmd, creator_prompt, args.timeout)
        revised_story = strip_outer_code_fence(revised_story)
        write_text(story_path, revised_story)
        write_text(output_dir / f"round_{round_index}_story.md", revised_story)

        timestamp = datetime.now().isoformat(timespec="seconds")
        with log_path.open("a", encoding="utf-8") as log_file:
            log_file.write(
                f"- {timestamp} round {round_index}: "
                f"assignment, review, and story snapshot written\n"
            )

        print(f"round {round_index} complete", flush=True)

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("Interrupted.", file=sys.stderr)
        raise SystemExit(130)
