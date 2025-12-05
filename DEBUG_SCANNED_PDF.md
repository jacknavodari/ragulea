# 🔍 Debugging Guide - Why Model Can't Find Scanned PDF

## Current Status

I've added detailed debugging to show exactly what's happening when you ask questions. This will help us figure out why the model can't find your scanned PDF.

---

## 🎯 How to Debug

### **Step 1: Ask a Question**
1. Refresh your browser
2. Ask a question about your scanned PDF
3. Watch the **backend terminal** (where Python is running)

### **Step 2: Check the Terminal Output**

You'll see something like this:

```
🔍 CHAT REQUEST:
   Query: what is in the document?
   Model: llama3
   Embedding Model: mxbai-embed-large:latest
   Collection Filter: None
   Searching ALL collections (8 total)
   📁 documents_pdf: 5 documents
   📁 documents_text: 3 documents
   📁 documents_asasasas: 0 documents
   Total documents searched: 8
   Top 5 results:
      1. Score: 0.8234 | File: mydoc.pdf | Preview: This is the content...
      2. Score: 0.7891 | File: other.txt | Preview: Some other text...
```

---

## 🔍 What to Look For

### **Issue 1: No Documents Found**
```
Total documents searched: 0
```
**Meaning:** The scanned PDF wasn't saved to the database
**Solution:** Re-upload the PDF

---

### **Issue 2: Wrong Embedding Model**
```
Embedding Model: mxbai-embed-large:latest
📁 documents_pdf: 0 documents
```
**Meaning:** PDF was embedded with a different model
**Check:** What embedding model did you use when uploading?
**Solution:** Use the same embedding model for searching

---

### **Issue 3: Collection Filter Active**
```
Collection Filter: ['text']
Searching collections: ['text']
📁 documents_text: 3 documents
```
**Meaning:** You're only searching "text" collection, but PDF is in "pdf" collection
**Solution:** Clear collection filters or select the right collection

---

### **Issue 4: Low Similarity Scores**
```
Top 5 results:
   1. Score: 0.1234 | File: scanned.pdf | Preview: ...
```
**Meaning:** Document found but similarity score is very low
**Possible causes:**
- OCR extracted garbled text
- Query doesn't match document content
- Embedding quality issue

---

## 🎯 Common Scenarios

### **Scenario 1: PDF Not in Database**
```
Total documents searched: 0
```
**What to do:**
1. Re-upload the scanned PDF
2. Watch terminal for OCR messages
3. Should see: "OCR Page 1: XXX characters"

---

### **Scenario 2: Wrong Collection**
```
Collection Filter: ['asasasas']
📁 documents_asasasas: 0 documents
Total documents searched: 0
```
**What to do:**
1. Clear collection filter (deselect all badges)
2. Or select the correct collection
3. Try searching again

---

### **Scenario 3: Embedding Model Mismatch**
```
Embedding Model: nomic-embed-text:latest
📁 documents_pdf: 0 documents
```
**What to do:**
1. Check what embedding model you used for upload
2. Select the SAME model in the dropdown
3. Try searching again

---

## 📝 Step-by-Step Test

### **Test 1: Upload Fresh**
1. Delete old scanned PDF from database (if possible)
2. Upload scanned PDF again
3. Watch terminal for:
   ```
   📄 No text found, attempting OCR...
   OCR Page 1: 1234 characters
   ✅ Created collection
   ```

### **Test 2: Search Without Filters**
1. Make sure NO collection badges are selected (all gray)
2. Ask a simple question
3. Check terminal output

### **Test 3: Check Embedding Model**
1. Note which embedding model you're using
2. Make sure it's the same one used for upload
3. Default is: `mxbai-embed-large:latest`

---

## 🔧 Quick Fixes

### **Fix 1: Clear All Filters**
```
1. Click any blue badges to deselect them
2. All badges should be gray
3. Try searching again
```

### **Fix 2: Use Same Embedding Model**
```
1. Check "Embedding Model" dropdown
2. Select: mxbai-embed-large:latest
3. Try searching again
```

### **Fix 3: Re-upload PDF**
```
1. Upload scanned PDF again
2. Watch for OCR messages in terminal
3. Try searching immediately after
```

---

## 📊 What the Debug Output Tells You

### **Good Output (Working):**
```
🔍 CHAT REQUEST:
   Total documents searched: 15
   Top 5 results:
      1. Score: 0.8234 | File: scanned.pdf | Preview: actual text...
```
→ **Everything working!**

### **Bad Output (Not Working):**
```
🔍 CHAT REQUEST:
   Total documents searched: 0
   Top 0 results:
```
→ **Nothing found - check filters and embedding model**

---

## 🚀 Try This Now

1. **Refresh your browser**
2. **Ask a question** about your scanned PDF
3. **Watch the terminal** where Python is running
4. **Copy the output** and tell me what you see

The debug output will show us exactly what's wrong!

---

## 📋 Checklist

Before asking a question, verify:
- [ ] No collection filters active (or correct collection selected)
- [ ] Same embedding model as used for upload
- [ ] Document actually uploaded (check Custom Collections count)
- [ ] Browser refreshed after any changes

---

**Try asking a question now and share what you see in the terminal!** 🔍
