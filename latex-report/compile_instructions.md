# 📘 HƯỚNG DẪN COMPILE BÁO CÁO LATEX

## Tổng quan

File báo cáo: `report.tex`
Output mong muốn: `report.pdf`
Engine: `pdflatex` với package `vietnam` support

---

## ✅ Yêu cầu hệ thống

### 1. LaTeX Distribution

Cần cài đặt một trong các distribution sau:

**Windows:**
- MiKTeX (Recommended): https://miktex.org/download
- TeX Live: https://www.tug.org/texlive/

**macOS:**
- MacTeX: https://www.tug.org/mactex/

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install texlive-full

# Fedora
sudo dnf install texlive-scheme-full

# Arch
sudo pacman -S texlive-most
```

### 2. Required Packages

File `report.tex` sử dụng các packages sau (thường đã có sẵn trong full install):

- `vietnam` - Hỗ trợ tiếng Việt
- `graphicx` - Hình ảnh
- `listings` - Code syntax highlighting
- `xcolor` - Colors
- `hyperref` - Hyperlinks và bookmarks
- `geometry` - Page margins
- `fancyhdr` - Headers và footers
- `titlesec` - Section formatting
- `caption`, `subcaption` - Figure captions
- `booktabs` - Table formatting
- `enumitem` - List formatting
- `float` - Figure placement
- `longtable` - Long tables
- `array` - Table arrays

Nếu thiếu package, MiKTeX sẽ tự động tải khi compile.

---

## 🚀 Cách compile

### Phương pháp 1: Command Line (Recommended)

#### Windows (PowerShell/CMD):
```cmd
cd latex-report
pdflatex report.tex
pdflatex report.tex
```

#### Linux/macOS (Bash):
```bash
cd latex-report
pdflatex report.tex
pdflatex report.tex
```

**Note:** Chạy 2 lần để cập nhật Table of Contents và references.

#### Full compile (bao gồm bibliography nếu có):
```bash
pdflatex report.tex
bibtex report
pdflatex report.tex
pdflatex report.tex
```

### Phương pháp 2: LaTeX Editor

#### TeXstudio (Recommended):
1. Mở file `report.tex`
2. Chọn menu: **Tools → Build & View** (hoặc F5)
3. Hoặc click button "Build & View" (màu xanh lá)

#### Overleaf (Online - Recommended cho nhóm):
1. Tạo project mới: https://www.overleaf.com/
2. Upload toàn bộ thư mục `latex-report/`
3. Set main document: `report.tex`
4. Click "Recompile" button
5. Download PDF

**Ưu điểm Overleaf:**
- Không cần cài LaTeX local
- Collaborate real-time
- Auto-save
- Version history
- Tự động install packages

#### VS Code + LaTeX Workshop:
1. Install extension: LaTeX Workshop
2. Mở file `report.tex`
3. Ctrl+Alt+B (Build)
4. Ctrl+Alt+V (View PDF)

---

## 📂 Cấu trúc thư mục

Trước khi compile, đảm bảo cấu trúc như sau:

```
latex-report/
├── report.tex                  # Main LaTeX file
├── images/
│   ├── ui/                     # UI screenshots (18 files)
│   │   ├── 01_eureka_dashboard.png
│   │   ├── 02_login.png
│   │   └── ...
│   ├── code/                   # Source code screenshots (9 files)
│   │   ├── 01_gateway_routes.png
│   │   ├── 02_user_service_structure.png
│   │   └── ...
│   ├── diagrams/               # Architecture diagrams (4 files)
│   │   ├── 01_architecture.png
│   │   ├── 02_database_erd.png
│   │   ├── 03_tech_stack.png
│   │   └── 04_rabbitmq_flow.png
│   └── others/                 # Logo, misc
│       └── logo.png (optional)
├── README_IMAGES.md            # Image preparation guide
├── playwright_commands.sh      # Screenshot automation
└── compile_instructions.md     # This file
```

---

## 🖼️ Chuẩn bị hình ảnh

**QUAN TRỌNG:** Trước khi compile, cần có đầy đủ hình ảnh!

### Checklist:
- [ ] 18 UI screenshots trong `images/ui/`
- [ ] 9 source code screenshots trong `images/code/`
- [ ] 4 diagrams trong `images/diagrams/`
- [ ] Logo (optional) trong `images/others/`

### Hướng dẫn chi tiết:
Xem file: `README_IMAGES.md`

### Quick start - UI screenshots:
```bash
# Make script executable (Linux/macOS)
chmod +x playwright_commands.sh

# Run screenshot script
./playwright_commands.sh
```

---

## ⚙️ Compile với options

### Chỉ compile (không view):
```bash
pdflatex report.tex
```

### Compile với output directory:
```bash
pdflatex -output-directory=output report.tex
```

### Compile với draft mode (faster, no images):
```bash
pdflatex -draftmode report.tex
```

### Compile với interaction mode:
```bash
# Non-stop mode (không hỏi khi có lỗi)
pdflatex -interaction=nonstopmode report.tex

# Batch mode (không hiển thị output)
pdflatex -interaction=batchmode report.tex
```

---

## 🐛 Troubleshooting

### Lỗi: Package `vietnam` not found

**Solution 1 - MiKTeX:**
```cmd
# Mở MiKTeX Console
# → Packages → Search "vntex"
# → Install "vntex"
```

**Solution 2 - Command line:**
```bash
# MiKTeX
mpm --install=vntex

# TeX Live
tlmgr install vntex
```

### Lỗi: Image not found

**Nguyên nhân:** File hình không tồn tại

**Solution:**
1. Check file path trong `report.tex`
2. Verify file exists trong `images/` folder
3. Check file extension (.png, .jpg, .pdf)
4. Đảm bảo không có space trong tên file

**Quick fix:** Comment dòng `\includegraphics` tạm thời:
```latex
% \includegraphics[width=0.9\textwidth]{images/ui/01_eureka.png}
```

### Lỗi: Vietnamese characters không hiển thị

**Solution:** Đảm bảo file encoding là UTF-8
```bash
# Check encoding
file -bi report.tex

# Convert to UTF-8 if needed (Linux/macOS)
iconv -f ISO-8859-1 -t UTF-8 report.tex > report_utf8.tex
```

### Lỗi: Compile bị treo

**Solution:**
1. Ctrl+C để stop
2. Xóa các file tạm:
```bash
rm report.aux report.log report.out report.toc
```
3. Compile lại

### Warning: Overfull \hbox

**Nguyên nhân:** Text quá dài không fit trong margin

**Solution:**
- Không critical, có thể ignore
- Hoặc adjust text/break lines
- Hoặc thêm `\sloppy` vào preamble

### Warning: Reference undefined

**Nguyên nhân:** Chưa compile đủ lần

**Solution:** Compile 2 lần:
```bash
pdflatex report.tex
pdflatex report.tex
```

---

## 📊 Output Files

Sau khi compile thành công, sẽ có các files:

```
latex-report/
├── report.pdf          # ✅ Main output (file cần nộp)
├── report.aux          # Auxiliary file
├── report.log          # Compile log (check errors here)
├── report.out          # Hyperref output
├── report.toc          # Table of contents
├── report.lof          # List of figures
└── report.synctex.gz   # SyncTeX (for editor integration)
```

**File cần nộp:** `report.pdf`

**Files có thể xóa:** `.aux`, `.log`, `.out`, `.toc`, `.lof`, `.synctex.gz`

---

## 🎯 Best Practices

### 1. Compile nhiều lần
Để cập nhật TOC, references, page numbers:
```bash
pdflatex report.tex  # Lần 1: Generate aux files
pdflatex report.tex  # Lần 2: Update references
```

### 2. Check log file nếu có lỗi
```bash
# View last 50 lines của log
tail -50 report.log

# Search for errors
grep -i "error" report.log
```

### 3. Version control
Commit source `.tex` và images, **không commit** generated files:

**.gitignore:**
```
*.aux
*.log
*.out
*.toc
*.lof
*.synctex.gz
*.fdb_latexmk
*.fls
report.pdf
```

### 4. Backup
Backup thường xuyên hoặc dùng Overleaf (auto-save + history)

### 5. Validate PDF
Sau khi compile, kiểm tra:
- [ ] All pages rendered correctly
- [ ] Images hiển thị đầy đủ
- [ ] Table of Contents có links
- [ ] Vietnamese characters hiển thị đúng
- [ ] Hyperlinks hoạt động
- [ ] Page numbers correct

---

## 🌐 Upload lên Overleaf (Recommended)

### Bước 1: Tạo project
1. Đăng nhập: https://www.overleaf.com/
2. Click "New Project" → "Blank Project"
3. Đặt tên: "BookingTour Report"

### Bước 2: Upload files
1. Click "Upload" icon
2. Select all files trong `latex-report/` folder
3. Maintain folder structure (`images/ui/`, `images/code/`, etc.)

### Bước 3: Set main document
1. Click "Menu" (top left)
2. "Main document" → Select `report.tex`

### Bước 4: Compile
1. Click "Recompile" button
2. View PDF on right panel
3. Download PDF khi done

### Bước 5: Share với team (optional)
1. Click "Share" button
2. Add collaborators by email
3. Set permissions (View/Edit)

---

## 📖 Quick Reference

### Commands thường dùng:

```bash
# Compile basic
pdflatex report.tex

# Compile 2 lần (recommended)
pdflatex report.tex && pdflatex report.tex

# Clean build
rm *.aux *.log *.out *.toc *.lof
pdflatex report.tex
pdflatex report.tex

# View PDF (Linux)
xdg-open report.pdf

# View PDF (macOS)
open report.pdf

# View PDF (Windows)
start report.pdf
```

### Editor shortcuts:

**TeXstudio:**
- F5: Build & View
- F6: Compile
- F7: View PDF

**VS Code + LaTeX Workshop:**
- Ctrl+Alt+B: Build
- Ctrl+Alt+V: View PDF

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check log file:** `report.log` có thông tin chi tiết
2. **Google error message:** Copy exact error message
3. **TeX StackExchange:** https://tex.stackexchange.com/
4. **Overleaf docs:** https://www.overleaf.com/learn

---

## ✅ Final Checklist

Trước khi nộp báo cáo:

- [ ] All images đã được thêm vào `images/` folders
- [ ] Compile thành công không có errors
- [ ] PDF hiển thị đầy đủ nội dung
- [ ] Vietnamese characters hiển thị đúng
- [ ] Table of Contents có page numbers đúng
- [ ] List of Figures complete
- [ ] All figures có captions
- [ ] Hyperlinks hoạt động
- [ ] Page layout đẹp, không có overfull boxes
- [ ] Thông tin nhóm đúng (tên, MSSV)
- [ ] File size reasonable (< 20MB)

---

**Good luck! 🎓**

Prepared by: Claude Code
Date: December 2024
Project: BookingTour - J2EE Report
