# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[('../frontend/dist', 'frontend')],
    hiddenimports=[
        'uvicorn.logging', 'uvicorn.loops', 'uvicorn.loops.auto',
        'uvicorn.protocols', 'uvicorn.protocols.http', 'uvicorn.protocols.http.auto',
        'uvicorn.lifespan', 'uvicorn.lifespan.on', 'langchain_community',
        'langchain_ollama', 'tiktoken', 'langchain_core', 'langchain_text_splitters',
        'pymongo', 'fastapi', 'starlette', 'pydantic', 'requests', 'pypdf',
        'python-multipart', 'numpy', 'scipy', 'scikit-learn', 'bson',
        'langchain_community.document_loaders', 'langchain_community.document_loaders.py_pdf',
        'langchain_community.llms', 'langchain_community.llms.ollama',
        'langchain_ollama.embeddings', 'langchain_ollama.chat_models',
        'typing', 'typing_extensions', 'uuid', 'json', 'os', 'sys', 'traceback',
        'shutil', 'bson.objectid'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='ragulea',
    debug=False,
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
