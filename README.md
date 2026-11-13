# UV Checker Generator

## 功能
- Windows 绿色便携版 EXE
- 自定义宽度、高度
- 正方形棋盘格
- 自定义行数、列数、颜色
- 连续编号、行列编号、UV 坐标、自定义格式
- 前缀、补零、编号顺序、编号位置
- UV 边界、方向标签、行列标签
- PNG 导出

## 开发环境
- Windows 10/11
- Node.js 18+（建议 20 LTS）
- npm

## 开发运行
```bash
npm install
npm start
```

## 打包绿色 EXE
```bash
npm run dist
```

生成文件位于：
`dist/UV-Checker-Generator-1.0.0-portable.exe`

## 自定义编号格式
可使用：
- `{index}` 连续编号
- `{row}` 行号
- `{col}` 列号
- `{u}` U 坐标
- `{v}` V 坐标

示例：
- `Tile_{row}_{col}`
- `UV_{u}_{v}`
- `ID_{index}`
