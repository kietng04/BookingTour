# 📘 HƯỚNG DẪN SỬ DỤNG OVERLEAF

## ⚠️ LƯU Ý QUAN TRỌNG

File `report.tex` **ĐÃ ĐƯỢC FIX** và sẵn sàng compile!

**Lỗi bạn gặp**: HTML tag `</figure>` thay vì LaTeX `\end{figure}`

**✅ ĐÃ FIX**: File local đã correct rồi!

---

## 🚀 CÁCH UPLOAD LÊN OVERLEAF

### Option 1: Upload File report.tex Mới (RECOMMENDED)

1. Trong Overleaf project của bạn
2. Click vào file `report.tex` (hoặc `main.tex`)
3. **DELETE toàn bộ nội dung cũ**
4. Copy toàn bộ nội dung từ file local `report.tex` (đã fix)
5. Paste vào Overleaf
6. Click "Recompile"

### Option 2: Upload Lại Toàn Bộ Project

1. Download file `report.tex` từ folder local này
2. Trong Overleaf: Menu → "Delete Project" (tạo mới)
3. New Project → Upload Project
4. Upload toàn bộ `latex-report/` folder
5. Set main document: `report.tex`
6. Click "Recompile"

---

## 🔍 KIỂM TRA TRƯỚC KHI COMPILE

### Check 1: Line 379
```latex
# ĐÚNG ✅
\end{figure}

# SAI ❌
</figure>
```

### Check 2: Figure Balance
- Phải có **31 `\begin{figure}`**
- Phải có **31 `\end{figure}`**

---

## 🐛 NẾU VẪN LỖI

### Lỗi: "begin{figure} on input line 368 ended by \end{document}"

**Nguyên nhân**: Line 379 vẫn có `</figure>` (HTML)

**Giải pháp**:
1. Tìm line 379 trong Overleaf
2. Thay `</figure>` → `\end{figure}` (thêm dấu backslash `\`)

### Kiểm tra nhanh:
```latex
# Search trong Overleaf:
</figure>

# Nếu tìm thấy → Thay bằng:
\end{figure}
```

---

## ✅ FILE ĐÃ FIX

File `report.tex` trong folder `latex-report/` **ĐÃ CORRECT**!

Verify:
```bash
cd latex-report
grep "</figure>" report.tex
# Không có kết quả = GOOD!

grep "\\\\end{figure}" report.tex | wc -l
# Kết quả: 31 = GOOD!
```

---

## 📋 CHECKLIST

Trước khi compile:
- [ ] Line 379 có `\end{figure}` (KHÔNG phải `</figure>`)
- [ ] Tất cả `\begin{figure}` đều có matching `\end{figure}`
- [ ] File encoding là UTF-8
- [ ] Không có tree characters (├──, │, └──)

---

## 🎯 NẾU VẪN KHÔNG ĐƯỢC

**Download file đã fix sẵn**:
```
C:\Users\Kiet\Desktop\BookingTour\latex-report\report.tex
```

Copy TOÀN BỘ nội dung → Paste vào Overleaf → Compile

---

## 💡 TIP

Trong Overleaf, nếu compile fail:
1. Click "Logs and output files"
2. Tìm dòng có "line XXX"
3. Đó là dòng có lỗi
4. Fix line đó

---

**Status**: ✅ File đã sẵn sàng, chỉ cần upload đúng version!
