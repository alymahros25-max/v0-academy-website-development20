#!/usr/bin/env python3
"""Capture fixed-viewport screenshots for current and central country pages and compare pixels."""
from __future__ import annotations

import json
import os
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops, ImageStat

SLUGS = ["qatar", "oman", "jordan", "bahrain", "france", "spain", "netherlands", "belgium", "sweden", "kuwait"]
BASE_URL = os.environ.get("VISUAL_COMPARE_BASE_URL", "http://127.0.0.1:3021")
TOKEN = os.environ.get("COUNTRY_PREVIEW_TOKEN", "")
VIEWPORT = os.environ.get("VISUAL_VIEWPORT", "1440,5000")
REPORT_PATH = Path(os.environ.get("VISUAL_REPORT_PATH", "docs/country-renderer-visual-comparison.json"))


def capture(url: str, output: Path) -> None:
    command = [
        "chromium",
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--window-size={VIEWPORT}",
        "--virtual-time-budget=3000",
        f"--screenshot={output}",
        url,
    ]
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=20)
    if result.returncode != 0 or not output.exists():
        raise RuntimeError(f"Screenshot failed for {url}: {result.stderr[-500:]}")


def compare(current_path: Path, central_path: Path) -> dict[str, float | int | bool]:
    current = Image.open(current_path).convert("RGB")
    central = Image.open(central_path).convert("RGB")
    if current.size != central.size:
        return {"sameSize": False, "width": current.width, "height": current.height, "changedRatio": 1.0, "meanAbs": 255.0, "p95Abs": 255.0}
    diff = ImageChops.difference(current, central)
    stat = ImageStat.Stat(diff)
    pixels = current.width * current.height
    data = list(diff.get_flattened_data()) if hasattr(diff, "get_flattened_data") else list(diff.getdata())
    changed = sum(1 for pixel in data if max(pixel) > 16)
    values = sorted(max(pixel) for pixel in data)
    return {
        "sameSize": True,
        "width": current.width,
        "height": current.height,
        "changedRatio": round(changed / pixels, 6),
        "meanAbs": round(sum(stat.mean) / 3, 3),
        "p95Abs": values[int(len(values) * 0.95)],
    }


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="country-visual-") as directory:
        root = Path(directory)
        pages = []
        for slug in SLUGS:
            current_path = root / f"{slug}-current.png"
            central_path = root / f"{slug}-central.png"
            capture(f"{BASE_URL}/{slug}", current_path)
            capture(f"{BASE_URL}/country-preview/{slug}?token={TOKEN}", central_path)
            metrics = compare(current_path, central_path)
            pages.append({"slug": slug, **metrics})
            print(f"{slug}: changed={metrics['changedRatio']:.3f}, meanAbs={metrics['meanAbs']}, p95={metrics['p95Abs']}")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    report = {
        "schemaVersion": 1,
        "baseUrl": BASE_URL,
        "viewport": VIEWPORT,
        "scope": "first country renderer batch",
        "currentRenderer": "NewCountryLanding",
        "centralRenderer": "CountryPageRenderer",
        "comparison": "fixed-viewport pixel diff",
        "pages": pages,
        "summary": {
            "pages": len(pages),
            "allScreenshotsCaptured": len(pages) == len(SLUGS),
            "averageChangedRatio": round(sum(float(page["changedRatio"]) for page in pages) / len(pages), 6),
            "averageMeanAbs": round(sum(float(page["meanAbs"]) for page in pages) / len(pages), 3),
            "note": "This is a fixed viewport screenshot diff, not a semantic equivalence score. Different renderers are expected to produce visual differences before migration.",
        },
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {REPORT_PATH}")


if __name__ == "__main__":
    main()
