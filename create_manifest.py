import os
import hashlib
import json

def get_file_hash(file_path):
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def create_manifest(directories, output_file):
    manifest = {}
    for directory in directories:
        if not os.path.exists(directory):
            print(f"Warning: Directory {directory} not found. Skipping.")
            continue
        for root, dirs, files in os.walk(directory):
            for file in files:
                file_path = os.path.join(root, file)
                # Skip .git and other hidden folders
                if ".git" in file_path or ".obsidian" in file_path:
                    continue
                file_hash = get_file_hash(file_path)
                manifest[file_path] = file_hash
    
    with open(output_file, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"Manifest created at {output_file}")

if __name__ == "__main__":
    target_dirs = ["conductor", "docs"]
    create_manifest(target_dirs, "MANIFEST.json")
