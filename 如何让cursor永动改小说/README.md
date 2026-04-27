# Novel Iteration Loop

这个目录包含一个三角色小说迭代流程：

- `agents/assigner.md`：指派者，负责每轮生成任务单。
- `agents/literary_critic.md`：文学评论家，按故事新颖性、文采、情节紧凑程度评分并反馈。
- `agents/creator.md`：创作者，读取本轮 `review.md` 后改写小说。
- `scripts/novel_iteration_loop.sh`：编排 100 轮迭代的 Bash 脚本。

## 运行方式

脚本需要一个能从 stdin 读取 prompt、从 stdout 输出回复的 agent 命令。通过 `AGENT_CMD` 或 `--agent-cmd` 传入：

```bash
AGENT_CMD='your-agent-command' scripts/novel_iteration_loop.sh
```

默认会运行 100 轮，读取并覆盖 `story.md`，同时把每轮产物写到 `outputs/novel-loop/`：

- `round_{index}_assignment.md`
- `round_{index}_review.md`
- `review.md`
- `round_{index}_story.md`
- 每个角色的 prompt 快照

## 试运行

不调用真实 agent，只验证文件流转：

```bash
scripts/novel_iteration_loop.sh --rounds 1 --dry-run --output-dir outputs/dry-run
```

## 常用参数

```bash
scripts/novel_iteration_loop.sh \
  --rounds 100 \
  --story story.md \
  --output-dir outputs/novel-loop \
  --timeout 600
```

使用 Cursor Agent 的示例：

```bash
AGENT_CMD='cursor-agent -p --mode ask --trust --output-format text "$(cat)"' \
  scripts/novel_iteration_loop.sh --rounds 100
```
