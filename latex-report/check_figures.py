#!/usr/bin/env python3
import re

with open('report.tex', 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines, 1):
    if r'\begin{figure}' in line:
        stack.append(i)
        print(f"Line {i}: \\begin{{figure}} (stack: {len(stack)})")
    elif r'\end{figure}' in line:
        if stack:
            begin_line = stack.pop()
            print(f"Line {i}: \\end{{figure}} matches line {begin_line} (stack: {len(stack)})")
        else:
            print(f"Line {i}: EXTRA \\end{{figure}} (no matching begin!)")

if stack:
    print(f"\n❌ ERROR: Unclosed \\begin{{figure}} at lines: {stack}")
else:
    print(f"\n✅ All figures properly closed!")
