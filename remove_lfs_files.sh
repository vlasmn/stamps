#!/bin/bash

while IFS= read -r file; do
    git rm --cached "$file"
done < lfs_files.txt

git add .
git commit -m "Remove all LFS files"
git push origin master
git lfs prune
