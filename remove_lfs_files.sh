#!/bin/bash

while IFS= read -r file; do
    git lfs rm --cached "$file"
done < lfs_files.txt

git add .
git commit -m "Remove all LFS files"
git push origin main
git lfs prune
