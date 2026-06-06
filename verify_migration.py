import hashlib
import json
import os

def get_file_hash(file_path):
    if not os.path.exists(file_path):
        return None
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def verify_migration(manifest_file, mapping):
    with open(manifest_file, "r") as f:
        manifest = json.load(f)
    
    results = []
    for original_path, target_path in mapping.items():
        if original_path not in manifest:
            results.append(f"ERROR: Original path {original_path} not found in manifest.")
            continue
        
        original_hash = manifest[original_path]
        target_hash = get_file_hash(target_path)
        
        if target_hash is None:
            results.append(f"ERROR: Target file {target_path} not found.")
        elif target_hash == original_hash:
            results.append(f"SUCCESS: {target_path} matches {original_path} (Hash: {target_hash[:8]})")
        else:
            results.append(f"FAILURE: Hash mismatch for {target_path}! Target: {target_hash[:8]}, Original: {original_hash[:8]}")
            
    return results

if __name__ == "__main__":
    migration_mapping = {
        "docs/API.md": "_Systems/API.md",
        "docs/DESIGN_SYSTEM.md": "_Components/DESIGN_SYSTEM.md",
        "docs/GROWTH_WIZARD.md": "_Components/GROWTH_WIZARD.md",
        "docs/USER_GUIDE.md": "_Components/USER_GUIDE.md",
        "docs/OBSIDIAN_SETUP.md": "_Systems/OBSIDIAN_SETUP.md"
    }
    
    report = verify_migration("MANIFEST.json", migration_mapping)
    print("\n".join(report))
    
    with open("VERIFICATION_REPORT.md", "w") as f:
        f.write("# Migration Verification Report\n\n")
        f.write("\n".join([f"- {r}" for r in report]))
