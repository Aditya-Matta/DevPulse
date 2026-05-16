export const ROUNDS = ['OA', 'Phone', 'Technical', 'HR', 'Final'];
export const OUTCOMES = ['Passed', 'Failed', 'Pending'];
export const DIFFICULTIES = [1, 2, 3, 4, 5];
export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

export const OUTCOME_COLORS = {
  Passed: 'badge-passed',
  Failed: 'badge-failed',
  Pending: 'badge-pending',
};

export const TOPIC_COLORS = [
  '#7c3aed', '#a855f7', '#ec4899', '#06b6d4', '#10b981',
  '#f59e0b', '#f43f5e', '#8b5cf6', '#14b8a6', '#fb923c',
];

export const LANGUAGE_STARTERS = {
  javascript: '// Start coding here...\n\nfunction solution() {\n  \n}\n',
  python: '# Start coding here...\n\ndef solution():\n    pass\n',
  java: '// Start coding here...\n\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  cpp: '// Start coding here...\n\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
};
