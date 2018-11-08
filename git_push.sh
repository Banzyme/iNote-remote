#! bin/bash

git config --global user.name "endeesa"
echo Pushing to remote...
git add -A
read -p "Your commit message:  " msg
git commit -m "$msg"
git push