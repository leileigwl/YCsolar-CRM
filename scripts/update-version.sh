#!/bin/bash

# 更新版本号脚本

# 检查是否提供了版本号
if [ -z "$1" ]; then
  echo "错误: 请提供新的版本号"
  echo "用法: ./scripts/update-version.sh 1.1.3"
  exit 1
fi

NEW_VERSION=$1

# 读取当前版本
CURRENT_VERSION=$(grep -o '"version": *"[^"]*"' config/version.json | cut -d'"' -f4)

echo "当前版本: $CURRENT_VERSION"
echo "新版本: $NEW_VERSION"

# 更新版本配置文件
sed -i "s|\"version\": *\"$CURRENT_VERSION\"|\"version\": \"$NEW_VERSION\"|g" config/version.json

echo "版本已更新为 $NEW_VERSION"

# 显示git提交命令提示
echo ""
echo "建议执行以下Git命令:"
echo "git add config/version.json"
echo "git commit -m \"版本更新: $CURRENT_VERSION -> $NEW_VERSION\""
echo "git tag v$NEW_VERSION"
echo "git push && git push --tags" 