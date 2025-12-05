# 🎯 Custom Collections Feature Guide

## Overview

You can now **create your own custom collections** directly from the RAGulea interface! This gives you complete control over how your documents are organized in MongoDB.

---

## ✨ What You Can Do

### 1. **Create Custom Collections**
- Create collections with any name you want
- Examples: "Research Papers", "Meeting Notes", "Code Documentation", "Legal Documents"
- Collections are created instantly in MongoDB

### 2. **Upload to Specific Collections**
- Choose which collection to upload files to
- Override auto-detection and manually organize your documents
- Keep related documents together

### 3. **Manage Collections**
- View all your custom collections
- See document counts for each collection
- Delete custom collections when no longer needed
- Default collections (PDF, Text, Code, Office, Other) cannot be deleted

### 4. **Filter by Custom Collections**
- Search only in your custom collections
- Combine default and custom collections in searches
- Get more targeted, relevant results

---

## 🚀 How to Use

### Creating a New Collection

1. **Click the "+ New" button** in the "Custom Collections" section
2. **Enter a name** for your collection (e.g., "Research Papers")
3. **Press Enter or click "Create"**
4. Your collection is now ready to use!

**Tips:**
- Use descriptive names
- Names are automatically sanitized (lowercase, alphanumeric)
- Spaces become underscores
- Example: "My Research Papers" → "my_research_papers"

### Uploading to a Custom Collection

1. **Select your target collection** from the "Upload to Collection" dropdown
2. **Choose "Auto-detect by file type"** to use default behavior
3. **Or select a specific collection** to upload there
4. **Upload your file** as usual

**Example Workflow:**
```
1. Create collection "Legal Documents"
2. Select "Legal Documents" in upload dropdown
3. Upload contract.pdf
4. File goes directly to "Legal Documents" collection
```

### Deleting a Custom Collection

1. **Find the collection** in the custom collections list
2. **Click the trash icon** (🗑️)
3. **Confirm deletion**
4. All documents in that collection are removed

⚠️ **Warning:** Deleting a collection removes all documents in it. This cannot be undone!

### Filtering by Custom Collections

1. **Upload documents to custom collections**
2. **Custom collections appear** in the collection filter badges
3. **Click badges** to filter searches
4. **Ask questions** - AI searches only selected collections

---

## 💡 Use Cases

### Use Case 1: Research Organization
**Scenario:** You're working on multiple research projects

**Solution:**
```
1. Create collections:
   - "AI Research"
   - "Climate Studies"
   - "Medical Papers"

2. Upload papers to respective collections

3. Filter by collection when asking questions:
   - Select "AI Research" → Ask about machine learning
   - Select "Climate Studies" → Ask about climate data
```

### Use Case 2: Client Projects
**Scenario:** You manage documents for different clients

**Solution:**
```
1. Create collections:
   - "Client A Documents"
   - "Client B Documents"
   - "Client C Documents"

2. Upload each client's files to their collection

3. Search only relevant client documents
```

### Use Case 3: Document Types
**Scenario:** You want more specific categorization than defaults

**Solution:**
```
1. Create collections:
   - "Contracts"
   - "Invoices"
   - "Meeting Notes"
   - "Technical Specs"

2. Manually assign documents to correct collections

3. Quick access to specific document types
```

---

## 🔧 Technical Details

### Backend API Endpoints

**Create Collection:**
```http
POST /api/collections/create
Body: { "name": "My Collection" }
```

**List All Collections:**
```http
GET /api/collections/list
Returns: { "collections": [...] }
```

**Delete Custom Collection:**
```http
DELETE /api/collections/custom/{collection_name}
```

**Upload to Specific Collection:**
```http
POST /api/upload
FormData: {
  file: <file>,
  embedding_model: "mxbai-embed-large:latest",
  target_collection: "my_collection"  // Optional
}
```

### MongoDB Structure

**Default Collections:**
- `documents_pdf`
- `documents_text`
- `documents_code`
- `documents_office`
- `documents_other`

**Custom Collections:**
- `documents_{your_name}`
- Example: `documents_research_papers`

### Collection Naming Rules

- **Allowed:** Letters, numbers, underscores
- **Converted:** Spaces → underscores
- **Case:** Lowercase only
- **Examples:**
  - "Research Papers" → `research_papers`
  - "Client-A" → `client_a`
  - "My Notes 2024" → `my_notes_2024`

---

## 📊 Features

### ✅ What's Included

- ✅ Create unlimited custom collections
- ✅ Upload to specific collections
- ✅ Auto-detect or manual assignment
- ✅ View all collections with document counts
- ✅ Delete custom collections
- ✅ Filter searches by custom collections
- ✅ Combine default and custom collections
- ✅ Real-time updates

### 🔒 Protections

- 🔒 Cannot delete default collections
- 🔒 Duplicate collection names prevented
- 🔒 Name sanitization for safety
- 🔒 Confirmation before deletion
- 🔒 Automatic indexing for performance

---

## 🎨 UI Components

### Custom Collections Section
Located in the left panel, below statistics:
- **"+ New" button** - Create new collection
- **Collection list** - View all custom collections
- **Trash icons** - Delete collections
- **Document counts** - See how many docs in each

### Upload Target Dropdown
Located above the upload area:
- **"Auto-detect by file type"** - Default behavior
- **All collections listed** - Choose specific target
- **Document counts shown** - See collection sizes

### Collection Filter Badges
Custom collections appear alongside default badges:
- **Click to filter** - Include in search
- **Multiple selection** - Combine collections
- **Visual feedback** - Active state shown

---

## 🎯 Best Practices

### Organization Tips

1. **Use Descriptive Names**
   - ❌ "Docs1", "Stuff", "Files"
   - ✅ "Legal Contracts", "Meeting Notes", "Research Papers"

2. **Group Related Documents**
   - Keep project documents together
   - Separate by client, topic, or purpose
   - Use consistent naming conventions

3. **Don't Over-Organize**
   - Too many collections can be confusing
   - Start with a few, add more as needed
   - Merge similar collections if possible

4. **Regular Cleanup**
   - Delete unused collections
   - Archive old project collections
   - Keep active collections manageable

### Performance Tips

1. **Use Collection Filtering**
   - Always filter when you know the source
   - Faster searches, better results
   - Reduces memory usage

2. **Balanced Collection Sizes**
   - Avoid putting all docs in one collection
   - Spread documents across relevant collections
   - Better performance with smaller collections

3. **Meaningful Categorization**
   - Group by actual usage patterns
   - Think about how you'll search
   - Optimize for your workflow

---

## 🐛 Troubleshooting

### Collection Not Appearing?
- Refresh the page
- Check if creation was successful
- Look for error messages

### Can't Delete Collection?
- Only custom collections can be deleted
- Default collections are protected
- Check if you have permission

### Upload Not Going to Selected Collection?
- Verify collection is selected in dropdown
- Check if "Auto-detect" is selected
- Refresh collection list

### Collection Name Invalid?
- Use only letters, numbers, underscores
- Avoid special characters
- Keep names reasonably short

---

## 📈 Advanced Usage

### Workflow Automation

**Example: Automatic Project Organization**
```
1. Create collections for each project
2. Set up naming conventions
3. Upload files to correct collections
4. Use filters for project-specific queries
```

### Multi-Collection Searches

**Example: Cross-Project Research**
```
1. Select multiple project collections
2. Ask questions across all selected
3. Get insights from multiple sources
4. Compare information across projects
```

### Collection Hierarchies

**Example: Nested Organization**
```
Create collections like:
- "Project_Alpha_Docs"
- "Project_Alpha_Code"
- "Project_Beta_Docs"
- "Project_Beta_Code"

Filter by project or document type
```

---

## 🎉 Summary

You now have **complete control** over your document organization:

- ✨ **Create custom collections** for any purpose
- 🎯 **Upload to specific collections** manually
- 🗂️ **Organize documents** your way
- 🔍 **Filter searches** by custom collections
- 🚀 **Better performance** with targeted searches
- 💪 **Full flexibility** in document management

**Start creating your custom collections now and organize your knowledge base exactly how you want it!**

---

## 🔗 Related Features

- [Light/Dark Mode](NEW_FEATURES.md#light-dark-mode)
- [Collection Filtering](NEW_FEATURES.md#collection-filtering)
- [Performance Optimization](CHANGELOG.md#performance-improvements)

---

**Made with ❤️ by Antigravity**
