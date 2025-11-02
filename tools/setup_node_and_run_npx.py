import os
import re
import sys
import shutil
import zipfile
import tempfile
import subprocess
from urllib.request import urlopen, urlretrieve


def ensure_node_and_run_npx(project_dir: str):
    base = 'https://nodejs.org/dist/latest-lts/'
    print('[INFO] Fetching latest LTS index:', base, flush=True)
    html = urlopen(base, timeout=60).read().decode('utf-8', errors='ignore')
    m = re.search(r'href="(node-v[\d\.]+-win-x64\.zip)"', html)
    if not m:
        raise RuntimeError('Could not locate Node.js LTS win-x64 zip in index page')
    zip_name = m.group(1)
    url = base + zip_name
    print('[INFO] Detected asset:', zip_name, flush=True)

    tmp_zip = os.path.join(tempfile.gettempdir(), 'node-lts.zip')
    print('[INFO] Downloading:', url, '->', tmp_zip, flush=True)
    urlretrieve(url, tmp_zip)

    dest_root = os.path.join(os.environ.get('LOCALAPPDATA', os.path.expanduser('~')), 'Tools', 'node-lts')
    os.makedirs(dest_root, exist_ok=True)
    print('[INFO] Extracting to:', dest_root, flush=True)
    with zipfile.ZipFile(tmp_zip) as zf:
        zf.extractall(dest_root)

    node_dir = os.path.join(dest_root, zip_name[:-4])  # strip .zip
    node_exe = os.path.join(node_dir, 'node.exe')
    npm_cmd = os.path.join(node_dir, 'node_modules', 'npm', 'bin', 'npm.cmd')
    npx_cmd = os.path.join(node_dir, 'node_modules', 'npm', 'bin', 'npx.cmd')

    if not os.path.isfile(node_exe):
        raise RuntimeError('node.exe not found at ' + node_exe)
    if not os.path.isfile(npm_cmd):
        raise RuntimeError('npm.cmd not found at ' + npm_cmd)
    if not os.path.isfile(npx_cmd):
        raise RuntimeError('npx.cmd not found at ' + npx_cmd)

    env = os.environ.copy()
    # Prepend node directory so child processes can find node/npm
    env['PATH'] = node_dir + os.pathsep + env.get('PATH', '')

    print('[INFO] Node path:', node_dir, flush=True)
    subprocess.run([node_exe, '-v'], check=True, env=env)
    subprocess.run([npm_cmd, '-v'], check=True, env=env)
    subprocess.run([npx_cmd, '--version'], check=True, env=env)

    print('[INFO] Running: npx -y @playwright/mcp@latest', flush=True)
    proc = subprocess.Popen([npx_cmd, '-y', '@playwright/mcp@latest'], cwd=project_dir, env=env)
    # Stream until process exits or user stops it. Here we wait; output appears in console.
    proc.wait()
    return proc.returncode


if __name__ == '__main__':
    project_dir = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    rc = ensure_node_and_run_npx(project_dir)
    sys.exit(rc)

