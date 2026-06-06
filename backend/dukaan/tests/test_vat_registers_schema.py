import os

def test_vat_annex_13_schema_exists():
    """
    Test that the schema for VAT Annex 13 (Sales Register) is defined.
    """
    base_path = "backend/dukaan/dukaan/doctype/vat_annex_13"
    json_path = os.path.join(base_path, "vat_annex_13.json")
    assert os.path.exists(json_path), f"VAT Annex 13 schema not found at {json_path}"

def test_vat_annex_14_schema_exists():
    """
    Test that the schema for VAT Annex 14 (Purchase Register) is defined.
    """
    base_path = "backend/dukaan/dukaan/doctype/vat_annex_14"
    json_path = os.path.join(base_path, "vat_annex_14.json")
    assert os.path.exists(json_path), f"VAT Annex 14 schema not found at {json_path}"
